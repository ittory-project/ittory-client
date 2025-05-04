// 자동 추론되게
import { websocketApi } from './instance';

// 음? 이건 또 되네. 외지?
websocketApi.subscribe('chat').join({ userId: '123' });
