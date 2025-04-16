export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = daysOfWeek[date.getDay()];

  return `${year}. ${month.toString().padStart(2, '0')}. ${day.toString().padStart(2, '0')} (${dayOfWeek})`;
};
