import {
  ittoryRequestMapperDefinition,
  userResponseMapperDefinition,
} from '../model/WebSocketMappers';
import { SharedTypeSafeWebSocket } from './SharedTypeSafeWebSocket';

let instance: SharedTypeSafeWebSocket<
  typeof ittoryRequestMapperDefinition,
  typeof userResponseMapperDefinition
> | null = null;

export const getWebSocketApi = () => {
  if (!instance) {
    instance = new SharedTypeSafeWebSocket(
      ittoryRequestMapperDefinition,
      userResponseMapperDefinition,
    );
  }
  return instance;
};
