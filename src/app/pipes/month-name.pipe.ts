import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../services/common.service';

@Pipe({
    name: 'monthName',
})

export class MonthName implements PipeTransform {

    transform(value: string, args?) {
        return CommonService.getMonthName(value);
    }

}
