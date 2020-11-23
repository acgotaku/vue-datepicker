function getDayCountOfMonth(year: number, month: number) {
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30;
  }

  if (month === 1) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return 29;
    } else {
      return 28;
    }
  }

  return 31;
}

function getFirstDayOfMonth(date: Date) {
  const temp = new Date(date.getTime());
  temp.setDate(1);
  return temp.getDay();
}

function getMonthArray(year: number, month: number) {
  const len = getDayCountOfMonth(year, month);
  const arr = [];
  for (let i = 1; i <= len; i++) {
    arr.push(i);
  }
  return arr;
}

function prevMonth(year: number, month: number) {
  return month === 0 ? new Date(year - 1, 11, 1) : new Date(year, month - 1, 1);
}

function nextMonth(year: number, month: number) {
  return month === 11 ? new Date(year + 1, 0, 1) : new Date(year, month + 1, 1);
}

function strDate(date: Date | null) {
  if (date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  } else {
    return '';
  }
}

function formatDate(date: Date | null | Array<Date | null>) {
  if (Array.isArray(date)) {
    if (date[0] && date[1]) {
      return date.map(d => strDate(d)).join(' - ');
    } else {
      return '';
    }
  } else {
    return strDate(date);
  }
}

function isToday(year: number, month: number, date: number) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = new Date(year, month, date);
  return today.getTime() === day.getTime();
}

function isStart(year: number, month: number, date: number, startDate: Date) {
  const day = new Date(year, month, date);
  return startDate.getTime() === day.getTime();
}

function isEnd(year: number, month: number, date: number, endDate: Date) {
  const day = new Date(year, month, date);
  return endDate.getTime() === day.getTime();
}

function inRange(
  year: number,
  month: number,
  date: number,
  startDate: Date,
  endDate: Date
) {
  const day = new Date(year, month, date);
  return (
    day.getTime() <= endDate.getTime() && day.getTime() >= startDate.getTime()
  );
}

function parseDate(date: string) {
  const [year, month, day] = date.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export default {
  getDayCountOfMonth,
  getFirstDayOfMonth,
  getMonthArray,
  prevMonth,
  nextMonth,
  formatDate,
  parseDate,
  isToday,
  isStart,
  isEnd,
  inRange
};
