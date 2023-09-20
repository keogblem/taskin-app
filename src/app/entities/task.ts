/* eslint-disable @typescript-eslint/naming-convention */
import { isEmpty } from 'src/library/utils';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';

export class Task {
    id: number;
    uuid: string;
    title: string;
    description: string;
    project: string;
    list: Array<{ label: string; done: boolean }> = [];
    created_at;
    created_at_timestamp;
    updated_at;
    completed_at;
    start_at;
    due_at;
    priority = 1;
    priorityLabel: string;
    status = 0;
    statusLabel: string;
    tags: any[];
    today = false;
    isOverdue = false;

    constructor(data: Record<string, any> = null) {
        if (!isEmpty(data)) {
            Object.assign(this, data);
        }

        this.process();
    }

    process() {
        // this.today = !!this.today;

        if (isEmpty(this.uuid)) {
            this.uuid = uuidv4();
        }

        this.priorityLabel = availablePriorities[this.priority];

        this.statusLabel = availableStatuses[this.status];

        this.isOverdue = dayjs(this.due_at).isBefore(dayjs());
    }
}

export const availablePriorities = {
    1: 'normal',
    2: 'important',
    3: 'emergency',
};

export const availableStatuses = {
    0: 'pending',
    1: 'started',
    2: 'completed',
    3: 'postponed',
    4: 'deleted',
};
