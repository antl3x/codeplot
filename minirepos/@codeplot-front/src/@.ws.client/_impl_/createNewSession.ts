import { WebsocketModel } from "./WebsocketModel";

export const createNewSession = (i: { sessionId: string; url: string }) => {
  return WebsocketModel.create({ ...i });
};
