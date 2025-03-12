<template>
  <div class="calendar-operation">
    <span>{{ currentMonth }}</span>
    <div class="flex items-center gap-8">
      <a-button
        size="small"
        @click="changeMonth(-1)"
      >&lt;</a-button>
      <a-button
        size="small"
        @click="changeMonth(1)"
      >&gt;</a-button>
    </div>
  </div>
  <div class="calendar-main">
    <div class="calendar-header">
      <div 
        v-for="day in weekDays" 
        :key="day"
      >
        周{{ day }}
      </div>
    </div>
    <div class="calendar-grid">
      <div 
        v-for="(date, index) in calendarDates"
        :key="index"
        class="calendar-item"
        :class="{
          'other-month': !date.isCurrentMonth,
          'today': date.isToday
        }"
      >
        <div class="calendar-item-date"><span>{{ date.day }}</span>日</div>
        <ul class="todo-list">
          <li 
            v-for="(todo, idx) in todos" 
            :key="idx"
            class="todo-item"
          >
            {{ todo.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import useCalendar from '../hooks/use-calendar';
import useForm from '../hooks/use-form';

const {
  currentDate,
  weekDays,
  currentMonth,
  calendarDates,
  changeMonth
} = useCalendar()
const { handleFormAdd } = useForm()

const todos = ref([
  { title: '团队会议', time: '10:00' },
  { title: '项目评审', time: '14:30' },
  { title: '客户沟通', time: '16:00' }
]);
</script>

<style lang="scss" scoped>
.calendar-operation {
  display: flex;
  align-items: center;
  column-gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--qt-text-1);
  flex-shrink: 0;
}
.calendar-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto hidden;
}
.calendar-header {
  padding: 8px 0;
  color: var(--qt-text-2);
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  margin-bottom: 8px;
  border-bottom-width: 1px;
  font-size: 14px;
  flex-shrink: 0;
}
.calendar-grid {
  flex: 1;
  gap: 1px;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  overflow-y: auto;
}
.calendar-item {
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  padding: 8px;
  height: 100%;
  font-size: 14px;
  color: var(--qt-text-1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 56px;
  
  &-date {
    display: flex;
    align-items: center;
    column-gap: 2px;
    > span {
      display: inline-flex;
      width: 26px;
      height: 26px;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
  }
  &.other-month {
    color: #cccdd2;
  }
  &.today {
    .calendar-item-date span {
      background-color: var(--qt-primary-color);
      color: #fff;
    }
  }
}
.todo-list {
  flex: 1;
  overflow-y: auto;
  padding-top: 2px;
}
.todo-item {
  font-size: 10px;
  padding: 1px 4px;
  background-color: var(--qt-bg-gray);
  border-radius: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    background-color: var(--qt-sub-color);
  }
}
</style>