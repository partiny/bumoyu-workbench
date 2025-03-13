import dayjs, { Dayjs } from "dayjs";
import { reactive, ref } from "vue";
import type { TodoItem } from "../interface";

const visible = ref(false)
const previewVisible = ref(false)
const initForm = (): TodoItem => {
  return {
    id: undefined,
    title: '', // 待办标题
    type: 'work', // 待办类型
    content: '', // 待办内容
    rangeTime: getLatestRangeTime(),
    status: 'pending', // 待办状态
    priority: 'medium', // 待办优先级
  }
}
const form = reactive(initForm())

/**创建待办 */
function handleFormAdd(date?: Dayjs) {
  if (dayjs(date).isValid()) form.rangeTime = getLatestRangeTime([date, date] as Dayjs[])
  visible.value = true
}
/**修改待办 */
function handleFormEdit(item: TodoItem) {
  if (item.id) form.id = item.id
  if (item.title) form.title = item.title
  if (item.type) form.type = item.type
  if (item.content) form.content = item.content
  if (item.rangeTime) form.rangeTime = item.rangeTime
  if (item.status) form.status = item.status
  if (item.priority) form.priority = item.priority
  
  visible.value = true
}
/**预览待办 */
function handleFormView(item: TodoItem) {
  if (item.id) form.id = item.id
  if (item.title) form.title = item.title
  if (item.type) form.type = item.type
  if (item.content) form.content = item.content
  if (item.rangeTime) form.rangeTime = item.rangeTime
  if (item.status) form.status = item.status
  if (item.priority) form.priority = item.priority

  previewVisible.value = true
}
/**重置表单 */
function resetForm() {
  Object.assign(form, initForm())
}
/**获取最近的指定日期时间（时间00或30） */
function getTargetTime(date?: Dayjs) {
  if (date) {
    return (dayjs(date).startOf('hour')
    .minute(Math.floor(dayjs(date).minute() / 30) * 30)
    .format('YYYY-MM-DD HH:mm'))
  }
  return (dayjs().startOf('hour')
  .minute(Math.floor(dayjs().minute() / 30) * 30)
  .add(30, 'minute')
  .format('YYYY-MM-DD HH:mm'))
}
/**获取最近的指定日期时间范围（时间00或30） */
function getLatestRangeTime(range?: Dayjs[]) {
  return [
    getTargetTime(range?.[0]),
    getTargetTime(range?.[1])
  ]
}

export default () => ({
  visible,
  previewVisible,
  form,
  handleFormAdd,
  handleFormEdit,
  handleFormView,
  resetForm
})