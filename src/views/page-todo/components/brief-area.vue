<template>
  <section class="p-16">
    <h3 class="font-size-16 fw-500 mb-20">待办</h3>
    <div class="calendar-wrap">
      <div class="flex items-center justify-between mb-16">
        <span class="font-size-14">{{ currentMonth }}</span>
        <div class="flex items-center gap-8">
          <a-button type="primary" ghost size="small" @click="backToToday">今天</a-button>
          <a-space>
            <a-button type="primary" ghost size="small" @click="changeMonth(-1)"><</a-button>
            <a-button type="primary" ghost size="small" @click="changeMonth(1)">></a-button>
          </a-space>
        </div>
      </div>
      <div class="calendar-main">
        <div class="calendar-header">
          <div v-for="day in weekDays" :key="day" class="header-cell">{{ day }}</div>
        </div>
        <ul class="calendar-grid">
          <li 
            v-for="(date, index) in calendarDates"
            :key="index"
            class="grid-item"
            :class="{
              'other-month': !date.isCurrentMonth,
              'today': date.isToday,
              'before-today': date.isBeforeToday,
              'selected': date.isSelected
            }"
            @click="selectDate(date)"
          >
            <span class="grid-item-date">{{ date.day }}</span>
            <div class="h-6 w-100% flex justify-center">
              <span v-if="date.todoList.length" class="grid-item-todo"></span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Dayjs } from 'dayjs';
import useCalendar from '../hooks/use-calendar';

const {
  weekDays,
  selectedDate,
  currentMonth,
  calendarDates,
  backToToday,
  changeMonth
} = useCalendar()

function selectDate(date: { date: Dayjs }) {
  selectedDate.value = date.date;
}


</script>

<style lang="scss" scoped>
.calendar-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  color: var(--qt-text-2);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  font-size: 13px;

  &-date {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .3s;
    color: var(--qt-text-1);
    margin-bottom: 6px;
    border: 1px solid transparent;
  }
  &-todo {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--qt-primary-color);
  }
  &:hover {
    .grid-item-date {
      background-color: var(--qt-sub-color);
      color: var(--qt-primary-color);
    }
  }

  &.other-month {
    .grid-item-date {
      color: #cccdd2;
    }
  }

  &.today {
    .grid-item-date {
      border-color: var(--qt-primary-color);
    }
  }

  &.selected {
    .grid-item-date {
      background-color: var(--qt-primary-color);
      color: #fff;
    }
  }
  &.before-today {
    .grid-item-todo {
      background-color: rgba(92, 92, 237, .5);
    }
  }
}
</style>