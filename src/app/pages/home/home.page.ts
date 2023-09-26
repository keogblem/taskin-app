import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/entities/task';
import { TaskService } from 'src/app/services/task.service';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { ModalController } from '@ionic/angular';
import { TaskCreationComponent } from 'src/app/components/task-creation/task-creation.component';
import { animate, style } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;

    project = '';
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
    private subscriptions = {editing: null, updated: null}

    constructor(
        private taskService: TaskService,
        private modalCtrl: ModalController,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.project = this.activatedRoute.snapshot.paramMap.get('project');

        this.loadTasksToDisplay();

        this.subscriptions.editing = this.taskService.editingTask.subscribe({
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
        try {
            this.subscriptions.editing.unsubscribe();
            this.subscriptions.updated.unsubscribe();
        } catch (e) {
            console.warn(e);
        }
    }

    ionViewWillEnter() {
        this.masonry.layout();
    }

    private loadTasksToDisplay() {
        if (this.project) {
            this.loadProjectTasks();
        } else {
            this.loadTodayTasks();
        }
    }

    private reloadTasksToDisplay() {
        if (this.project) {
            this.organizeProjectTasks(this.taskService.tasks);
        } else {
            this.organizeTodayTasksToDisplay(this.taskService.todayTasks);
        }
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

    private loadProjectTasks() {
        this.taskService
            .getAllTasks()
            .then((tasks) => {
                this.organizeProjectTasks(tasks);
            })
            .finally(() => {
                this.updateMasonryLayout = true;
                this.subscriptions.updated = this.taskService.tasksUpdated.subscribe({
                    next: () => {
                        this.reloadTasksToDisplay();
                    },
                });
            });
    }

    private loadTodayTasks() {
        this.taskService
            .getTodayTasks()
            .then((todayTasks) => {
                console.log('todayTasks', todayTasks);
                this.organizeTodayTasksToDisplay(todayTasks);
            })
            .finally(() => {
                this.updateMasonryLayout = true;
                this.subscriptions.updated = this.taskService.tasksUpdated.subscribe({
                    next: () => {
                        this.reloadTasksToDisplay();
                    },
                });
            });
    }

    private organizeTodayTasksToDisplay(todayTasks: Task[]) {
        this.tasks = _.sortBy(todayTasks, ['status', 'priority'], ['asc', 'desc']);
    }

    private organizeProjectTasks(tasks: Task[]) {
        let tmp = _.filter(tasks, ['project', this.project]);

        this.tasks = _.sortBy(tmp, ['status', 'priority'], ['asc', 'desc']);
        console.log('projectTasks', this.tasks);
    }
}
