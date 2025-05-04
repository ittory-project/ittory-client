// 아예 별도의 파일에서 추론되는지 확인
import { websocketApi } from './instance';

websocketApi.subscribe('letter', {
  exit(_payload) {
    console.log(_payload);
  },
  submit(_payload) {
    console.log(_payload);
  },
  timeout(_payload) {
    console.log(_payload);
  },
});
