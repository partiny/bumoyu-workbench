<template>
  <section class="p-16 flex-1 overflow-auto">
    <div class="min-w-600">
      <a-segmented v-model:value="segmented.current" :options="segmented.options" />
      <div class="flex items-center justify-between mb-16 border-b pb-8">
        <span class="font-size-14 text-gray-800 pl-2">{{ currentMonth }}</span>
        <div class="flex items-center gap-8">
          <a-button size="small" @click="changeMonth(-1)">&lt;</a-button>
          <a-button size="small" @click="changeMonth(1)">&gt;</a-button>
        </div>
      </div>
      <div class="calendar-main">
        <div class="calendar-header grid grid-cols-7 mb-8 border-b">
          <div 
            v-for="day in weekDays" 
            :key="day" 
            class="text-left font-size-14 text-gray-500 pb-8 pl-2"
          >
            {{ day }}
          </div>
        </div>
        <div class="calendar-grid grid grid-cols-7 gap-1">
          <div 
            v-for="(date, index) in calendarDates"
            :key="index"
            class="date-cell"
            :class="{
              'other-month': !date.isCurrentMonth,
              'today': date.isToday
            }"
          >
            <div class="date-cell-main">
              <div class="text-left font-size-14"><span>{{ date.label }}</span>日</div>
              <div class="todo-list mt-1">
                <div 
                  v-for="(todo, idx) in todos" 
                  :key="idx"
                  class="todo-item"
                >
                  {{ todo.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

const segmented = reactive({
  current: 'day',
  options: [
    { value: 'day', label: '日' },
    { value: 'week', label: '周' },
    { value: 'month', label: '月' }
  ]
});

const currentDate = ref<Dayjs>(dayjs());
const today = ref<Dayjs>(dayjs());
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const currentMonth = computed(() => currentDate.value.format('YYYY年MM月'));

const calendarDates = computed(() => {
  const startOfMonth = currentDate.value.startOf('month');
  const endOfMonth = currentDate.value.endOf('month');
  const firstDayOfGrid = startOfMonth.startOf('week');
  const lastDayOfGrid = endOfMonth.endOf('week');

  const dates = [];
  for (let d = firstDayOfGrid; d.isBefore(lastDayOfGrid); d = d.add(1, 'day')) {
    dates.push({
      date: d,
      label: d.date(),
      isCurrentMonth: d.isSame(currentDate.value, 'month'),
      isToday: d.isSame(today.value, 'day')
    });
  }
  return dates;
});

const todos = ref([
  { title: '团队会议', time: '10:00' },
  { title: '项目评审', time: '14:30' },
  { title: '客户沟通', time: '16:00' }
]);

function changeMonth(offset: number) {
  currentDate.value = currentDate.value.add(offset, 'month');
}
</script>

<style lang="scss" scoped>
.calendar-main {
  min-width: 600px;
  overflow-x: auto;
  .calendar-header {
    padding: 8px 0;
    color: var(--qt-text-2);
  }

  .calendar-grid {
    gap: 4px;
    
    .date-cell {
      aspect-ratio: 1;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
      padding: 8px;
      border: 1px solid var(--qt-border-color);

      &-main {
        font-size: 14px;
        color: var(--qt-text-1);
        height: 100%;
        
        .todo-list {
          max-height: calc(100% - 24px);
          overflow-y: auto;
        }
      }
      &.other-month {
        .date-cell-main {
          color: #cccdd2;
        }
      }

      &.today {
        .date-cell-main {
          position: relative;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 26px;
            height: 26px;
            background-color: var(--qt-primary-color);
            border-radius: 50%;
            z-index: -1;
          }
          color: #fff;
        }
      }
    }
  }

  .todo-item {
    font-size: 10px;
    padding: 1px 0;
    background-color: var(--qt-bg-gray);
    border-radius: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>