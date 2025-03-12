import dayjs, { Dayjs } from 'dayjs';
import { computed, ref } from "vue"


const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const currentDate = ref<Dayjs>(dayjs())
const selectedDate = ref<Dayjs>(dayjs())

const currentMonth = computed(() => currentDate.value.format('YYYY年MM月'))
const calendarDates = computed(() => {
  const startOfMonth = currentDate.value.startOf('month');
  const endOfMonth = currentDate.value.endOf('month');
  const today = dayjs();

  // 生成6周（42天）的日期数组
  const dates = [];
  const startDay = startOfMonth.day();
  
  // 添加上月补全日期
  for (let i = startDay - 1; i >= 0; i--) {
    const date = startOfMonth.subtract(i + 1, 'day');
    dates.push(createDateObject(date, false, today));
  }

  // 添加当月日期
  for (let d = startOfMonth; d.isBefore(endOfMonth); d = d.add(1, 'day')) {
    dates.push(createDateObject(d, true, today));
  }

  // 添加下月补全日期
  const remaining = 42 - dates.length;
  for (let i = 1; i <= remaining; i++) {
    const date = endOfMonth.add(i, 'day');
    dates.push(createDateObject(date, false, today));
  }

  return dates;
});
function createDateObject(date: Dayjs, isCurrentMonth: boolean, today: Dayjs) {
  return {
    date,
    day: date.date(),
    isCurrentMonth,
    isToday: date.isSame(today, 'day'),
    isSelected: selectedDate.value?.isSame(date, 'day')
  };
}
/**回到今天 */
function backToToday() {
  currentDate.value = dayjs()
  selectedDate.value = dayjs()
}
/**修改月份 */
function changeMonth(offset: number) {
  currentDate.value = currentDate.value.add(offset, 'month');
}

export default () => ({
  weekDays,
  currentDate,
  selectedDate,
  currentMonth,
  calendarDates,
  backToToday,
  changeMonth
})