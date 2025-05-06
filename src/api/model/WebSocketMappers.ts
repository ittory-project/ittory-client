import { SessionLogger } from '../../utils/SessionLogger';
import {
  RequestMapperDefinition,
  ResponseMapperDefinition,
} from '../websockets/SharedTypeSafeWebSocket';
import { WsEnterResponse, WsExitResponse, WsResponse } from './WsModel';

const logger = new SessionLogger('websocket-infra');

export const ittoryRequestMapperDefinition = {
  writeLetterElement: {
    channelMapper: (letterId: number) => `/ws/letter/${letterId}/elements`,
    requestMapper: (payload: { sequence: number; content: string }) => {
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
        exit?: (_response: WsExitResponse) => void;
        end?: () => void;
      }) =>
      (payload) => {
        const response = JSON.parse(payload) as WsResponse;
        logger.debug('letter response', response);
        switch (response.action) {
          case 'START':
            handlers.start?.();
            break;
          case 'ENTER':
            handlers.enter?.(response as WsEnterResponse);
            break;
          case 'EXIT':
            handlers.exit?.(response as WsExitResponse);
            break;
          case 'END':
            handlers.end?.();
            break;
        }
      },
  },
} satisfies ResponseMapperDefinition;
