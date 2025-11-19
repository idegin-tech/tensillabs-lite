import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformIdInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                return this.transformIds(data);
            }),
        );
    }

    private transformIds(data: any): any {
        if (data === null || data === undefined) {
            return data;
        }

        if (data instanceof Date) {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map((item) => this.transformIds(item));
        }

        if (typeof data === 'object') {
            const transformed: any = {};

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const value = data[key];

                    if (value instanceof Date) {
                        transformed[key] = value;
                    } else if (key === 'id' && typeof value === 'string') {
                        transformed['_id'] = value;
                    } else if (key === 'docs' && Array.isArray(value)) {
                        transformed[key] = value.map((item: any) =>
                            this.transformIds(item),
                        );
                    } else if (typeof value === 'object' && value !== null) {
                        transformed[key] = this.transformIds(value);
                    } else {
                        transformed[key] = value;
                    }
                }
            }

            return transformed;
        }

        return data;
    }
}
