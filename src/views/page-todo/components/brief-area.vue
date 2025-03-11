<template>
  <section class="p-16">
    <h3 class="font-size-16 fw-500 mb-20">待办</h3>
    <div class="calendar-wrap">
      <div class="flex items-center justify-between mb-16">
        <span class="font-size-14">{{ currentMonth }}</span>
        <div class="flex items-center gap-8">
          <a-button size="small" @click="handleToday">今天</a-button>
          <a-space>
            <a-button size="small" @click="changeMonth(-1)"><</a-button>
            <a-button size="small" @click="changeMonth(1)">></a-button>
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
import { ref, computed } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
const currentDate = ref<Dayjs>(dayjs());
const selectedDate = ref<Dayjs | null>(null);

const currentMonth = computed(() => currentDate.value.format('YYYY年MM月'));

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

function selectDate(date: { date: Dayjs }) {
  selectedDate.value = date.date;
}

function changeMonth(offset: number) {
  currentDate.value = currentDate.value.add(offset, 'month');
}

function handleToday() {
  currentDate.value = dayjs();
  selectedDate.value = null;
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
            color: #fff;
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
            border: 1px solid var(--qt-primary-color);
          }
        }
      }
    }
  }
}
</style>