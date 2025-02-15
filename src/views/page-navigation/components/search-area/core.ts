import { ApiAuth } from '@/apis';
import IconBaidu from '@/assets/images/IconBaidu.svg'
import IconBing from '@/assets/images/IconBing.svg'
import { http } from '@/utils';
import type { BaiduResponse, BingResponse, EngineDto, SuggestionDto } from './interface';

/**
 * 搜索引擎列表
 * @returns {Array} engine - 搜索引擎列表
 * @returns {string} engine[].code - 搜索引擎编码
 * @returns {string} engine[].name - 搜索引擎名称
 * @returns {string} engine[].icon - 搜索引擎logo
 * @returns {string} engine[].url - 搜索引擎搜索链接
*/
export const engineList: EngineDto[] = [
  {
    code: 'baidu',
    name: '百度',
    icon: IconBaidu,
    url: 'https://www.baidu.com'
  },
  {
    code: 'bing',
    name: '必应',
    icon: IconBing,
    url: 'https://cn.bing.com'
  }
]


const engineConfig = {
  baidu: searchByBaidu,
  bing: searchByBing
}

export type EngineType = keyof typeof engineConfig

/**
 * 获取关联内容
 * @param {string} engineType - 搜索引擎类型
 * @param {string} keyword - 搜索的关键词
 * @returns {Array} suggestion - 关联内容对象
 * @returns {number} suggestion.id - 关联内容id
 * @returns {string} suggestion.content - 关联内容
 * @returns {string} suggestion.fullUrl - 关联内容完整链接
 */
export async function getSuggestions(
  engineType: EngineType,
  keyword: string
): Promise<SuggestionDto[]> {
  if (!engineType || !engineConfig.hasOwnProperty(engineType)) {
    console.warn('先选择一个搜素引擎吧！')
    return Promise.resolve([])
  }
  if (!keyword) return Promise.resolve([])
  
  return await engineConfig[engineType](keyword)
}

/**百度搜索 */
function searchByBaidu(keyword: string): Promise<SuggestionDto[]> {
  return new Promise(resolve => {
    http.post<BaiduResponse>(ApiAuth.proxy, {
      url: `https://www.baidu.com/sugrec?&prod=pc&wd=${keyword}`
    })
      .then(res => {
        const { success, data } = res
        if (!success || !data) {
          resolve([])
          return
        }
        const list = (data?.g || []).filter(item => item.q)
        const formatList = list.map((item, index) => ({
          id: index,
          content: item.q || '',
          fullUrl: getFullUrl('baidu', item.q || '')
        })) || []
        resolve(formatList)
      })
      .catch(() => {
        resolve([])
      })
  })
}
/**必应搜索 */
function searchByBing(keyword: string): Promise<SuggestionDto[]> {
  return new Promise(resolve => {
    http.post<BingResponse>(ApiAuth.proxy, {
      url: `https://cn.bing.com/AS/Suggestions?pt=page.home&mkt=zh-cn&qry=${keyword}&cp=${keyword.length}&csr=1&msbqf=false&cvid=1`
    })
      .then(res => {
        const { success, data } = res
        if (!success || !data) {
          resolve([])
          return
        }
        const list = (data?.s || []).filter(item => item.q)
        const formatList = list.map((item, index) => {
          const content = filterString(item.q || '')
          return {
            id: index,
            content,
            fullUrl: `https://cn.bing.com${item.u}`
          }
        }) || []
        resolve(formatList)
      })
      .catch(() => {
        resolve([])
      })
  })
}
/**必应搜索返回的数据中会包含特殊字符，需要额外过滤一下 */
function filterString(input: string): string {
  // 正则表达式解释：
  // \u4e00-\u9fa5 汉字范围
  // a-zA-Z 英文字母范围
  // 0-9 数字范围
  // (?!\\s) 负向前瞻，确保不匹配任何空白字符
  // [ ] 匹配一个空格
  // [\+\-\*\/] 加减乘除符号
  // [，。！？；：“”‘’（）] 常规中文标点符号
  // [,.!?;:()"'"] 常规英文标点符号
  const regex = /[\u4e00-\u9fa5a-zA-Z0-9\+\-\*\/，。！？；：“”‘’（）,.!?;:()"'']| (?!\\s)/g;
  return input.replace(/(?!\ )[\\s]/g, '').match(regex)?.join('') || '';
}

/**
 * 获取完整的搜索url
 * @param {string} engineType - 搜索引擎
 * @param {string} keyword - 搜索关键词
 * @returns {string} fullUrl - 完整的搜索url
 */
export function getFullUrl(engineType: EngineType, keyword: string): string {
  let url = ''
  if (!engineType || !engineConfig.hasOwnProperty(engineType)) {
    console.warn('先选择一个搜素引擎吧！')
    return url
  }
  
  switch (engineType) {
    case 'baidu':
      url = `https://www.baidu.com/s?wd=${(keyword || '')}&ie=utf-8`
      break
    case 'bing':
      url = `https://cn.bing.com/search?q=${(keyword || '')}`
      break
  }

  return url
}