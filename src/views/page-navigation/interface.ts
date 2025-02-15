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