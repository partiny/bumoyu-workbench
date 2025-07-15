import { reactive, ref } from "vue";
import type { DragEventDto, LinkDto } from "../interface";
import { http } from "@/utils";
import { ApiLink } from "@/apis";
import { Modal, message as toast } from "ant-design-vue";
import { useCategory } from "./use-category";

const { categoryInfo, categoryEvent } = useCategory()

/**链接相关信息 */
const linkInfo = reactive({
  list: [] as LinkDto[], // 多组件模式下每个分类下的链接列表
  /**新增/编辑表单相关信息 */
  form: {
    /**分类id */
    categoryId: null as string | null,
    /**控制表单显隐 */
    show: false,
    /**当前选中的链接数据 */
    current: {} as LinkDto
  }
})

/**新增链接 */
function handleLinkAdd(categoryId?: string) {
  linkInfo.form.current = {}
  if (categoryId) linkInfo.form.categoryId = categoryId
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
      dragStart: handleDragStartNew,
      dragEnd: handleDragEndNew,
      add: handleLinkAdd,
      edit: handleLinkEdit,
      delete: handleLinkDelete,
      isDragging
    }
  }
}