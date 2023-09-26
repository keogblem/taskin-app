import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/entities/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
    @Input() task: Task;
    @Input() hideProjectLabel = false;

    @ViewChild('popover') popover: { event: Event; };
    openActionsDropdown = false;

    constructor(
        private taskService: TaskService,
        // private popoverCtrl: PopoverController
    ) {
    }

    ngOnInit() {
        // this.color = this.task.priorityLabel;
        // this.color = {
        //     low: 'light',
        //     normal: 'yellow',
        //     important: 'orange',
        //     emergency: 'red',
        // }[this.task.priorityLabel];
    }

    showActionsDropdown(e: Event) {
        this.popover.event       = e;
        this.openActionsDropdown = true;
    }

    launchTaskEdit() {
        console.log('launchTaskEdit', this.task);
        this.taskService.editTask(this.task);
        // this.popoverCtrl.dismiss();
    }

    markTaskAsCompleted() {
        this.taskService.markTaskAsCompleted(this.task);
    }

    deleteTask() {
        this.taskService.deleteTask(this.task);
    }
}
