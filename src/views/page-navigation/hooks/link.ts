import { reactive, ref } from "vue";
import type { DragEventDto, LinkDto, LinkTreeDto } from "../interface";
import { http, openNewTab } from "@/utils";
import type { ContextMenuProps } from "@/directives/context-menu/interface";
import { ApiLink } from "@/apis";
import { Modal, message as toast } from "ant-design-vue";
import { useCategory } from "./category";

const { category: categoryInfo, categoryEvent } = useCategory()

/**链接相关信息 */
const linkInfo = reactive({
  list: [] as LinkDto[], // 多组件模式下每个分类下的链接列表
  /**新增/编辑表单相关信息 */
  form: {
    /**分类id */
    categoryId: '',
    /**控制表单显隐 */
    show: false,
    /**当前选中的链接数据 */
    current: {} as LinkDto
  }
})

/**获取分类右键上下文菜单配置事件 */
function getCategoryContextMenuProps(categoryId?: string): ContextMenuProps {
  return {
    options: [
      { name: '新增分类', code: 'category-add' },
      { name: '编辑分类', code: 'category-edit' },
      { name: '删除分类', code: 'category-delete' },
      { name: '添加链接', code: 'link-add' }
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
          handleLinkAdd(category.id)
          break
      }
    }
  }
}
/**获取链接右键上下文菜单配置事件 */
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
          handleLinkEdit(link, categoryId)
          break
        case 'link-delete':
          handleLinkDelete(link.id)
          break
      }
    }
  }
}
/**新增链接 */
function handleLinkAdd(categoryId?: string) {
  if (!categoryId) {
    toast.info('先去创建一个分类吧')
    return
  }
  linkInfo.form.current = {}
  linkInfo.form.categoryId = categoryId
  linkInfo.form.show = true
}
/**编辑链接 */
 function handleLinkEdit(item: LinkDto, categoryId: string) {
  if (!categoryId) {
    toast.info('未获取到分类id')
    return
  }
  linkInfo.form.current = item
  linkInfo.form.categoryId = categoryId
  linkInfo.form.show = true
}
/**删除链接 */
 function handleLinkDelete(id?: string) {
  const isDeleting = ref(false)

  if (!id) {
    toast.info('未获取到分类id')
    return
  }
  Modal.confirm({
    title: '提示',
    content: '链接删除后不可恢复，确认删除？',
    cancelText: '取消',
    okText: '确认',
    onOk() {
      if (isDeleting.value) return;
      isDeleting.value = true;
      http.post(ApiLink.deleteLink, { id })
        .then(res => {
          isDeleting.value = false;
          const { success, message  } = res
          if (!success) {
            toast.error(message || '删除链接请求错误')
            return
          }
          toast.success('删除成功')
          onRefresh()
        })
        .catch(error => {
          isDeleting.value = false;
          toast.error(error || '删除链接请求错误')
        })
    }
  })
}
/**拖拽开始 */
let oldIds: string | null = null
const isDragging = ref(false)
/**拖拽开始 */
function handleDragStartNew(e: DragEventDto) {
  if (isDragging.value) return
  isDragging.value = true

  const { id: linkId, categoryId } = e.item?._underlying_vm_ || {}
  if (!linkId || !categoryId) {
    toast.info('未获取到分类id或链接id')
    return
  }

  const list = categoryInfo.list.find(category => category.id === categoryId)?.children || []
  oldIds = list.map(item => item.id).join(',')
}

/**拖拽结束 */
function handleDragEndNew(e: DragEventDto, currentList?: LinkDto[]) {
  // 多组件模式下用currentList

  const fromCategoryId = e.from?.dataset?.categoryId
  const toCategoryId = e.to?.dataset?.categoryId
  const itemLinkId = e.item?.dataset?.linkId
  const endList = currentList || categoryInfo.list.find(category => category.id === toCategoryId)?.children || []

  if (!fromCategoryId || !toCategoryId || !itemLinkId) {
    toast.info('未获取到分类id或链接id')
    isDragging.value = false
    return
  }

  const linkIds = endList.map(item => item.id)

  if (linkIds.join(',') === oldIds) {
    oldIds = null
    return
  }

  const params = {
    linkId: itemLinkId,
    fromCategoryId,
    toCategoryId,
    toLinkIds: linkIds
  }
  
  http.post(ApiLink.updateOrderOfLinksCrossCategory, params)
    .then(res => {
      isDragging.value = false
      const { success, message } = res
      if (!success) {
        toast.error(message || '修改排序请求错误')
        return
      }
      onRefresh()
    })
    .catch(error => {
      isDragging.value = false
      toast.error(error || '修改排序请求错误')
    })
}

/**刷新分类列表 */
function onRefresh() {
  categoryEvent.getList()
}

/**链接 - 数据相关 */
export const useLink = () => {
  return {
    /**链接相关信息 */
    linkInfo,
    /**链接相关事件 */
    linkEvent: {
      getCategoryContextMenuProps,
      getLinkContextMenuProps,
      dragStart: handleDragStartNew,
      dragEnd: handleDragEndNew,
      add: handleLinkAdd,
      isDragging
    }
  }
}