/**右键上下文相关 */

import type { ContextMenuProps } from "@/directives/context-menu/interface";
import { useCategory } from "./use-category";
import { useLink } from "./use-link";
import { Modal, message as toast } from "ant-design-vue";
import { http, openNewTab } from "@/utils";
import { ApiBackup } from "@/apis";
import type { LinkDto } from "../interface";

const { categoryInfo, categoryEvent } = useCategory()
const { linkEvent } = useLink()

/**获取导航页面右键上下文菜单配置 */
function getNavigationContextMenuProps(): ContextMenuProps {
  return {
    options: [
      { name: '新增分类', code: 'category-add' },
      { name: '新增导航', code: 'link-add' },
      // { name: '导入本地文件', code: 'link-import' },
      { name: '备份一下', code: 'backup' }
    ],
    onChoose({ code }) {
      switch(code) {
        case 'category-add':
          categoryEvent.add()
          break
        case 'link-add':
          linkEvent.add()
          break
        case 'link-import':
          (document.querySelector('#category-input') as HTMLInputElement)?.click()
          break
        case 'backup':
          handleBackup()
          break
      }
    }
  }
}

/**备份当前导航 */
function handleBackup() {
  Modal.confirm({
    title: '提示',
    content: '备份所有分类和链接，本地主题配置不会保存',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      http.post(ApiBackup.manualBackup)
        .then(res => {
          const { success, message  } = res
          if (!success) {
            toast.error(message || '备份失败')
            return
          }
          toast.success('备份成功，可在历史备份记录中查看')
        })
        .catch(error => {
          toast.error(error || '备份失败')
        })
    }
  })
}

/**获取分类右键上下文菜单配置 */
function getCategoryContextMenuProps(categoryId?: string): ContextMenuProps {
  return {
    options: [
      { name: '新增分类', code: 'category-add' },
      { name: '编辑分类', code: 'category-edit' },
      { name: '删除分类', code: 'category-delete' },
      { name: '添加导航', code: 'link-add' }
    ],
    onChoose(item) {
      const category = categoryInfo.list.find(ca => ca.id === categoryId) || {}
      switch(item.code) {
        case 'category-add':
          categoryEvent.add()
          break;
        case 'category-edit':
          categoryEvent.edit(category)
          break;
        case 'category-delete':
          categoryEvent.delete(category.id)
          break
        case 'link-add':
          linkEvent.add(category.id)
          break
      }
    }
  }
}

/**获取链接右键上下文菜单配置 */
function getLinkContextMenuProps(item: LinkDto, categoryId: string): ContextMenuProps {
  return {
    options: [
    { name: '在新标签页打开', code: 'link-open' },
    { name: '编辑', code: 'link-edit' },
    { name: '删除', code: 'link-delete' }
    ],
    onChoose({ code }) {
      const list = categoryInfo.list.find(category => category.id === categoryId)?.children || []
      const link = list.find(link => link.id === item.id) ?? {}
      switch(code) {
        case 'link-open':
          openNewTab(link.url)
          break
        case 'link-edit':
          // 此处直接取item，取到的不是最新的，暂时未找到解决方案
          // 所以通过id从list中重新获取item
          linkEvent.edit(link, categoryId)
          break
        case 'link-delete':
          linkEvent.delete(link.id)
          break
      }
    }
  }
}

export default () => ({
  /**获取分类右键上下文菜单配置 */
  getCategoryContextMenuProps,
  /**获取链接右键上下文菜单配置 */
  getLinkContextMenuProps,
  /**获取导航页面右键上下文菜单配置 */
  getNavigationContextMenuProps
})