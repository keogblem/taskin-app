import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskCreationComponent } from './task-creation/task-creation.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
    declarations: [
        TaskCardComponent,
        TaskCreationComponent
    ],
    exports: [
        TaskCardComponent,
        TaskCreationComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule
    ],
})
export class ComponentsModule {
}
