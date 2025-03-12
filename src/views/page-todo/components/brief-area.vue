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
        <div class="calendar-grid">
          <div 
            v-for="(date, index) in calendarDates"
            :key="index"
            class="date-cell"
            :class="{
              'other-month': !date.isCurrentMonth,
              'today': date.isToday,
              'selected': date.isSelected
            }"
            @click="selectDate(date)"
          >
            <div class="date-cell-main">{{ date.day }}</div>
          </div>
        </div>
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
.calendar-wrap {
  .calendar-main {
    display: flex;
    flex-direction: column;
    gap: 8px;

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

      .date-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
        font-size: 13px;

        &-main {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all .3s;
          color: var(--qt-text-1);
        }
        &:hover {
          .date-cell-main {
            background-color: var(--qt-sub-color);
            color: var(--qt-primary-color);
          }
        }

        &.other-month {
          .date-cell-main {
            color: #cccdd2;
          }
        }

        &.today {
          .date-cell-main {
            background-color: var(--qt-primary-color);
            color: #fff;
          }
        }

        &.selected {
          .date-cell-main {
            background-color: var(--qt-primary-color);
            color: #fff;
          }
        }
      }
    }
  }
}
</style>