import { Injectable } from '@angular/core';
import { Task } from '../entities/task';
import { StorageService } from './storage.service';
import _ from 'lodash';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TaskService {
    tasks: Task[];
    todayTasks: Task[];
    taskUnderEdit: Task;

    editingTask = new Subject();
    tasksUpdated = new Subject();

    constructor(private storageService: StorageService) {}

    getAllTasks() {
        return new Promise<Task[]>((resolve) => {
            // this.processRawTasks([
            //     new Task({
            //         title: 'First task title',
            //         priority: 1,
            //         created_at: dayjs().toISOString(),
            //         due_at: dayjs().toISOString(),
            //     }),
            //     new Task({
            //         title: 'Second task title',
            //         priority: 3,
            //         created_at: dayjs().toISOString(),
            //     }),
            //     new Task({
            //         title: 'Third task title',
            //         priority: 3,
            //         created_at: dayjs().toISOString(),
            //         status: 2,
            //     }),
            //     new Task({
            //         title: 'Another task title',
            //         priority: 2,
            //         created_at: dayjs().toISOString(),
            //     }),
            // ]);
            // resolve(this.tasks);
            //
            // return;

            if (this.tasks != undefined) {
                resolve(this.tasks);
            }

            this.storageService
                .retreiveData('tasks')
                .then((rawTasks) => {
                    this.processRawTasks(rawTasks);
                    resolve(this.tasks);
                })
                .catch(() => {
                    console.warn('No tasks found');
                    this.tasks = [];
                    resolve(this.tasks);
                });
        });
    }

    getTodayTasks() {
        console.log('@getTodayTasks');

        return new Promise<Task[]>((resolve) => {
            if (this.todayTasks == undefined) {
                this.getAllTasks().then(() => resolve(this.todayTasks));
                return;
            }

            resolve(this.todayTasks);
        });
    }

    addTask(task: Task) {
        return new Promise((resolve, reject) => {
            task.created_at = dayjs().format();
            task.today = dayjs().isSame(dayjs(task.due_at), 'day');
            task.process();

            console.log(task, this.tasks);

            this.tasks.push(task);
            this.sync();

            this.filterTodayTasks();

            console.log(this.tasks);

            resolve(true);
        });
    }

    editTask(task: Task) {
        this.taskUnderEdit = task;
        this.editingTask.next(this.taskUnderEdit);

        this.filterTodayTasks();
    }

    deleteTask(task: Task) {
        _.remove(this.tasks, (t) => t.uuid === task.uuid);
        this.filterTodayTasks();

        this.sync();
    }

    markTaskAsCompleted(task: Task) {
        task.completed_at = dayjs().toISOString();
        task.status = 2;

        this.sync();
    }

    saveUpdatedTask(task: Task) {
        return new Promise((resolve, reject) => {
            this.sync();

            resolve(true);
        });
    }

    sync() {
        console.log(this.tasks);

        this.storageService.storeData('tasks', this.tasks).then();
        this.tasksUpdated.next(this.tasks);
    }

    private processRawTasks(rawTasks: any[]) {
        this.tasks = rawTasks.map((t) => new Task(t));
        this.filterTodayTasks();
    }

    private filterTodayTasks() {
        this.todayTasks = _.filter(this.tasks, (t) => {
            // return true;

            if (dayjs().isSame(dayjs(t.due_at), 'day')) {
                return true;
            }

            if (dayjs().isAfter(dayjs(t.due_at), 'day') && t.status < 2) {
                return true;
            }

            return false;
        });

        // Emit event
        this.tasksUpdated.next(this.todayTasks);
    }
}
