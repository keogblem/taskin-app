import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EventManager } from 'src/library/event-manager';
import * as Case from 'change-case';
import { isEmpty } from 'src/library/utils';

@Injectable({
    providedIn: 'root'
})

export class StorageService {

    public status = 'notReady';

    private storage: Storage|null = null;

    constructor(
        private ionicStorage: Storage,
        private eventManager: EventManager
    ) {
        this.init().then(() => {
            console.log('Storage is ready !!');
        }).catch((e) => console.warn('Initialization failed', e));
    }

    async init() {
        if (this.storage !== null || this.status === 'checkingCompliance') {
            return;
        }

        console.log('Initialiazing Storage ...');

        this.status = 'initializing';

        // If using, define drivers here: await this.storage.defineDriver(/*...*/);
        // const storage = await this.ionicStorage.create();
        // this.storage = storage;
        this.storage = await this.ionicStorage.create();

        console.log(this.storage);

        await this.checkStorageCompliance();
    }

    // set a key/value
    async set(key: string, value: any, verbose = false): Promise<any> {
        try {
            const result = await this.storage?.set(key, value);
            if (verbose) {
                console.log('storage@SET ' + key + ': ' + result);
            }
            return true;
        } catch (reason) {
            console.log(reason);
            return false;
        }
    }

    // to get a key/value pair
    async get(key: string): Promise<any> {
        if (this.status !== 'ready') {
            await this.init();
        }

        try {
            const result = await this.storage?.get(key);
            console.log('storage@GET ' + key + ': ' + result);
            return result;
        } catch (reason) {
            console.log(reason);
            return null;
        }
    }

    // set a key/value object
    async setObject(key: string, object: any, verbose = false): Promise<boolean> {
        try {
            const result = await this.storage?.set(key, JSON.stringify(object));
            if (verbose) {
                console.log('storage@SET Object (' + key + ') : ' + result);
            }
            return true;
        } catch (reason) {
            console.log(reason);
            return false;
        }
    }

// get a key/value object
    async getObject(key: string): Promise<any> {
        // console.log('Status', this.status, key);
        if (this.status !== 'ready') {
            await this.init();
        }

        try {
            const result = await this.storage?.get(key);
            if (result != null) {
                return JSON.parse(result);
            }
            return null;
        } catch (reason) {
            console.log(reason);
            return null;
        }
    }

    // remove a single key value:
    async remove(key: string): Promise<boolean> {
        return await this.storage?.remove(key)
            .then(() => true)
            .catch((e) => {
                console.log(e);
                return false;
            });
    }

    //  delete all data from your application:
    clear(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage?.clear().then(() => {
                console.warn('Storage cleared');
                resolve(true);
            }).catch((e) => {
                console.error(e);
                reject(e);
            });
        });
    }

    async retreiveData(key, isObject = true): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            // if (useCache && this.cache[key] != null) {
            //     // console.log(key + ' found in cache', this.cache[key]);
            //     resolve(this.cache[key]);
            //     return;
            // }

            // console.log(key + ' not found in cache');
            if (isObject) {
                this.getObject(key).then(data => {
                    if (! isEmpty(data)) {
                        // console.warn('Data "' + key + '" found', data);
                        // this.addToCache(key, data);
                        resolve(data);
                    } else {
                        // console.warn('Data "' + key + '" not found or empty', data);
                        reject(false);
                    }
                });
            } else {
                this.get(key).then(data => {
                    if (data) {
                        // this.addToCache(key, data);
                        resolve(data);
                    } else {
                        // console.warn('Data "' + key + '" not found');
                        reject(false);
                    }
                });
            }
        });
    }

    async storeData(key: string, data, isObject = true, options: Record<any, any> = { notify: false, cache: true }): Promise<any> {
        if (data === null || data === undefined) {
            return null;
        }

        if (isObject) {
            await this.setObject(key, data).then();
        } else {
            await this.set(key, data).then();
        }

        if (options.notify === true || options.notify === 'publish') {
            this.eventManager.publish(Case.pascalCase(key) + 'Updated', data);
            console.log(Case.pascalCase(key) + 'Updated publish');
        } else if (options.notify === 'queue') {
            this.eventManager.queue(Case.pascalCase(key) + 'Updated', data);
        }

        return data;
    }

    private async checkStorageCompliance() {
        // if (this.status === 'checkingCompliance') {
        //     console.log('— — — Already checking compliance');
        //     return;
        // }

        // this.status = 'checkingCompliance';

        // const v = await this.get('__dbVersion');

        // if (DB.version <= Number(v)) {
        //     console.log('Data Is Compliant');
        //     this.status = 'ready';
        //     return;
        // }

        // for (const key of DB.deprecatableDataFields) {
        //     await this.remove(key);
        // }

        // await this.set('__dbVersion', DB.version);

        // console.warn('Deprecated Data Wiped');
        // this.eventManager.publish('DeprecatedDataWiped');
        // this.status = 'ready';
    }
}
