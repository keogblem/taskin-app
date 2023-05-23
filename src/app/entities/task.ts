/* eslint-disable @typescript-eslint/naming-convention */
import { isEmpty } from 'src/library/utils';

export class Task {
    id: number;
    title: string;
    text: string;
    created_at;
    updated_at;
    completed_at;
    start_at;
    due_at;
    priority = 1;
    priorityLabel: string;
    status = 0;
    statusLabel: string;
    category;
    tags: any[];
    today: boolean;

    constructor(data: Record<string, any> = null) {
        if (!isEmpty(data)) {
            Object.assign(this, data);
        }
    }

    process() {
        this.today = !!this.today;

        this.priorityLabel = availablePriorities[this.priority];

        this.statusLabel = availableStatuses[this.status];
    }
}

export const availablePriorities = {
    1: 'low',
    2: 'normal',
    3: 'important',
    4: 'emergency',
};

export const availableStatuses = {
    0: 'pending',
    1: 'started',
    2: 'completed',
    3: 'postponed',
    4: 'postponed',
};
