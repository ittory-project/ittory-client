export default {
  extends: ['@commitlint/config-conventional'],
  /*
    type(scope?): subject // 여기 전체를 header
    body?
    footer?
  */
  // 0=off, 1=warn, 2=error
  // always=allow, never=disallow
  rules: {
    // [0] = 규칙 해제
    'header-max-length': [0],
    'subject-case': [0],
    'subject-full-stop': [0],
    'type-case': [0],
    'subject-empty': [2, 'never'], // subject 생략 불가
    'type-empty': [2, 'never'], // type 생략 불가
    'type-enum': [
      // 아래의 type만 사용 가능
      2,
      'always',
      /*
        Feat: 기능 추가
        Fix: 버그 수정
        Design: UI 관련
        HOTFIX: 급한 버그에 사용
        Style: 코드 스타일 관련
        Refactor: 리팩토링
        Comment: 주석 추가/수정
        Docs: 문서 관련
        Test: 테스트 코드 관련
        Rename: 디렉토리 구조 변경 및 파일 이름 수정
        Remove: 파일 삭제
        Chore: package.json 종속성 관련
        Prod: 배포 관련 파일 수정
      */
      [
        'Feat',
        'Fix',
        'Design',
        'HOTFIX',
        'Style',
        'Refactor',
        'Comment',
        'Docs',
        'Test',
        'Rename',
        'Remove',
        'Chore',
        'Prod',
      ],
    ],
  },
};
