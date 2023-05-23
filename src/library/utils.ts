import * as dayjs from 'dayjs';
import { isArray, isObject } from 'rxjs/internal-compatibility';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function dateTool(value = null) {
    return Utils.isEmpty(value) ? dayjs() : dayjs(value);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function isEmpty(value) {
        if (value == null) {
            return true;
        }

        if (typeof value === 'number') {
            return value === 0;
        }

        if (typeof value === 'string') {
            return value.trim().length === 0;
        }

        if (isArray(value)) {
            return value.length === 0;
        }

        if (isObject(value)) {
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    return false;
                }
            }
        }
        return true;
    }

export class Utils {
    static isEmpty(value) {
        return isEmpty(value);
    }

    static isNotEmpty(value) {
        return ! Utils.isEmpty(value);
    }

    static sanitizePhone(phone) {
        if (Utils.isEmpty(phone)) {
            return '';
        }
        // noinspection RegExpSimplifiable
        return phone.toString().replace(new RegExp('[ ]|[+]|[-]', 'g'), '').replace(new RegExp('^00'), '');
    }

    static isValidEmail(email: string) {
        if (! Utils.isEmpty(email)) {
            // noinspection RegExpRedundantEscape
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    static contains(elm: any, data: Array<string>): boolean {
        return data.indexOf(elm) !== -1;
    }

    static compareValues(key, order = 'asc') {
        return (a, b) => {
            if (! a.hasOwnProperty(key) || ! b.hasOwnProperty(key)) {
                return 0;
            }

            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    }

    static randomInt(min = 0, max = 100) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
