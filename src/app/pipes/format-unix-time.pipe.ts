import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';

@Pipe({
    name: 'formatUnixTime',
})

@Injectable()

export class FormatUnixTimePipe implements PipeTransform {

    transform(value: string, args?: any) {
        return dayjs(parseInt(value, 10)).locale('fr').format('DD MMMM YYYY, HH:mm:ss');
    }

}
