/**
 * Standardized Error Response Interceptor
 * Ensures all services return consistent error format
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export interface StandardErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
  code: string;
  timestamp: string;
}

@Catch()
export class StandardErrorResponseInterceptor implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let errors: Array<{ field?: string; message: string }> = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        
        // Handle validation errors
        if (Array.isArray(responseObj.message)) {
          errors = responseObj.message.map((msg: string) => ({
            message: msg,
          }));
          message = 'Validation failed';
        }
      } else {
        message = String(exceptionResponse);
      }

      // Assign error codes based on status
      code = this.getErrorCode(status, exception);
    } else if (exception instanceof Error) {
      message = exception.message;
      code = 'APPLICATION_ERROR';
    }

    const errorResponse: StandardErrorResponse = {
      success: false,
      message,
      ...(errors.length > 0 && { errors }),
      code,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number, exception: HttpException): string {
    const message = exception.message.toLowerCase();
    
    // Map status codes to error codes
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        if (message.includes('validation')) return 'VALIDATION_ERROR';
        return 'BAD_REQUEST';
      
      case HttpStatus.UNAUTHORIZED:
        if (message.includes('token')) return 'INVALID_TOKEN';
        if (message.includes('otp')) return 'INVALID_OTP';
        return 'AUTHENTICATION_ERROR';
      
      case HttpStatus.FORBIDDEN:
        return 'AUTHORIZATION_ERROR';
      
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      
      case HttpStatus.CONFLICT:
        if (message.includes('duplicate') || message.includes('already')) {
          return 'DUPLICATE_RESOURCE';
        }
        return 'CONFLICT';
      
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'BUSINESS_LOGIC_ERROR';
      
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'RATE_LIMIT_EXCEEDED';
      
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}

