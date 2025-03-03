import { createApp, type DirectiveBinding } from "vue";
import ContextMenu from "./context-menu.vue";
import type { ContextMenuInstance, ContextMenuProps } from "./interface";

// 创建全局实例，采用全局单例模式创建指令，避免删除某个指令而影响其他指令的问题。
let contextMenu: ContextMenuInstance | null = null
interface ExtendElement extends HTMLElement {
  _closeMenu?: (e: MouseEvent) => void;
}

export default {
  beforeMount(el: ExtendElement, binding: DirectiveBinding<ContextMenuProps>) {
    const { options, onChoose } = binding.value

    const menuInstance = createContextMenu()

    // 定义关闭菜单的函数
    const closeMenu = (e?: MouseEvent) => {
      if (menuInstance) menuInstance.close(e);
    };

    // 将 closeMenu 赋值给 el._closeMenu，以便在 unmounted 中清理
    el._closeMenu = closeMenu;

    el.addEventListener('contextmenu', event => {
      event.preventDefault()
      event.stopPropagation()

      if (!options?.length || !menuInstance) return

      // 更新上下文菜单和关闭方法
      menuInstance.setOptions(options)
      menuInstance.setOnChoose(onChoose)

      const domBody = document.querySelector('body')?.getBoundingClientRect()
      let x = event.clientX
      let y = event.clientY
      if (domBody) {
        // x轴边界处理，130是上下文菜单选项的宽度
        if (x > domBody.right - 130) {
          x = x - 130
        }
        // y轴边界处理，30是上下文菜单选项的宽度，8是上下文菜单上下padding
        if (y > domBody.bottom - options.length * 30 - 8) {
          y = domBody.bottom - options.length * 30 - 8
        }
      }
      
      menuInstance.open(x, y)
    })
  },
  unmounted(el: ExtendElement) {
    if (el._closeMenu) {
      document.removeEventListener('click', el._closeMenu, true);
      document.removeEventListener('contextmenu', el._closeMenu, true);
      delete el._closeMenu
    }
  },
}

// 创建全局 contextMenu 实例
function createContextMenu() {
  if (!contextMenu) {
    const app = createApp(ContextMenu, { options: [], onChoose: () => {} });
    contextMenu = app.mount(document.createElement('div')) as ContextMenuInstance;

    // 添加全局事件监听器，用于关闭菜单
    const closeMenu = (e?: MouseEvent) => {
      if (contextMenu) contextMenu.close(e);
    };
    document.addEventListener('click', closeMenu, { capture: false }); // 默认冒泡阶段
    document.addEventListener('contextmenu', closeMenu, true);
  }
  return contextMenu;
}
