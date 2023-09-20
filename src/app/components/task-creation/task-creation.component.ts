import { Component, Input, OnInit } from '@angular/core';
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
    @Input() task: Task;

    action = 'create';
    priorities = [];
    minDateTime = dayjs().subtract(1, 'week').format();
    headerTitle = 'Ajouter une tâche';

    constructor(private modalCtrl: ModalController, private taskService: TaskService, private viewHelperService: ViewHelperService) {}

    ngOnInit() {
        if (this.task) {
            this.action = 'edit';
            this.headerTitle = 'Modifier la tâche';
        } else {
            this.task = new Task({ priority: 1 });

            // this.task.list = [
            //     { label: 'First sub task here', done: false },
            //     { label: 'Second very long sub task here as long item', done: false },
            //     { label: 'Second very long sub task here as long item', done: false },
            //     { label: 'Second very long sub task here as long item', done: false },
            //     { label: 'Third sub task here', done: true },
            // ];
            this.task.due_at = dayjs().add(1, 'day').startOf('day').add(20, 'hour').format();
        }

        // eslint-disable-next-line guard-for-in
        for (const k in availablePriorities) {
            this.priorities.push({
                value: Number(k),
                label: availablePriorities[k],
            });
            // if (Object.prototype.hasOwnProperty.call(availablePriorities, k)) {}
        }

        console.log(this.priorities, this.minDateTime, this.task);
    }

    save() {
        console.log(this.task);

        if (this.action === 'create') {
            this.taskService.addTask(this.task).then((result) => {
                this.task = undefined; // new Task();
                this.modalCtrl.dismiss([], 'success');
                this.viewHelperService.showToast('Tache ajoutée !', 2000, null, 'success');
            });
        } else {
            this.taskService.saveUpdatedTask(this.task).then((result) => {
                this.task = undefined; // new Task();
                this.modalCtrl.dismiss([], 'success');
                this.viewHelperService.showToast('Tache mise à jour !', 2000, null, 'success');
            });
        }
    }

    addListItem() {
        this.task.list.push({ label: '', done: false })
    }

    removeListItem(index: number) {
        console.log('@removeListItem', this.task.list);
        this.task.list.splice(index, 1);
        console.log(this.task.list);
    }

    cancel() {
        this.modalCtrl.dismiss();
    }
}
