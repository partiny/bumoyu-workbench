export type { PropType } from 'vue'

/**
 * 链接Dto
 */
export interface LinkDto {
  id?: string;
  name?: string;
  iconText?: string;
  backgroundColor?: string;
  src?: string;
  type?: string;
  url?: string;
  view?: number;
  categoryId?: string;
  srcShow?: number;
}
/**
 * 链接树Dto
 */
export interface LinkTreeDto {
  id?: string;
  icon?: string;
  name?: string;
  children?: LinkDto[];
}
/**拖拽事件Dto */
export interface DragEventDto {
  item: {
    _underlying_vm_: LinkDto;
    dataset: {
      linkId: string;
    }
  },
  from: {
    dataset: {
      categoryId: string;
    }
  },
  to: {
    dataset: {
      categoryId: string;
    }
  }
}