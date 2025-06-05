import { ElementResponse } from '@/api/model/ElementModel';

export const MOCK_COMPLETED_ELEMENT: ElementResponse = {
  elementId: 1,
  imageUrl:
    'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
  content: '첫 번째 문장입니다. 이 편지가 시작되는 순간을 담았습니다.',
  startedAt: '2024-01-01T10:00:00Z',
  memberId: 1,
  nickname: '김철수',
};

export const MOCK_CURRENT_ELEMENT: ElementResponse = {
  elementId: 2,
  imageUrl:
    'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
  content: null,
  startedAt: '2024-01-01T10:30:00Z',
  memberId: 2,
  nickname: '이영희',
};

export const MOCK_INACTIVE_ELEMENT: ElementResponse = {
  elementId: 3,
  imageUrl:
    'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
  content: null,
  startedAt: null,
  memberId: 3,
  nickname: '박민수',
};

export const MOCK_ELEMENTS_SINGLE: ElementResponse[] = [MOCK_CURRENT_ELEMENT];

export const MOCK_ELEMENTS_MIXED: ElementResponse[] = [
  MOCK_COMPLETED_ELEMENT,
  MOCK_CURRENT_ELEMENT,
  MOCK_INACTIVE_ELEMENT,
  {
    elementId: 4,
    imageUrl:
      'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
    content: null,
    startedAt: null,
    memberId: 4,
    nickname: '최지민',
  },
];

export const MOCK_ELEMENTS_ALL_COMPLETED: ElementResponse[] = [
  MOCK_COMPLETED_ELEMENT,
  {
    elementId: 2,
    imageUrl:
      'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
    content: '두 번째 문장입니다. 이야기가 계속됩니다.',
    startedAt: '2024-01-01T10:30:00Z',
    memberId: 2,
    nickname: '이영희',
  },
  {
    elementId: 3,
    imageUrl:
      'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
    content: '세 번째 문장입니다. 편지가 마무리되어갑니다.',
    startedAt: '2024-01-01T11:00:00Z',
    memberId: 3,
    nickname: '박민수',
  },
];
