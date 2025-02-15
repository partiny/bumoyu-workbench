import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { engineList, type EngineType } from '@/views/page-navigation/components/search-area/core'

/**导航页主题 */
export const navigationTheme: { [key: string]: string } = {
  single: '单组件主题',
  multiple: '多组件主题'
}
type NavType = keyof typeof navigationTheme
const linkList = ['singleCard', 'multipleRound', 'multipleBar'] as const
type LinkType = typeof linkList[number]
const searchEngineList = engineList.map(item => item.code) || []

export const useThemeStore = defineStore('theme', () => {
  const theme = reactive({
    navigation: getNavigation(), // single单组件模式 multiple多组件模式
    link: getLink(),
    searchEngine: getSearchEngine()
  })

  /**获取导航页面主题 */
  function getNavigation(): NavType {
    const { navigation } = JSON.parse(localStorage.getItem('theme') || '{}')
    if (navigation && Reflect.has(navigationTheme, navigation)) return navigation
    return 'single'
  }
  /**设置导航页面主题 */
  function setTheme(nav: NavType) {
    if (nav === theme.navigation) return
    if (!nav || !Reflect.has(navigationTheme, nav)) {
      console.warn('导航主题的类型选错啦！')
      return
    }
    theme.navigation = nav
    
    if (nav === 'single') {
      setLink('singleCard')
    } else {
      setLink('multipleBar')
    }
  }
  /**获取导航页面链接主题 */
  function getLink(): LinkType {
    let { navigation, link } = JSON.parse(localStorage.getItem('theme') || '{}')
    if (!navigation || Reflect.has(navigationTheme, navigation)) navigation = 'single'
    if (navigation === 'single') {
      if (!linkList.includes(link)) {
        return 'singleCard'
      }
    } else {
      if (!linkList.includes(link)) {
        return 'multipleBar'
      }
    }
    return link
  }
  /**设置导航页面链接主题 */
  function setLink(link: LinkType) {
    const { navigation } = theme
    if (navigation === 'single') {
      if (!link || !['singleCard'].includes(link)) {
        console.warn('链接主题的类型选错啦！')
        return
      }
    } else {
      if (!link || !['multipleRound', 'multipleBar'].includes(link)) {
        console.warn('链接主题的类型选错啦！')
        return
      }
    }
    
    theme.link = link
    localStorage.setItem('theme', JSON.stringify(theme))
  }
  /**获取搜索引擎类型 */
  function getSearchEngine(): EngineType {
    const { searchEngine } = JSON.parse(localStorage.getItem('theme') || '{}')
    if (searchEngine && searchEngineList.includes(searchEngine)) return searchEngine
    return 'bing'
  }
  /**设置搜索引擎类型 */
  function setSearchEngine(engine: EngineType) {
    if (!engine || !searchEngineList.includes(engine)) {
      console.warn('搜索引擎的类型不存在')
      return
    }
    theme.searchEngine = engine
    localStorage.setItem('theme', JSON.stringify(theme))
  }

  return { theme, setTheme, setLink, setSearchEngine }
})
