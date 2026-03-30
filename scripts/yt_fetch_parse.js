#!/usr/bin/env node
const videoId = process.argv[2];
if (!videoId) {
  console.error('Usage: node scripts/yt_fetch_parse.js VIDEO_ID');
  process.exit(2);
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function extractCookie(resp) {
  const val = resp.headers.get('set-cookie') || '';
  return val.split(/,\s*(?=[a-zA-Z_-]+=)/).map(c => c.split(';')[0]).filter(Boolean).join('; ');
}

function parseTranscriptXml(xml) {
  const segments = [];
  const tagRe = /<text\s+start="([^"]+)"\s+dur="([^"]+)"[^>]*>([\s\S]*?)<\/text>/g;
  let m;
  while ((m = tagRe.exec(xml)) !== null) {
    const text = m[3]
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/\s+/g, ' ')
      .trim();
    if (!text || /^\[.{1,30}\]$/.test(text)) continue;
    segments.push({ text, startMs: Math.round(parseFloat(m[1]) * 1000), durMs: Math.round(parseFloat(m[2]) * 1000) });
  }

  const sentences = [];
  let buf = '';
  let bufStart = 0;
  let bufEnd = 0;
  for (const seg of segments) {
    if (!buf) { buf = seg.text; bufStart = seg.startMs; } else buf += ' ' + seg.text;
    bufEnd = seg.startMs + seg.durMs;
    const endsWithPunct = /[.!?]\s*$/.test(seg.text);
    const tooLong = buf.length > 220 || bufEnd - bufStart > 12000;
    if (endsWithPunct || tooLong) {
      sentences.push({ text: buf.trim(), startMs: bufStart, endMs: bufEnd });
      buf = '';
    }
  }
  if (buf.trim()) sentences.push({ text: buf.trim(), startMs: bufStart, endMs: bufEnd });
  return sentences;
}

(async function run(){
  try {
    console.log('Fetching watch page...');
    const watch = await fetch(`https://www.youtube.com/watch?v=${videoId}`, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' } });
    const setCookie = extractCookie(watch);
    const html = await watch.text();
    const apiKey = (html.match(/"INNERTUBE_API_KEY"\s*:\s*"([a-zA-Z0-9_-]+)"/) || [])[1] || '';
    console.log('watch status', watch.status, 'apiKey found:', !!apiKey);

    if (!apiKey) {
      console.error('No INNERTUBE_API_KEY found; aborting.');
      process.exit(1);
    }

    console.log('Fetching youtubei player...');
    const resp = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${apiKey}&prettyPrint=false`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': UA, ...(setCookie ? { Cookie: setCookie } : {}) },
      body: JSON.stringify({ videoId, context: { client: { clientName: 'ANDROID', clientVersion: '20.10.38' } } }),
    });

    if (!resp.ok) {
      console.error('youtubei player returned', resp.status);
      process.exit(1);
    }
    const player = await resp.json();
    const tracks = player.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
    console.log('captionTracks length:', tracks.length);
    if (!tracks.length) { console.error('No caption tracks found'); process.exit(1); }

    // prefer English
    const pick = tracks.find(t => t.languageCode === 'en') || tracks[0];
    let capUrl = pick.baseUrl || '';
    capUrl = capUrl.replace(/&fmt=srv3/g, '');
    console.log('Fetching caption URL sample (first 200 chars):', capUrl.slice(0,200));

    const capResp = await fetch(capUrl, { headers: { 'User-Agent': UA, ...(setCookie ? { Cookie: setCookie } : {}) } });
    if (!capResp.ok) { console.error('caption fetch failed', capResp.status); process.exit(1); }
    const xml = await capResp.text();
    console.log('XML length', xml.length);
    if (!xml.includes('<transcript>') && !xml.includes('<text')) {
      console.warn('Caption XML did not include <transcript> or <text> tags; dumping snippet...');
      console.log(xml.slice(0,500));
      process.exit(1);
    }

    const sentences = parseTranscriptXml(xml);
    console.log(JSON.stringify({ videoId, language: pick.languageCode, sentences }, null, 2));
  } catch (e) {
    console.error('Error:', e instanceof Error ? e.message : String(e));
    process.exit(1);
  }
})();
