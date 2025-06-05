import { ElementResponse } from '@/api/model/ElementModel';

const FIFTY_ELEMENTS_CONTENTS = [
  '빨간 모자 소녀가 할머니 찾아가는 길에',
  '늑대가 나타나서 할머니 집으로 달려가',
  '사냥꾼이 늑대를 잡아서 할머니를 구해',
  '백설공주가 일곱 난쟁이와 함께 살아',
  '사과를 먹고 잠든 공주를 왕자가 깨워',
  '신데렐라가 유리구두를 잃어버렸어',
  '왕자가 찾아서 결혼식 올리게 되었어',
  '피노키오가 거짓말해서 코가 길어져',
  '파란 수염이 있는 왕이 결혼을 해',
  '아기돼지 삼형제가 집을 지었어',
  '늑대가 불어서 집을 날려버렸어',
  '벽돌집만 남아서 안전하게 살았어',
  '잭이 콩나무를 타고 거인나라로 가',
  '금화를 훔쳐서 엄마와 행복하게 살아',
  '미녀와 야수가 사랑에 빠져 결혼해',
  '장미가 시들어서 야수가 원래 모습으로',
  '인어공주가 인간이 되고 싶어했어',
  '왕자와 결혼하고 영혼을 잃어버려',
  '피터팬이 네버랜드로 날아가',
  '틱톡과 함께 후크선장과 싸워',
  '알라딘이 마법램프를 발견했어',
  '지니가 소원을 들어주고 왕자가 되었어',
  '신비아파트에서 귀신을 물리쳐',
  '도깨비가 나타나서 소원을 들어줘',
  '토끼와 거북이가 달리기 시합을 해',
  '거북이가 천천히 가서 이기게 되었어',
  '개미와 베짱이가 여름을 보냈어',
  '베짱이가 춤추고 노래하다가 굶어',
  '우렁각시가 나와서 밥을 해줬어',
  '효녀가 우렁을 키워서 행복해졌어',
  '콩쥐 팥쥐가 계모에게 시달려',
  '콩쥐가 팥쥐를 도와서 행복해졌어',
  '흥부가 놀부에게 박을 얻어',
  '박에서 나온 재물로 부자가 되었어',
  '심청이 아버지를 위해 인당수에 뛰어',
  '용왕이 감동해서 아버지를 살려줘',
  '춘향이 이도령과 사랑에 빠져',
  '변사또가 방해했지만 결혼하게 되었어',
  '홍길동이 의적이 되어 도둑을 잡아',
  '조선시대에 활약하며 명성을 얻어',
  '장화홍련이 계모에게 시달려',
  '아버지가 돌아와서 행복하게 살아',
  '별주부전에서 토끼가 용왕을 속여',
  '간을 구해달라고 거짓말을 했어',
  '견우와 직녀가 은하수를 건너',
  '오작교에서 만나서 사랑을 나눠',
  '선녀와 나무꾼이 결혼을 했어',
  '옷을 숨겨서 선녀가 하늘로 못 가',
  '개구리가 왕자가 되어 공주와 결혼해',
  '행복하게 오래오래 살았답니다',
];

const MOCK_COMPLETED_ELEMENT_1: ElementResponse = {
  elementId: 1,
  imageUrl:
    'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
  content: '호그와트로 오는 날, 기대되는 마음으로',
  startedAt: '2024-01-01T10:00:00Z',
  memberId: 1,
  nickname: '잇찌',
};

const MOCK_COMPLETED_ELEMENT_2: ElementResponse = {
  elementId: 2,
  imageUrl:
    'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
  content: FIFTY_ELEMENTS_CONTENTS[0],
  startedAt: '2024-01-01T10:30:00Z',
  memberId: 2,
  nickname: '토리',
};

const MOCK_COMPLETED_ELEMENT_3: ElementResponse = {
  elementId: 3,
  imageUrl:
    'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
  content: FIFTY_ELEMENTS_CONTENTS[1],
  startedAt: '2024-01-01T11:00:00Z',
  memberId: 3,
  nickname: '비비',
};

const MOCK_COMPLETED_ELEMENT_4: ElementResponse = {
  elementId: 4,
  imageUrl:
    'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
  content: FIFTY_ELEMENTS_CONTENTS[2],
  startedAt: '2024-01-01T11:00:00Z',
  memberId: 4,
  nickname: '모리',
};

const MOCK_CURRENT_ELEMENT: ElementResponse = {
  elementId: 2,
  imageUrl:
    'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
  content: null,
  startedAt: '2024-01-01T10:30:00Z',
  memberId: 2,
  nickname: '우니',
};

const MOCK_INACTIVE_ELEMENT: ElementResponse = {
  elementId: 3,
  imageUrl:
    'https://ittory.s3.ap-northeast-2.amazonaws.com/asset/element-image/ELEMENT_IMAGE_32.png',
  content: null,
  startedAt: null,
  memberId: 3,
  nickname: '부리 ',
};

export const MOCK_ELEMENTS_SINGLE: ElementResponse[] = [MOCK_CURRENT_ELEMENT];

export const MOCK_ELEMENTS_MIXED: ElementResponse[] = [
  MOCK_COMPLETED_ELEMENT_1,
  MOCK_CURRENT_ELEMENT,
  MOCK_INACTIVE_ELEMENT,
  MOCK_INACTIVE_ELEMENT,
];

export const MOCK_ELEMENTS_ALL_COMPLETED: ElementResponse[] = Array.from(
  { length: 50 },
  (_, index) => {
    const elements = [
      MOCK_COMPLETED_ELEMENT_1,
      MOCK_COMPLETED_ELEMENT_2,
      MOCK_COMPLETED_ELEMENT_3,
      MOCK_COMPLETED_ELEMENT_4,
    ];
    return {
      ...elements[index % elements.length],
      elementId: index + 1,
      content: FIFTY_ELEMENTS_CONTENTS[index],
    };
  },
);
