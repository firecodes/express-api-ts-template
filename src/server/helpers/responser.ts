
import { isAxiosError } from 'axios';
import { RequestHandler, Response } from 'express';
import { INVALID_ERROR } from '../../constants/http-code';

export interface ErrorerOptions {
  message: any
  code?: number
}
export const errorer = (response: Response, { code, message }: ErrorerOptions) => {
  console.warn('[BLOG] error:', isAxiosError(message) ? message.toJSON() : message);
  response.status(code ?? INVALID_ERROR);
  response.send(
    typeof message === 'string' ? message : message instanceof Error
      ? message.message || message.name : JSON.stringify(message),
  );
};

export const responser = (promise: () => Promise<any>): RequestHandler => {
  return (_, response) => {
    promise()
      .then((data) => response.send(data))
      .catch((error: unknown) => errorer(response, { message: error }));
  };
};
