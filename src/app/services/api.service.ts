/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    public apiUrl = config.serverUrl;
    private apiPrefix = '';
    private key = '';
    private queryKeyName = '_key';
    private isReady = false;

    constructor(
        private httpClient: HttpClient,
        private storageService: StorageService,
    ) {
        // Check API server
        this.checkApiServer();
        this.loadStoredKey().then();
        // eventManager.subscribe('UserLoggedOut', () => {
        //     this.reset();
        // });
    }

    private static buildRequestHeaders(headers: Record<string, string> = {}) {
        return new HttpHeaders(
            Object.assign(
                {
                    // 'Cache-Control': 'private',
                    // 'Access-Control-Max-Age': '300'
                },
                headers
            )
        );
    }

    setKey(key: string | null) {
        this.key = String(key);
        this.isReady = true;
    }

    get(path = '', params: Record<string, any> = {}, addApiKey = true, rawPath = false): Observable<any> {
        if (addApiKey) {
            params = this.forceAddKeyToParams(params);
        }

        let queryString = Object.keys(params)
            .map((key) => key + '=' + params[key])
            .join('&');
        queryString = (queryString.length > 0 ? '?' : '') + queryString;

        const url = rawPath ? path : this.apiUrl + this.apiPrefix + path + queryString;

        return this.httpClient.get(url);
    }

    post(path = '', params: Record<string, any> = {}, addApiKey = true): Observable<any> {
        if (addApiKey) {
            params = this.forceAddKeyToParams(params);
        }
        console.log(this.apiUrl + this.apiPrefix + path, JSON.stringify(params));
        return this.httpClient.post(this.apiUrl + this.apiPrefix + path, params, {
            headers: ApiService.buildRequestHeaders(),
        });
    }

    getOrPost(type = 'post', path = '', params: Record<string, unknown> = {}, addApiKey = true) {
        if (type === 'post') {
            return this.post(path, params, addApiKey);
        }

        return this.get(path, params, addApiKey);
    }

    checkApiServer() {
        this.get().subscribe({
            next: (response) => {
                console.log('API reached !', response);
            },
            error: (error) => {
                console.error('API failed !', error.error);
            },
        });
    }

    async makeRequest(type: 'post' | 'get' | 'put', path: string, params = {}, addApiKey = true): Promise<any> {
        if (addApiKey) {
            await this.addKeyToParams(params).then((paramsWithKey) => {
                params = paramsWithKey;
            });
        }
        return new Promise((resolve, reject) => {
            this.getOrPost(type, path, params, false).subscribe({
                next: (result) => {
                    console.log(result);
                    if (result.status === 'success') {
                        resolve(result.data);
                    } else {
                        reject(result);
                    }
                },
                error: (error) => {
                    console.error(error);
                    reject(error.error);
                },
            });
        });
    }

    async makeOperationRequest(path: string, params = {}): Promise<any> {
        console.log(path, params);
        return this.makeRequest('post', path, params);
    }

    async storeNewKey(key: string, rawApiKey: any = null) {
        return await this.storageService
            .set('key', key)
            .then(() => {
                this.setKey(key);
                if (rawApiKey) {
                    this.storeRawApiKey(rawApiKey).then(() => console.log('raw Api Key saved'));
                }
                return true;
            })
            .catch(() => false);
    }

    async storeRawApiKey(apiKey: any) {
        // delete apiKey.id
        return this.storageService.setObject('apiKey', apiKey);
    }

    async removeKey() {
        return await this.storageService.remove('key');
    }

    reset() {
        this.key = '';
        this.isReady = false;
    }

    private async loadStoredKey() {
        await this.storageService.get('key').then((key) => {
            this.setKey(String(key));
            console.log('Api Key loaded');
        });
    }

    private async addKeyToParams(params: any) {
        if (!this.isReady) {
            console.warn('not ready yet');
            await this.loadStoredKey();
        }

        if (this.key) {
            params[this.queryKeyName] = this.key;
        }
        return params;
    }

    private forceAddKeyToParams(params: any) {
        params[this.queryKeyName] = this.key;
        return params;
    }
}
