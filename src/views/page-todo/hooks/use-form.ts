import { ApiTodo } from "@/apis";
import { http } from "@/utils";
import { Form } from "ant-design-vue";
import dayjs from "dayjs";
import { reactive, ref } from "vue";
import { message as toast } from "ant-design-vue";

const visible = ref(false)
const initForm = () => {
  return {
    title: '', // 待办标题
    type: 'work', // 待办类型
    content: '', // 待办内容
    dateTime: dayjs()
    .startOf('hour')
    .minute(Math.floor(dayjs().minute() / 30) * 30)
    .add(30, 'minute')
    .format('YYYY-MM-DD HH:mm'), // 初始化为最近的整点或半点
    status: 'pending', // 待办状态
    priority: 'medium', // 待办优先级
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
/**重置表单 */
function resetForm() {
  Object.assign(form, initForm())
}
/**获取待办 */
function getTodoList() {
  return new Promise((resolve, reject) => {
    http.get(ApiTodo.getAllTodoList)
      .then(res => {
        const { success, message, data } = res
        if (!success) {
          toast.error(message || '获取待办错误')
          resolve([])
          return
        }
        resolve(data || [])
      })
      .catch(error => {
        toast.error(error || '获取待办错误')
        resolve([])
      })
  })
}

export default () => ({
  visible,
  form,
  // clearValidate,
  // validate,
  handleFormAdd,
  handleFormEdit,
  resetForm,
  getTodoList
})