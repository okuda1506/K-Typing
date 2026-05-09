import { Controller, Get, Res, Sse } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Controller('events')
export class EventsController {
    @Sse('stream')
    streamEvents(): Observable<MessageEvent> {
        return interval(1000).pipe(
            map(
                (num) =>
                    ({
                        data: {
                            timestamp: new Date().toISOString(),
                            count: num,
                        },
                    }) as MessageEvent,
            ),
        );
    }
}
