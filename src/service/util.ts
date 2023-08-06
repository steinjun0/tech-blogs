export function convertDateToMysqlDate(date: Date) {
  return date.toISOString().slice(0, 10);
}