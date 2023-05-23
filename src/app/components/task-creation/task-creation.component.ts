import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as dayjs from 'dayjs';
import { Task, availablePriorities } from 'src/app/entities/task';
import { TaskService } from 'src/app/services/task.service';
import { ViewHelperService } from 'src/app/services/view-helper.service';

@Component({
    selector: 'app-task-creation',
    templateUrl: './task-creation.component.html',
    styleUrls: ['./task-creation.component.scss'],
})
export class TaskCreationComponent implements OnInit {

    task = new Task({priority: 1});
    priorities = [];
    minDateTime = dayjs().format();

    constructor(
        private modalCtrl: ModalController,
        private taskService: TaskService,
        private viewHelperService: ViewHelperService
    ) {}

    ngOnInit() {
        // eslint-disable-next-line guard-for-in
        for (const k in availablePriorities) {
            this.priorities.push({ value: Number(k), label: availablePriorities[k] });
            // if (Object.prototype.hasOwnProperty.call(availablePriorities, k)) {}
        }

        this.task.due_at = dayjs().add(1, 'day').startOf('day').add(20, 'hour').format();
        console.log(this.priorities, this.minDateTime, this.task);
    }

    save() {
        console.log(this.task);
        this.taskService.addTask(this.task).then((result) => {
            this.task = new Task();
            this.modalCtrl.dismiss([], 'success');
            this.viewHelperService.showToast('Nouvelle tache enregistrée', 2000, null, 'success');
        });
    }
}
