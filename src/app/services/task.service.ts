import { Injectable } from '@angular/core';
import { Task } from '../entities/task';
import { StorageService } from './storage.service';
import _ from 'underscore';
import * as dayjs from 'dayjs';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    tasks: Task[];
    todayTasks: Task[];

    constructor(private storageService: StorageService) { }

    getAllTasks() {
        return new Promise<Task[]>((resolve) => {
            if (this.tasks !== undefined) {
                resolve(this.tasks);
            }

            this.storageService.retreiveData('tasks').then((rawTasks) => {
                this.processRawTasks(rawTasks);
                resolve(this.tasks);
            }).catch(() => {
                console.warn('No tasks found');
                this.tasks = [];
                resolve(this.tasks);
            });

            // resolve([]);
        });
    }

    getTodayTasks() {
        return new Promise<Task[]>((resolve) => {
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
            this.storageService.storeData('tasks', this.tasks).then();

            console.log(this.tasks);

            resolve(true);
        });
    }

    private processRawTasks(rawTasks: any[]) {
        this.tasks = rawTasks.map((t) => new Task(t));
        this.filterTodayTasks();
    }

    private filterTodayTasks() {
        this.todayTasks = _.where(this.tasks, { today: true });
    }
}

