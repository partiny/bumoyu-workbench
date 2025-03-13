import { ApiTodo } from "@/apis"
import { http } from "@/utils"
import { message as toast } from "ant-design-vue";
import { ref } from "vue";
import type { TodoItem } from "../interface";

/**待办类型列表 */
const todoTypeList = [
  { code: 'work', name: '工作' },
  { code: 'personal', name: '个人' },
  { code: 'other', name: '其他' }
]
/**待办优先级列表 */
const todoPriorityList = [
  { code: 'low', name: '低' },
  { code: 'medium', name: '中' },
  { code: 'high', name: '高' }
]
/**待办状态列表 */
const todoStatusList = [
  { code: 'pending', name: '待定' },
  { code: 'completed', name: '已完成' },
  { code: 'archived', name: '已归档' }
]

/**待办列表 */
const todoList = ref<TodoItem[]>([])
/**获取待办 */
function getTodoList(): Promise<TodoItem[]> {
  return new Promise(resolve => {
    http.get<TodoItem[]>(ApiTodo.getAllTodoList)
      .then(res => {
        const { success, message, data } = res
        if (!success) {
          toast.error(message || '获取待办错误')
          resolve([])
          return
        }
        resolve((data || []).map(item => ({
          ...item,
          rangeTime: item.startTime && item.endTime ? [item.startTime, item.endTime] : []
        })))
      })
      .catch(error => {
        toast.error(error || '获取待办错误')
        resolve([])
      })
  })
}
/**获取待办类型名称 */
function getTodoTypeName(type?: string) {
  const typeItem = todoTypeList.find(item => item.code === type)
  return typeItem?.name || '-'
}
/**获取待办优先级名称 */
function getTodoPriorityName(priority?: string) {
  const priorityItem = todoPriorityList.find(item => item.code === priority)
  return priorityItem?.name || '-'
}
/**获取待办状态名称 */
function getTodoStatusName(status?: string) {
  const statusItem = todoStatusList.find(item => item.code === status)
  return statusItem?.name || '-'
}

/**初始化待办列表 */
async function initTodo() {
  todoList.value = await getTodoList()
}

export default () => ({
  todoList,
  getTodoList,
  initTodo,
  todoTypeList,
  todoPriorityList,
  todoStatusList,
  getTodoTypeName,
  getTodoPriorityName,
  getTodoStatusName
})