import { http } from 'msw';
import { HttpResponse } from 'msw';

import { LetterPartiListGetResponse } from '@/api/model/LetterModel';

export const MOCK_PARTICIPANTS_DEFAULT: LetterPartiListGetResponse = {
  participants: [
    {
      sequence: 1,
      memberId: 1,
      nickname: '김철수',
      imageUrl: undefined,
    },
    {
      sequence: 2,
      memberId: 2,
      nickname: '이영희',
      imageUrl: undefined,
    },
    {
      sequence: 3,
      memberId: 3,
      nickname: '박민수',
      imageUrl: undefined,
    },
  ],
};

export const MOCK_SINGLE_PARTICIPANT: LetterPartiListGetResponse = {
  participants: [
    {
      sequence: 1,
      memberId: 1,
      nickname: '홍길동',
      imageUrl: undefined,
    },
  ],
};

export const MOCK_FIVE_PARTICIPANTS: LetterPartiListGetResponse = {
  participants: [
    {
      sequence: 1,
      memberId: 1,
      nickname: '김철수',
      imageUrl: undefined,
    },
    {
      sequence: 2,
      memberId: 2,
      nickname: '이영희',
      imageUrl: undefined,
    },
    {
      sequence: 3,
      memberId: 3,
      nickname: '박민수',
      imageUrl: undefined,
    },
    {
      sequence: 4,
      memberId: 4,
      nickname: '최영진',
      imageUrl: undefined,
    },
    {
      sequence: 5,
      memberId: 5,
      nickname: '정수연',
      imageUrl: undefined,
    },
  ],
};

export const letterParticipantsApiMocks = (
  letterId: number,
  payload: LetterPartiListGetResponse,
) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const fetchUrl = `${serverUrl}/api/letter/participant/${letterId}`;

  return http.get(fetchUrl, () =>
    HttpResponse.json({
      data: payload,
    }),
  );
};
