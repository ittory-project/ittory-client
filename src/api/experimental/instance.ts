import { TypeSafeWebSocket } from './TypeSafeWebSocket';

export const WebSocketChannelDefinition = {
  letter: {
    exit: (payload: unknown) => payload as string,
    submit: (payload: unknown) => payload as string,
    timeout: (payload: unknown) => payload as string,
  },
  chat: {
    message: (payload: unknown) => payload as { text: string },
    join: (payload: unknown) => payload as { userId: string },
  },
};

export const websocketApi = new TypeSafeWebSocket(WebSocketChannelDefinition);
