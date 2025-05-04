// 아예 별도의 파일에서 추론되는지 확인
import { websocketApi } from './instance';

websocketApi.subscribe('chat').join({ userId: '123' });
