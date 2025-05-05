import {
  RequestMapperDefinition,
  ResponseMapperDefinition,
} from './TypeSafeWebSocket';

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
        exit?: (_payload: string) => void;
        submit?: (_payload: number) => void;
        timeout?: (_payload: boolean) => void;
      }) =>
      (payload) => {
        const parsedPayload = JSON.parse(payload);
        if (Math.random() > 0.5) {
          handlers.exit?.('exit');
        } else if (Math.random() > 0.3) {
          handlers.submit?.(1);
        } else {
          handlers.timeout?.(true);
        }
      },
  },
} satisfies ResponseMapperDefinition;
