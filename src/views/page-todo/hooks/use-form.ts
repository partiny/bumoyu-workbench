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
    dateTime: getTargetTime(), // 初始化为最近的整点或半点
    status: 'pending', // 待办状态
    priority: 'medium', // 待办优先级
  }
}
const form = reactive(initForm())

/**创建待办 */
function handleFormAdd(date?: Dayjs) {
  if (dayjs(date).isValid()) form.dateTime = getTargetTime(date)
  visible.value = true
}
/**修改待办 */
function handleFormEdit(item: TodoItem) {
  Object.keys(form).forEach((key) => {
    if (key in item) {
      form[key as keyof typeof form] = item[key as keyof TodoItem] as string
    }
  })
  visible.value = true
}
/**预览待办 */
function handleFormView(item: TodoItem) {
  Object.keys(form).forEach((key) => {
    if (key in item) {
      form[key as keyof typeof form] = item[key as keyof TodoItem] as string
    }
  })
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

export default () => ({
  visible,
  previewVisible,
  form,
  handleFormAdd,
  handleFormEdit,
  handleFormView,
  resetForm
})