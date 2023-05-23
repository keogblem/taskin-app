import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';

@Pipe({
    name: 'formatDateTime',
})

@Injectable()

export class FormatDateTimePipe implements PipeTransform {

    transform(value: any, type?) {
        if (value == null) {
            return '';
        }

        let format = 'DD-MM-YYYY HH[h]mm\'';
        switch (type) {
            case 1:
                format = 'DD MMM YYYY [à] HH[h]mm\'';
                break;
            case 2:
                format = 'DD MMMM YYYY [à] HH[h]mm';
                break;
        }

        return dayjs(value, 'YYYY-MM-DD HH:mm:ss').locale('fr').format(format);
    }

}
