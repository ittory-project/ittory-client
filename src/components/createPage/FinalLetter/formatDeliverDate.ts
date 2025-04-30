import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDeliverDate = (deliverDay: Date | null | string) => {
  if (deliverDay === null) {
    return '';
  }
  return format(deliverDay, 'yyyy.MM.dd (E)', { locale: ko });
};
