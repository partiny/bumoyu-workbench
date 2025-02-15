/**百度搜索返回的关联内容Dto */
export interface BaiduResponseContent {
  type?: string;
  sa?: string;
  q?: string;
}
/**百度搜索返回的数据Dto */
export interface BaiduResponse {
  q?: string,
  p?: boolean,
  g?: BaiduResponseContent[],
  slid?: string,
  queryid?: string
}
/**必应搜素返回的数据Dto */
export interface BingResponse {
  i?: { ig?: string; };
  s?: { id?: string; q?: string; t?: string; u?: string; }[]
}

/**格式化后返回的搜索引擎Dto */
export interface EngineDto {
  code?: 'baidu' | 'bing';
  name?: string;
  icon?: string;
  url?: string;
}
/**格式化后返回的关联内容Dto */
export interface SuggestionDto {
  id: number;
  content: string;
  fullUrl: string;
}