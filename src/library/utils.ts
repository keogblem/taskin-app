/* eslint-disable no-prototype-builtins, @typescript-eslint/no-explicit-any */
import * as dayjs from 'dayjs';

export function dateTool(value = null) {
    return isEmpty(value) ? dayjs() : dayjs(value);
}

export function isEmpty(value: any) {
    if (value == null) {
        return true;
    }

    if (typeof value === 'number') {
        return value === 0;
    }

    if (typeof value === 'string') {
        return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (typeof value === 'object') {
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                return false;
            }
        }
    }
    return true;
}

export class Utils {
    static isEmpty(value: any) {
        return isEmpty(value);
    }

    static isNotEmpty(value: any) {
        return !Utils.isEmpty(value);
    }

    static sanitizePhone(phone: any) {
        if (Utils.isEmpty(phone)) {
            return '';
        }
        // noinspection RegExpSimplifiable
        return phone
            .toString()
            .replace(new RegExp('[ ]|[+]|[-]', 'g'), '')
            .replace(new RegExp('^00'), '');
    }

    static isValidEmail(email: string) {
        if (!Utils.isEmpty(email)) {
            // noinspection RegExpRedundantEscape
            // eslint-disable-next-line no-useless-escape
            if (
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                    email.toLowerCase()
                )
            ) {
                return true;
            }
        }
        return false;
    }

    static contains(elm: any, data: Array<string>): boolean {
        return data.indexOf(elm) !== -1;
    }

    static compareValues(key: any, order = 'asc') {
        return (a: any, b: any) => {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                return 0;
            }

            const varA =
                typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
            const varB =
                typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return order === 'desc' ? comparison * -1 : comparison;
        };
    }

    static randomInt(min = 0, max = 100) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
