import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/entities/task';

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {

    @Input() task: Task;
    color = 'light';

    constructor() { }

    ngOnInit() {
        this.color = {
            low: 'light',
            normal: 'yellow',
            important: 'orange',
            emergency: 'red',
        }[this.task.priorityLabel];
    }
}
