import { ApiResponse, api } from '../config/api';
import { PagedElements } from '../model/ElementModel';

export const getElementsByLetterId = async (letterId: number) => {
  const response: ApiResponse<PagedElements> = await api.get(
    `/api/letter/${letterId}/elements`,
    {
      params: {
        letterId,
      },
    },
  );

  return response.data.data.elements;
};
