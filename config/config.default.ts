import type { NavigationType } from './interface'

/**
 * 默认配置，切勿修改！！！
 * 默认配置，切勿修改！！！
 * 默认配置，切勿修改！！！
*/
export default {
  /**主题配置 */
  theme: {
    /**明暗模式 */
    mode: 'light', // light | dark
    /**主题色 */
    color: '#2b4acb',
  },
  /**导航配置 */
  navigation: {
    /**分类类型 */
    category: 'single',
    /**导航类型 */
    link: 'card'
  },
  /**搜索配置 */
  search: {
    /**搜索引擎 */
    engine: 'bing' as 'bing' | 'baidu'
  },
  /**侧边栏菜单 */
  sidebar: {
    /**是否折叠 */
    fold: true, // true | false
    /**触发方式 */
    trigger: 'click', // 'hover' | 'click'
  }
}