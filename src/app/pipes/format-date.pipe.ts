import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';

@Pipe({
    name: 'formatDate',
})

export class FormatDatePipe implements PipeTransform {
    transform(date: string, type?) {
        if (date == null) {
            return '';
        }

        let format = 'DD MMM YYYY';

        switch (type) {
            case 1:
                format = 'DD MMMM YYYY';
                break;
            case 2:
                format = 'DD/MM/YYYY';
                break;
        }

        dayjs.locale('fr');
        return dayjs(date).format(format);
    }
}
