import { Payload } from "@ts/types/requestTypes";

declare global {
  namespace Express {
    export interface Request {
      payload?: Payload;
    }
  }
}
