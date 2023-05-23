import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatNumber',
})
export class FormatNumberPipe implements PipeTransform {

    transform(numberToFormat: any, thousandSeparator = '.', decimalSeparator = ',') {
        const deciSeparator = '.';

        const split = numberToFormat.toString().split(deciSeparator);

        const nonDecimalPart = split[0];

        const rest = nonDecimalPart.length % 3;

        let output = nonDecimalPart.substr(0, rest);

        const thousands = nonDecimalPart.substr(rest).match(/\d{3}/g);
        if (thousands) {
            output += (rest ? thousandSeparator : '') + thousands.join(thousandSeparator);
        }

        // eslint-disable-next-line eqeqeq
        return split[1] != undefined ? output + decimalSeparator + split[1] : output;
    }
}
