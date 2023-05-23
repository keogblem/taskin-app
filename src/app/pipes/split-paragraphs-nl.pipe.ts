import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitParagraphsNl'
})
export class SplitParagraphsNlPipe implements PipeTransform {

    transform(value: string, pClass: string = 'mb-2'): string {
        const parts = value.split('\n');

        console.log(parts);
        let output = '';
        for (const part of parts) {
            console.log(part);
            output += '<p class="' + pClass + '">' + part + '</p>';
        }
        return output;
        // return value.replace(/\n/g, '<br/>');
    }

}
