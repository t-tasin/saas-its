/**
 * Uniform error envelope: { error: { code, message } }
 */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL';
    let message = 'Unexpected error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const r = exception.getResponse() as any;
      message = typeof r === 'string' ? r : r?.message || exception.message;
      code = r?.code || HttpStatus[status] || code;
    } else if ((exception as any)?.code?.startsWith?.('P')) {
      // Prisma error mapping (minimal)
      const e = exception as any;
      if (e.code === 'P2002') { status = 409; code = 'CONFLICT'; message = 'Unique constraint violated'; }
      else { status = 400; code = 'DB_ERROR'; message = e.code; }
    }

    res.status(status).json({ error: { code, message }, path: req.url, ts: new Date().toISOString() });
  }
}
