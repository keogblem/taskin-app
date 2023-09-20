import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/entities/task';
import { TaskService } from 'src/app/services/task.service';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { ModalController } from '@ionic/angular';
import { TaskCreationComponent } from 'src/app/components/task-creation/task-creation.component';
import { animate, style } from '@angular/animations';
import _ from 'lodash';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;

    // todayTasks: Task[];
    tasks: Task[];
    gridOptions: NgxMasonryOptions = {
        gutter: 0,
        initLayout: true,
        animations: {
            show: [style({ opacity: 0 }), animate('600ms ease-in', style({ opacity: 1 }))],
            hide: [style({ opacity: '*' }), animate('600ms ease-in', style({ opacity: 0 }))],
        },
    };
    updateMasonryLayout = false;

    constructor(private taskService: TaskService, private modalCtrl: ModalController) {}

    ngOnInit() {
        this.taskService
            .getTodayTasks()
            .then((todayTasks) => {
                console.log(todayTasks);
                this.organizeTodayTasksToDisplay(todayTasks);
                // this.tasks = tasks.reverse();
                // setTimeout(() => {
                //     this.masonry.reloadItems();
                //     this.masonry.layout();
                // }, 1000);
            })
            .finally(() => {
                this.updateMasonryLayout = true;
                this.taskService.tasksUpdated.subscribe({
                    next: () => {
                        this.organizeTodayTasksToDisplay(this.taskService.todayTasks);
                    },
                });
            });

        this.taskService.editingTask.subscribe({
            next: (task: Task) => {
                this.modalCtrl
                    .create({
                        component: TaskCreationComponent,
                        componentProps: { task },
                    })
                    .then((modal) => {
                        modal.present().then();
                        modal.onDidDismiss().then((data) => {
                            console.log(data);
                            this.updateMasonryLayout = true;
                        });
                    });
            },
        });
    }

    ngOnDestroy(): void {
        this.taskService.editingTask.unsubscribe();
        this.taskService.tasksUpdated.unsubscribe();
    }

    ionViewWillEnter() {
        this.masonry.layout();
    }

    addTask() {
        this.modalCtrl
            .create({
                component: TaskCreationComponent,
                // breakpoints: [0, 0.9],
                // initialBreakpoint: 0.9,
            })
            .then((modal) => {
                modal.present().then();
                modal.onDidDismiss().then((data) => {
                    console.log(data);
                    this.updateMasonryLayout = true;
                });
            });
    }

    syncData() {
        console.log(this.tasks);

        this.taskService.sync();

        this.updateMasonryLayout = true;
    }

    private organizeTodayTasksToDisplay(todayTasks: Task[]) {
        let tmp = _.sortBy(todayTasks, ['status', 'priority'], ['asc', 'desc']);
        this.tasks = tmp;
        console.log('tasks', tmp);
    }
}
