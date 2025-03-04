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
    engine: 'bing'
  },
  /**菜单 */
  menu: {
    autoHide: 'hide', // 自动隐藏 'hide' | 'show'
    hideType: 'click', // 'hover' | 'click'
  }
}