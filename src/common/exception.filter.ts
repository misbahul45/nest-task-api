import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ZodError } from 'zod';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: Logger,
    ) {}

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        let errorResponse = {
            success: false,
            message: 'An unexpected error occurred',
            errors: [],
        };

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
     
            errorResponse.message =
                (typeof exceptionResponse === 'object' && exceptionResponse['message']) ||
                exception.message ||
                'A validation error occurred';

            errorResponse.errors =
                (typeof exceptionResponse === 'object' && exceptionResponse['errors']) ||
                [];
        } else if (exception instanceof ZodError) {
            status = HttpStatus.BAD_REQUEST;
            errorResponse.message = 'Validation error';
            errorResponse.errors = exception.errors.map((err) => ({
                path: err.path,
                message: err.message,
            }));
        }

        this.logger.error({
            message: `Status: ${status}, Message: ${errorResponse.message}`,
            errors: errorResponse.errors,
        });

        response.status(status).json(errorResponse);
    }
}
