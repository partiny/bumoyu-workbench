// 文件相关Api

const PREFIX = `${import.meta.env.VITE_BASE_URL}/file`

export const ApiFile = {
  /**处理导入的链接文件，返回固定json格式的数据 */
  processLocalLinkFile: `${PREFIX}/process-local-link-file`,
}