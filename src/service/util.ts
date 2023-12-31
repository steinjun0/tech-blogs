export function convertDateToMysqlDate(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function printDate(date: Date) {
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}