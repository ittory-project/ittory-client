import { TypeSafeWebSocket } from './TypeSafeWebSocket';
import {
  ittoryRequestMapperDefinition,
  userResponseMapperDefinition,
} from './ittoryWebSocketSchema';

let instance: TypeSafeWebSocket<
  typeof ittoryRequestMapperDefinition,
  typeof userResponseMapperDefinition
> | null = null;

export const getWebSocketApi = () => {
  if (!instance) {
    instance = new TypeSafeWebSocket(
      ittoryRequestMapperDefinition,
      userResponseMapperDefinition,
    );
  }
  return instance;
};
