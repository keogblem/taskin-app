import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/entities/task';
import { TaskService } from 'src/app/services/task.service';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit {
    @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;

    // todayTasks: Task[];
    tasks: Task[];
    gridOptions: NgxMasonryOptions = {
        gutter: 0,
        initLayout: true,
    };

    constructor(
        private taskService: TaskService,
    ) {

    }

    ngOnInit() {
        this.taskService.getAllTasks().then((tasks) => {
            console.log(tasks);

            this.tasks = tasks.reverse();
            setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
            }, 1000);
        }).then(() => {
        });
    }

    addTask() {
        return;
        // this.modalCtrl.create({
        //     component: TaskCreationComponent,
        //     breakpoints: [0, 0.9],
        //     initialBreakpoint: 0.9,
        // }).then(modal => modal.present().then());
    }
}
