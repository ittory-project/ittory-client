// 아예 별도의 파일에서 추론되는지 확인
import { websocketApi } from './instance';

websocketApi.subscribe('letter', [1], {
  exit: (payload) => console.log('exit:', payload),
  submit: (payload) => console.log('submit:', payload),
  timeout: (payload) => console.log('timeout:', payload),
});
