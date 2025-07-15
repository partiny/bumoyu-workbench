import { ApiFile, ApiLink } from "@/apis";
import { http } from "@/utils";
import type { PagingResponse } from "@/utils/http/interface";
import type { LinkTreeDto } from "@/views/page-navigation/interface";
import { reactive } from "vue";
import { Modal, message as toast } from 'ant-design-vue'


/**链接分类相关信息 */
const categoryInfo = reactive({
  /**分类列表（包含所有链接） */
  list: [] as LinkTreeDto[],
  /**请求成功标识 */
  requestFinished: false,
  /**新增/编辑表单相关信息 */
  form: {
    /**控制表单显隐 */
    show: false,
    /**当前选中的分类数据 */
    current: {} as LinkTreeDto
  }
})

/**获取所有链接分类及其下链接 */
function getCategoryList() {
  return http.post<PagingResponse<LinkTreeDto>>(ApiLink.getLinkTreeList)
    .then(res => {
      categoryInfo.requestFinished = true
      const { data, message, success } = res || {}
      if (!success) {
        toast.error(message || '获取链接数据错误')
        return
      }
      if (!data) {
        toast.error('获取链接数据失败')
        return
      }
      categoryInfo.list = data.list || []
    })
    .catch(error => {
      categoryInfo.requestFinished = true
      toast.error(error || '获取链接数据错误')
    })
}
/**链接分类拖拽开始事件 */
let oldIds: string | null = null
function handleDragStart() {
  oldIds = categoryInfo.list.map(item => item.id).join(',')
}
/**链接分类拖拽结束事件 */
function handleDragEnd() {
  const ids = categoryInfo.list.map(item => item.id)
  if (!ids.length) {
    toast.info('未获取到分类id')
    return
  }

  if (ids.join(',') === oldIds) {
    oldIds = null
    return
  }
  oldIds = null
  http.post(ApiLink.updateOrderOfCategorys, { ids })
    .then(res => {
      const { success, message  } = res
      if (!success) {
        toast.error(message || '修改排序请求错误')
        return
      }
      getCategoryList()
    })
    .catch(error => {
      toast.error(error || '修改排序请求错误')
    })
}
/**新增分类 */
function handleCategoryAdd() {
  categoryInfo.form.current = {}
  categoryInfo.form.show = true
}
/**编辑分类 */
function handleCategoryEdit(item: LinkTreeDto) {
  categoryInfo.form.current = item
  categoryInfo.form.show = true
}
/**删除分类 */
function handleCategoryDelete(id?: string) {
  if (!id) {
    toast.info('未获取到分类id')
    return
  }
  Modal.confirm({
    title: '提示',
    content: '分类删除后，当前分类下所有链接也会清空。删除后不可恢复，确认删除？',
    cancelText: '取消',
    okText: '确认',
    onOk() {
      http.post(ApiLink.deleteLinkCategory, { id })
        .then(res => {
          const { success, message  } = res
          if (!success) {
            toast.error(message || '删除分类请求错误')
            return
          }
          toast.success('删除成功')
          getCategoryList()
        })
        .catch(error => {
          toast.error(error || '删除分类请求错误')
        })
    }
  })
}
/**
 * 导入导航文件
 */
function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0]
  if (!file) return
  http.postFile<{ navConfig?: LinkTreeDto[] }>(ApiFile.processLocalLinkFile, { file })
    .then(res => {
      const { success, data, message  } = res
      if (!success) {
        toast.error(message || '解析数据错误')
        return
      }
      const list = data?.navConfig || []
      if (!list.length) {
        toast.info('获取的数据为空')
        return
      }
      Modal.confirm({
        title: '选择导入方式',
        content: `获取到${list.length}个链接分类，选择导入方式`,
        cancelText: '覆盖导入',
        okText: '追加导入',
        maskClosable: true,
        closable: true,
        onCancel() {
          Modal.confirm({
            title: '提示',
            content: '覆盖后，现有链接将被清空，此操作不可还原',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              addLinksFromItab('cover', list)
            }
          })
        },
        onOk() {
          Modal.confirm({
            title: '提示',
            content: '现有链接不会被清空，新链接将追加到现有分类之后',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              addLinksFromItab('append', list)
            }
          })
        }
      })
    })
    .catch(error => {
      toast.error(error || '解析数据错误')
    })
}
function addLinksFromItab(type: string, list: LinkTreeDto[]) {
  http.post(
    type === 'cover' ? ApiLink.batchOverlayLinksFromItab : ApiLink.batchAddLinksFromItab,
    { list }
  ).then(res => {
    const { success, message  } = res
    if (!success) {
      toast.error(message || '导入数据错误')
      return
    }
    toast.success('导入成功')
    getCategoryList()
  }).catch(error => {
    toast.error(error || '导入数据错误')
  })
}

/**链接分类 - 数据相关 */
export const useCategory = () => {
  return {
    /**链接分类相关信息 */
    categoryInfo,
    /**链接分类相关事件 */
    categoryEvent: {
      add: handleCategoryAdd,
      delete: handleCategoryDelete,
      edit: handleCategoryEdit,
      dragStart: handleDragStart,
      dragEnd: handleDragEnd,
      getList: getCategoryList,
      importFile: handleFileChange
    }
  }
}