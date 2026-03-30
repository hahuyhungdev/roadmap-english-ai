#!/usr/bin/env node
const videoId = process.argv[2];
if (!videoId) {
  console.error('Usage: node scripts/yt_diagnose.js VIDEO_ID');
  process.exit(2);
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function run() {
  console.log('Diagnosing', videoId);
  try {
    // 1) Fetch watch page
    const watch = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
    });
    console.log('watch status', watch.status);
    const setCookie = watch.headers.get('set-cookie') || watch.headers.get('Set-Cookie') || '';
    console.log('set-cookie header present:', Boolean(setCookie));
    const html = await watch.text();
    const apiKeyMatch = html.match(/"INNERTUBE_API_KEY"\s*:\s*"([a-zA-Z0-9_-]+)"/);
    console.log('INNERTUBE_API_KEY found:', !!apiKeyMatch);
    if (apiKeyMatch) console.log('apiKey snippet:', apiKeyMatch[1].slice(0, 10) + '...');

    // 2) Try youtubei player if apiKey exists
    if (apiKeyMatch) {
      const apiKey = apiKeyMatch[1];
      const resp = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${apiKey}&prettyPrint=false`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': UA, ...(setCookie ? { Cookie: setCookie } : {}) },
        body: JSON.stringify({ videoId, context: { client: { clientName: 'ANDROID', clientVersion: '20.10.38' } } }),
      }).catch((e) => ({ error: e }));
      if (resp && resp.error) {
        console.log('youtubei fetch error:', resp.error.message);
      } else {
        console.log('youtubei status', resp.status);
        const json = await resp.json();
        console.log('captions present:', !!(json.captions && json.captions.playerCaptionsTracklistRenderer));
        if (json.captions && json.captions.playerCaptionsTracklistRenderer) {
          console.log('captionTracks length:', (json.captions.playerCaptionsTracklistRenderer.captionTracks || []).length);
        }
      }
    }

    // 3) timedtext fallback
    try {
      const t = await fetch(`https://video.google.com/timedtext?v=${videoId}&lang=en`, { headers: { 'User-Agent': UA } });
      console.log('timedtext status', t.status);
      const ttxt = await t.text();
      console.log('timedtext contains transcript tag:', ttxt.includes('<transcript>'));
      console.log('timedtext snippet:', ttxt.slice(0, 200).replace(/\n/g, ' '));
    } catch (e) {
      console.log('timedtext fetch error:', e.message);
    }

    // 4) get_video_info fallback
    try {
      const gv = await fetch(`https://www.youtube.com/get_video_info?video_id=${videoId}&html5=1`, { headers: { 'User-Agent': UA } });
      console.log('get_video_info status', gv.status);
      const txt = await gv.text();
      console.log('get_video_info length', txt.length);
      const params = new URLSearchParams(txt);
      const player_response = params.get('player_response') || params.get('player_response_json') || '';
      console.log('player_response present:', !!player_response);
      if (player_response) {
        try {
          const pr = JSON.parse(player_response);
          const caps = pr.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
          console.log('captions from player_response length:', caps.length);
          if (caps.length) console.log('first caption url sample:', (caps[0].baseUrl || '').slice(0, 200));
        } catch (e) {
          console.log('player_response parse error', e.message);
        }
      }
    } catch (e) {
      console.log('get_video_info error', e.message);
    }
  } catch (err) {
    console.error('diagnose failed:', err instanceof Error ? err.message : String(err));
  }
}

run();
