// 备份相关Api

const PREFIX = `${import.meta.env.VITE_BASE_URL}/backup`

export const ApiBackup = {
  /**获取备份记录列表 */
  getBackupList: `${PREFIX}/get-backup-list`,
  /**手动备份 */
  manualBackup: `${PREFIX}/manual-backup`,
  /**删除指定备份记录 */
  deleteBackup: `${PREFIX}/delete-backup`,
  /**恢复指定备份记录 */
  recoverBackup: `${PREFIX}/recover-backup`,
  /**下载指定备份记录 */
  exportBackup: `${PREFIX}/export-backup`,
  /**导出当前链接分类数据 */
  exportCurrentLinkData: `${PREFIX}/export-current-link-data`
}