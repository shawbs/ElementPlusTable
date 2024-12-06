function dayjs() {
  return new Date().getTime();
}

function addDayjs(day) {
  let d = new Date();
  d.setDate(d.getDate() + day);
  return d.getTime();
}

function minusDayjs(day) {
  let d = new Date();
  d.setDate(d.getDate() - day);
  return d.getTime();
}

export const rangeShortcuts = [
  {
    text: "今天",
    value: () => [dayjs(), dayjs()],
  },
  {
    text: "近一周",
    value: () => [minusDayjs(7), dayjs()],
  },
  {
    text: "近30天",
    value: () => [minusDayjs(30), dayjs()],
  },
];
