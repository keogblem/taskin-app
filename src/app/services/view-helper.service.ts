import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Utils } from '../../library/utils';

@Injectable({
    providedIn: 'root'
})
export class ViewHelperService {

    private loader: any;
    private toast: any;
    private alert: any;
    private confirmAlert: any;

    constructor(
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private platform: Platform,
        private toastCtrl: ToastController
    ) {
    }

    async showLoader(message: string, duration = 0) {
        this.hideLoader();
        this.loader = await this.loadingCtrl.create({
            duration,
            message
        });
        await this.loader.present();
    }

    async showAlert(title: string, message: string, buttonText = 'OK', customClass = '') {
        this.hideAlert();
        this.alert = await this.alertCtrl.create({
            header: title,
            message,
            backdropDismiss: true,
            cssClass: customClass,
            buttons: [buttonText]
        });
        await this.alert.present();
        // this.alert.onDidDismiss().then(e => {console.log(e); console.log(this.alert);})
    }

    async showAlertWithHandler(title: string, message: string, callback: () => void, action: string = 'Confirmer') {
        this.confirmAlert = await this.alertCtrl.create({
            header: title,
            message,
            buttons: [
                {
                    text: action,
                    handler: e => {
                        console.log('alert callback triggered', e);
                        callback();
                    }
                },
                {
                    text: 'Annuler',
                    role: 'cancel',
                    handler: () => {
                        console.log('cancel pressed');
                    }
                }
            ]
        });

        await this.confirmAlert.present();
    }

    async showToast(message: string, msDuration: number = 0, header: string = null, color = 'dark', closeButtonText = null, customClass = '', position: 'top'|'bottom'|'middle' = 'bottom') {
        this.hideToast();

        const buttons = [];

        if (Utils.isEmpty(msDuration) && Utils.isEmpty(closeButtonText)) {
            closeButtonText = 'OK';
        }

        if (Utils.isNotEmpty(closeButtonText)) {
            buttons.push({
                text: closeButtonText,
                role: 'cancel',
            });
        }

        if (Utils.isEmpty(position)) {
            position = 'top';
        }
        this.toast = await this.toastCtrl.create({
            header,
            message,
            duration: msDuration,
            buttons,
            cssClass: customClass,
            position,
            color
        });

        await this.toast.present();
    }

    async showErrorToast(message: string, duration: number = 0, header = null, closeButton = 'OK', position: 'top'|'bottom'|'middle' = 'bottom') {
        await this.showToast(message, duration, header, 'danger', closeButton, '', position);
    }

    async showToastOnce(message: string, msDuration: number = 0, header: string = null, color = 'dark', closeButtonText = null, customClass = '', position: 'top' | 'bottom' | 'middle' = 'bottom') {
        if (this.toast) {
            await this.toast.dismiss();
        }

        await this.showToast(message, msDuration, header, color, closeButtonText, customClass, position);
    }

    public hideLoader() {
        if (this.loader) {
            this.loader.dismiss().then();
        }
    }

    public hideAlert() {
        if (this.confirmAlert) {
            this.confirmAlert.dismiss().then(res => console.log(res, this.alert));
        }
    }

    public hideToast() {
        if (this.toast) {
            this.toast.dismiss().then();
        }
    }

    public isCapacitor() {
        return this.platform.is('capacitor');
    }
}
