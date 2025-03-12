import { Form } from "ant-design-vue";
import dayjs from "dayjs";
import { reactive, ref } from "vue";

const visible = ref(false)
const initForm = () => {
  return {
    title: '', // 待办标题
    type: '', // 待办类型
    content: '', // 待办内容
    dateTime: dayjs()
    .startOf('hour')
    .minute(Math.floor(dayjs().minute() / 30) * 30)
    .add(30, 'minute'), // 初始化为最近的整点或半点
    status: 0, // 待办状态
    priority: 0, // 待办优先级
  }
}
const form = reactive(initForm())

/**创建待办 */
function handleFormAdd() {
  visible.value = true
}
/**修改待办 */
function handleFormEdit() {
  visible.value = true
}
/**关闭待办抽屉 */
// function handleFormClose() {
//   visible.value = false
//   Object.assign(form, initForm())
  
// }
/**重置表单 */
function resetForm() {
  Object.assign(form, initForm())
}

export default () => ({
  visible,
  form,
  // clearValidate,
  // validate,
  handleFormAdd,
  handleFormEdit,
  resetForm
  // handleFormClose
})