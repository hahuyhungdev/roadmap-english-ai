export interface TocItem {
  id: string;
  level: 2 | 3 | 4;
  text: string;
}

export interface HeadingAnchor extends TocItem {
  includeInToc: boolean;
  line: number;
}
