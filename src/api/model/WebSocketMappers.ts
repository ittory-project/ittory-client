import { SessionLogger } from '../../utils/SessionLogger';
import {
  RequestMapperDefinition,
  ResponseMapperDefinition,
} from '../websockets/SharedTypeSafeWebSocket';
import {
  WsEnterResponse,
  WsExitResponse,
  WsResponse,
  WsWriteResponse,
} from './WsModel';

const logger = new SessionLogger('websocket-infra');

export const ittoryRequestMapperDefinition = {
  writeLetterElement: {
    channelMapper: (letterId: number) => `/ws/letter/element/write/${letterId}`,
    requestMapper: (payload: { elementId: number; content: string }) => {
      return JSON.stringify(payload);
    },
  },
  startLetter: {
    channelMapper: (letterId: number) => `/ws/letter/start/${letterId}`,
  },
  enterLetter: {
    channelMapper: (letterId: number) => `/ws/letter/enter/${letterId}`,
    requestMapper: (payload: { nickname: string }) => {
      return JSON.stringify(payload);
    },
  },
  endLetter: {
    channelMapper: (letterId: number) => `/ws/letter/end/${letterId}`,
  },
  quitLetter: {
    channelMapper: (letterId: number) => `/ws/letter/exit/${letterId}`,
  },
} satisfies RequestMapperDefinition;

export const userResponseMapperDefinition = {
  letter: {
    channelMapper: (letterId: number) => `/topic/letter/${letterId}`,
    responseMapper:
      (handlers: {
        start?: () => void;
        enter?: (_response: WsEnterResponse) => void;
        write?: (_response: WsWriteResponse) => void;
        timeout?: () => void;
        exit?: (_response: WsExitResponse) => void;
        finish?: () => void;
      }) =>
      (payload) => {
        const response = JSON.parse(payload) as WsResponse;
        switch (response.action) {
          case 'START':
            handlers.start?.();
            break;
          case 'ENTER':
            handlers.enter?.(response as WsEnterResponse);
            break;
          case 'WRITE':
            handlers.write?.(response as WsWriteResponse);
            break;
          case 'TIMEOUT':
            handlers?.timeout?.();
            break;
          case 'EXIT':
            handlers.exit?.(response as WsExitResponse);
            break;
          case 'FINISH':
            handlers.finish?.();
            break;
          default:
            logger.debug('bad response schema', response);
        }
      },
  },
} satisfies ResponseMapperDefinition;
