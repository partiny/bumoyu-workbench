// 链接相关Api

const PREFIX = `${import.meta.env.VITE_BASE_URL}/link`

export const ApiLink = {
  /**获取所有分类下链接列表（树结构） */
  getLinkTreeList: `${PREFIX}/get-link-tree-list`,
  /**获取所有链接分类列表（不带分页） */
  getAllLinkCategoryList: `${PREFIX}/get-all-link-category-list`,
  /**批量导入iTab链接（追加） */
  batchAddLinksFromItab: `${PREFIX}/batch-add-links-from-itab`,
  /**批量导入iTab链接（覆盖） */
  batchOverlayLinksFromItab: `${PREFIX}/batch-overlay-links-from-itab`,
  /**新增链接分类 */
  addLinkCategory: `${PREFIX}/add-link-category`,
  /**修改链接分类 */
  updateLinkCategory: `${PREFIX}/update-link-category`,
  /**删除指定链接分类 */
  deleteLinkCategory: `${PREFIX}/delete-link-category`,
  /**新增链接 */
  addLink: `${PREFIX}/add-link`,
  /**修改链接 */
  updateLink: `${PREFIX}/update-link`,
  /**删除指定链接 */
  deleteLink: `${PREFIX}/delete-link`,
  /**批量修改链接顺序 */
  updateOrderOfLinks: `${PREFIX}/update-order-of-links`,
  /**批量修改分类顺序 */
  updateOrderOfCategorys: `${PREFIX}/update-order-of-categorys`,
  /**批量修改链接顺序（可跨分类） */
  updateOrderOfLinksCrossCategory: `${PREFIX}/update-order-of-links-cross-category`,
}