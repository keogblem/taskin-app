import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../services/common.service';

@Pipe({
    name: 'dateForHumans'
})
export class DateForHumansPipe implements PipeTransform {

    constructor() {
    }

    transform(date: any, ...args: unknown[]): string {
        return CommonService.getRelativeTimeFrom(date);
    }

}
