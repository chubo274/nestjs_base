import { HttpException, HttpStatus, Logger } from '@nestjs/common';

interface BaseErrorFormat {
  errCode: string;
  statusCode: number;
  message: string;
}
export class BaseException extends HttpException {
  constructor(response: BaseErrorFormat, cause?: any) {
    super(response, response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    this.stack = cause;
  }
}

// Define Errors
type keyErrors =
  | 'DEFAULT'
  | 'FORBIDDEN'
  | 'ITEM_NOT_FOUND'
  | 'ITEM_EXISTED'
  | 'OTP_NOT_FOUND'
  | 'CONFIRM_PASSWORD_NOT_MATCH'
  | 'WRONG_PASSWORD'
  | 'PAYMENT_ERROR'
  | 'BAD_REQUEST'
  | 'TERMS_AND_CONDITIONALS_ACCEPTED'
  | 'PAYMENT_ERROR'
  | 'FORBIDDEN_VERIFIED'

type IErrors = {
  [key in keyErrors]: (data?: any) => BaseErrorFormat;
};

export const Errors: IErrors = {
  DEFAULT: () => ({
    errCode: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Something went wrong",
  }),
  ITEM_NOT_FOUND: (data: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: `${data} does not exists!`,
  }),
  BAD_REQUEST: (data?: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: data || 'BAD_REQUEST',
  }),
  CONFIRM_PASSWORD_NOT_MATCH: () => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: `Confirm password does not match`,
  }),
  PAYMENT_ERROR: (message: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: message,
  }),
  ITEM_EXISTED: (data: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: `${data} has existed!`,
  }),
  OTP_NOT_FOUND: () => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Otp is not found',
  }),

  WRONG_PASSWORD: () => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Wrong password',
  }),

  TERMS_AND_CONDITIONALS_ACCEPTED: () => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Terms and conditionals are not agreed',
  }),

  FORBIDDEN: () => ({
    errCode: HttpStatus.FORBIDDEN.toString(),
    statusCode: HttpStatus.FORBIDDEN,
    message: 'Forbidden resource',
  }),
  FORBIDDEN_VERIFIED: () => ({
    errCode: HttpStatus.FORBIDDEN.toString(),
    statusCode: HttpStatus.FORBIDDEN,
    message: 'Your account is not verified.',
  }),
};
