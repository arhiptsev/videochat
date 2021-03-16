import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements NestInterceptor {

    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        if (context.getType() !== 'http') {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();

        const close$ = fromEvent(request, 'close');

        return next.handle()
            .pipe(
                takeUntil(close$)
            );

    }
}