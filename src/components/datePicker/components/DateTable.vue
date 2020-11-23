<template>
  <div class="date-table" @click.stop>
    <div class="date-table-head">
      <button class="date-table-prev" @click.stop="prevMonth">
        <svg-icon name="angle-left" />
      </button>
      <p class="date-table-current">
        {{ this.currentYear }} {{ $t(`date.month.month${currentMonth + 1}`) }}
      </p>
      <button class="date-table-next" @click.stop="nextMonth">
        <svg-icon name="angle-right" />
      </button>
    </div>
    <div class="date-table-inner">
      <div class="date-table-content">
        <div class="date-table-header">
          <div class="date-table-header-row">
            <div class="date-table-header-cell">
              <div class="date-table-week">
                {{ $t('date.weeks.sun') }}
              </div>
            </div>
            <div class="date-table-header-cell">
              <div class="date-table-week">
                {{ $t('date.weeks.mon') }}
              </div>
            </div>
            <div class="date-table-header-cell">
              <div class="date-table-week">
                {{ $t('date.weeks.tue') }}
              </div>
            </div>
            <div class="date-table-header-cell">
              <div class="date-table-week">
                {{ $t('date.weeks.wed') }}
              </div>
            </div>
            <div class="date-table-header-cell">
              <div class="date-table-week">
                {{ $t('date.weeks.thu') }}
              </div>
            </div>
            <div class="date-table-header-cell">
              <div class="date-table-week">
                {{ $t('date.weeks.fri') }}
              </div>
            </div>
            <div class="date-table-header-cell">
              <div class="date-table-week">
                {{ $t('date.weeks.sat') }}
              </div>
            </div>
          </div>
        </div>
        <div class="date-table-body">
          <div
            class="date-table-body-row"
            v-for="(row, index) in tableCell"
            :key="index"
          >
            <div
              class="date-table-body-cell"
              v-for="(cell, index) in row"
              :key="index"
            >
              <div class="date-table-day" :class="getCellClass(cell)">
                <button
                  class="date-table-day-button"
                  v-if="cell.value"
                  @click.stop="selectDate(cell.value)"
                  @mousemove="handleMouseMove(cell.value)"
                >
                  <span class="date-table-day-text">{{ cell.value }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import dateUtils from '@/utils/date';

type CellType = 'today' | 'include' | 'selecting' | 'normal';

interface Cell {
  type: CellType;
  isStart: boolean;
  isEnd: boolean;
  value: string;
}

const ROW = 6;
const COL = 7;

@Component
export default class DateTable extends Vue {
  @Prop() readonly selectedDate!: Array<Date | null>;
  @Prop({ default: false }) readonly isRange!: boolean;
  @Prop({ default: false }) readonly visible!: boolean;

  currentDate = new Date();

  startDate: Date | null = null;
  endDate: Date | null = null;

  selecting = false;

  @Watch('visible')
  onVisibleChanged(visible: boolean) {
    if (visible) {
      if (this.isRange) {
        this.endDate = this.selectedDate[1];
      }
      this.startDate = this.selectedDate[0];
      if (this.startDate) {
        this.currentDate = this.startDate;
      }
    }
  }

  get currentYear() {
    return this.currentDate.getFullYear();
  }

  get currentMonth() {
    return this.currentDate.getMonth();
  }

  get tableCell() {
    const month = dateUtils.getMonthArray(this.currentYear, this.currentMonth);
    const offset = dateUtils.getFirstDayOfMonth(this.currentDate);
    const cell = this.getDefaultTableCell();
    for (let j = offset; j < COL; j++) {
      const date = month.shift();
      if (date) {
        cell[0][j].value = date.toString();
        this.getCellType(cell[0][j], date);
      }
    }
    for (let i = 1; i < ROW; i++) {
      for (let j = 0; j < COL; j++) {
        const date = month.shift();
        if (date) {
          cell[i][j].value = date.toString();
          this.getCellType(cell[i][j], date);
        }
      }
    }
    return cell;
  }

  getCellType(cell: Cell, date: number) {
    if (dateUtils.isToday(this.currentYear, this.currentMonth, date)) {
      cell.type = 'today';
    }
    if (this.startDate && !this.endDate) {
      if (
        dateUtils.isStart(
          this.currentYear,
          this.currentMonth,
          date,
          this.startDate
        )
      ) {
        cell.isStart = true;
      }
    }
    if (this.startDate && this.endDate) {
      const [start, end] = [this.startDate, this.endDate].sort((s, e) => {
        return s.getTime() - e.getTime();
      });
      if (dateUtils.isStart(this.currentYear, this.currentMonth, date, start)) {
        cell.isStart = true;
      }
      if (dateUtils.isEnd(this.currentYear, this.currentMonth, date, end)) {
        cell.isEnd = true;
      }
      if (
        dateUtils.inRange(this.currentYear, this.currentMonth, date, start, end)
      ) {
        if (this.selecting) {
          cell.type = 'selecting';
        } else {
          cell.type = 'include';
        }
      }
    }
  }

  getCellClass(cell: Cell) {
    let className = `o-${cell.type}`;
    if (cell.isStart) {
      className += ' o-start';
    }
    if (cell.isEnd) {
      className += ' o-end';
    }
    return className;
  }

  prevMonth() {
    this.currentDate = dateUtils.prevMonth(this.currentYear, this.currentMonth);
  }

  nextMonth() {
    this.currentDate = dateUtils.nextMonth(this.currentYear, this.currentMonth);
  }

  selectDate(date: string) {
    if (this.isRange) {
      if (this.selecting) {
        // select end date
        this.$emit(
          'select',
          [this.startDate!, this.endDate!].sort((s, e) => {
            return s.getTime() - e.getTime();
          })
        );
        this.selecting = false;
      } else {
        this.startDate = new Date(
          this.currentYear,
          this.currentMonth,
          Number(date)
        );
        this.endDate = null;
        this.selecting = true;
      }
    } else {
      this.$emit(
        'select',
        new Date(this.currentYear, this.currentMonth, Number(date))
      );
    }
  }

  handleMouseMove(date: string) {
    if (this.selecting) {
      this.endDate = new Date(
        this.currentYear,
        this.currentMonth,
        Number(date)
      );
    }
  }

  getDefaultTableCell(): Array<Array<Cell>> {
    const cells = [];
    const cell: Cell = {
      type: 'normal',
      value: '',
      isStart: false,
      isEnd: false
    };

    for (let i = 0; i < ROW; i++) {
      const row = [];
      for (let j = 0; j < COL; j++) {
        row.push({ ...cell });
      }
      cells.push(row);
    }
    return cells;
  }
}
</script>
<style lang="scss">
@mixin icon-small-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  .svg-icon {
    width: 16px;
    height: 16px;
  }
  &:hover {
    background-color: var(--black-light-bg);

    &:disabled {
      background-color: transparent;
    }
  }
}

.date-table {
  height: 304px;
  border-radius: 0.4px;
  box-shadow: 0 2px 4px 0 var(--black-divider);
  background-color: var(--white);

  &-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
  }

  &-prev,
  &-next {
    @include icon-small-button;
  }

  &-inner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-day {
    margin: 1px 0;
    padding: 0 1px;
    border: dashed 1px transparent;

    &-button {
      @include icon-small-button;
      color: var(--black-main);
      font-size: 12px;
    }

    &.o-today &-button {
      border: 1px solid var(--black-border);
    }

    &.o-start {
      border-radius: 50% 0 0 50%;

      &.o-end {
        border-radius: 50%;
      }
    }

    &.o-end {
      border-radius: 0 50% 50% 0;
    }

    &.o-start &-button &,
    &.o-end &-button & {
      &-text {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        color: var(--white);
        background-color: var(--primary);
      }
    }

    &.o-selecting {
      border-top: dashed 1px var(--black-border);
      border-bottom: dashed 1px var(--black-border);
    }

    &.o-include {
      background-color: rgba(24, 144, 255, 0.05);
    }
  }

  &-week {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--black-secondary);
    font-size: 12px;
  }

  &-content {
    display: table;
  }

  &-header {
    display: table-header-group;

    &-row {
      display: table-row;
    }

    &-cell {
      display: table-cell;
    }
  }

  &-body {
    display: table-row-group;

    &-row {
      display: table-row;
    }

    &-cell {
      display: table-cell;
    }
  }
}
</style>
