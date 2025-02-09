import { intervalToDuration } from 'date-fns';

export class DateUtils {
    private static readonly MINUTE = 1000 * 60;
    private static readonly HOUR = DateUtils.MINUTE * 60;
    private static readonly DAY = DateUtils.HOUR * 24;

    public static dateDiffLabel(date: Date, reference: Date): string {
        const duration = intervalToDuration({ start: date, end: reference });
        const timeDiff = date.getTime() - reference.getTime();
        if (timeDiff < 0) {
            return 'Closed';
        }

        if (duration.years || duration.months || duration.weeks || Math.abs(duration.days!) > 1) {
            return `${Math.floor(timeDiff / DateUtils.DAY)} days`;
        }
        if (Math.abs(duration.days!) === 1 || Math.abs(duration.hours!) > 1) {
            return `${Math.floor(timeDiff / DateUtils.HOUR)} hours`;
        }
        if (Math.abs(duration.minutes!) > 1) {
            return `${Math.floor(timeDiff / DateUtils.MINUTE)} min.`;
        }
        return 'Closing';
    }
}
