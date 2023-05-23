/* eslint-disable @typescript-eslint/naming-convention */

import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { EventManager } from '../../library/event-manager';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    triggeredNotifs = [];

    constructor(
        // private localNotifications: LocalNotifications,
        private storageService: StorageService,
        // private viewHelperService: ViewHelperService,
        private eventManager: EventManager
    ) {
        eventManager.subscribe('UserLoggedOut', () => {
            this.reset();
        });
    }

    static getMonthName(monthNumber) {
        const months = {
            1: 'Janvier',
            2: 'Février',
            3: 'Mars',
            4: 'Avril',
            5: 'Mai',
            6: 'Juin',
            7: 'Juillet',
            8: 'Août',
            9: 'Septembre',
            10: 'Octobre',
            11: 'Novembre',
            12: 'Décembre',
        };

        // eslint-disable-next-line radix
        monthNumber = parseInt(monthNumber);
        return months[monthNumber] ? months[monthNumber] : monthNumber;
    }

    static getRelativeTimeFrom(date) {
        if (date == null) {
            return '';
        }

        dayjs.extend(relativeTime);

        return dayjs(date).locale('fr').fromNow();
    }

    static getFormatedDateTime(date, type: number = null, format: string = null) {
        if (date == null) {
            return '';
        }

        format = format ?? 'DD-MM-YYYY HH[h]mm\'';
        switch (type) {
            case 1:
                format = 'DD MMM YYYY [à] HH[h]mm\'';
                break;
            case 2:
                format = 'DD MMMM YYYY [à] HH[h]mm';
                break;
        }

        return dayjs(date, 'YYYY-MM-DD HH:mm:ss').locale('fr').format(format);
    }

    // getLatestVersion(): Promise<any> {
    //     return new Promise<any>((resolve, reject) => {
    //         this.apiService.get('mobile-latest', {}, false).subscribe((response) => {
    //             console.log('Latest version', response);
    //             this.setCurrentVersion(response.data);
    //             resolve(response.data);
    //         }, (error) => {
    //             console.error('Latest version failed !', error.error);
    //             this.storageService.getObject('latest-version').then((data) => {
    //                 resolve(data);
    //             }).catch(() => {
    //                 reject();
    //             });
    //         });
    //     });
    // }

    setCurrentVersion(data) {
        console.log('set current version');
        this.storageService.setObject('latest-version', data).then();
    }

    reset() {
        this.triggeredNotifs = [];
    }
}
