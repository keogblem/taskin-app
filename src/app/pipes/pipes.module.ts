import { NgModule } from '@angular/core';
import { DateForHumansPipe } from './date-for-humans.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { FormatDateTimePipe } from './format-date-time.pipe';
import { FormatDatePipe } from './format-date.pipe';
import { FormatUnixTimePipe } from './format-unix-time.pipe';
import { MonthName } from './month-name.pipe';
import { Nl2brPipe } from './nl2br.pipe';
import { SplitParagraphsNlPipe } from './split-paragraphs-nl.pipe';

@NgModule({
    declarations: [
        FormatNumberPipe,
        FormatDatePipe,
        FormatUnixTimePipe,
        FormatDateTimePipe,
        MonthName,
        Nl2brPipe,
        DateForHumansPipe,
        SplitParagraphsNlPipe
    ],
    imports: [],
    exports: [
        FormatNumberPipe,
        FormatDatePipe,
        FormatUnixTimePipe,
        FormatDateTimePipe,
        MonthName,
        Nl2brPipe,
        DateForHumansPipe,
        SplitParagraphsNlPipe,
    ]
})

export class PipesModule {
}
