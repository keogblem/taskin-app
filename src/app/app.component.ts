import { Component } from '@angular/core';
import { TaskService } from './services/task.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {

    public projects = [];
    public totalCount = 0;
    public todayCount = 0;

    constructor(public taskService: TaskService) {
        taskService.tasksUpdated.subscribe({
            next: () => {
                this.fetchProjects();
            }
        });
    }

    private fetchProjects() {
        const projects = _.uniq(_.compact(_.map(this.taskService.tasks, 'project'))).sort();

        this.todayCount = this.taskService.todayTasks.length;
        this.totalCount = this.taskService.tasks.length;

        this.projects = _.map(projects, (p: string) => {
            return {
                name: p,
                count: this.taskService.tasks.filter((t) => t.project === p).length
            }
        })
        // console.log(this.projects);
    }
}
