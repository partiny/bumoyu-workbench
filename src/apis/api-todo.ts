// 链接相关Api

const PREFIX = `${import.meta.env.VITE_BASE_URL}/todo`

export const ApiTodo = {
  /**获取所有待办（不带分页） */
  getAllTodoList: `${PREFIX}/get-all-todo-list`,
  /**新增待办 */
  addTodo: `${PREFIX}/add-todo`,
  /**修改待办 */
  updateTodo: `${PREFIX}/update-todo`,
  /**删除指定待办 */
  deleteTodo: `${PREFIX}/delete-todo`
}