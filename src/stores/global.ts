import { ref } from 'vue'
import DefaultConfig from '../../config/config.default'
import { defineStore } from 'pinia'

type ConfigKey = keyof typeof DefaultConfig

export const useGlobalStore = defineStore('global', () => {
  const config = ref(Object.assign({}, DefaultConfig))
  /**初始化配置项 */
  function initConfig() {
    const localConfig = JSON.parse(localStorage.getItem('LOCAL_CONFIG') || '{}')

    if (Object.keys(localConfig).length) {
      Object.assign(config.value, localConfig)
    }

    console.log('init-config: ', config.value)
  }
  /**更新单个配置项 */
  function updateConfig<T extends ConfigKey>(
    key: T,
    value: typeof DefaultConfig[T]
  ) {
    console.log('update-config: ', key, value)
    if (!key || !value) {
      throw new Error('key or value is empty')
    }
    config.value[key] = value

    persistConfig()
  }
  /**持久化配置 */
  async function persistConfig() {
    // 本次存储
    localStorage.setItem('LOCAL_CONFIG', JSON.stringify(config.value))

    // 此处可配置远程存储
    // if (isLoggedIn()) {
    //   await api.updateUserConfig(this.config)
    // }
  }

  return {
    config,
    initConfig,
    updateConfig
  }
})
