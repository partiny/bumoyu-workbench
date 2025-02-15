import type { ComponentPublicInstance } from "vue";

/**
 * 右键上下文菜单对象
 */
export interface MenuItem {
  code: string;
  name: string;
}

/**
 * 右键上下文配置属性
 */
export interface ContextMenuProps {
  options: MenuItem[];
  onChoose?: (item: MenuItem) => void;
}

/**
 * 上下文组件实例
 */
export interface ContextMenuInstance extends ComponentPublicInstance {
  open: (x: number, y: number) => void;
  close: (e?: MouseEvent) => void;
  setOptions: (options: MenuItem[]) => void;
  setOnChoose: (onChoose?: (item: MenuItem) => void) => void;
}