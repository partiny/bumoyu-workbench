/**待办Dto */
export interface TodoItem {
  id?: string;
  title?: string;
  content?: string;
  rangeTime?: string[];
  startTime?: string;
  endTime?: string;
  status?: string;
  priority?: string;
  type?: string;
}