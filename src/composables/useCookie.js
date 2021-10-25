import { customRef } from 'vue';
import { getCookie, setCookie } from '../helpers/cookie';
export const useCookie = (key, expiresInMS = 0, defaultValue = undefined) => {
    return customRef((track, trigger) => {
        return {
            get() {
                track();
                return JSON.parse(getCookie(key) || 'null') || defaultValue;
            },
            set(val) {
                let expiresAt = 0;
                if (expiresInMS) {
                    expiresAt = Date.now() + expiresInMS;
                }
                if (val === null || val === undefined) {
                    setCookie(key, '', 0);
                }
                else {
                    setCookie(key, JSON.stringify(val), expiresAt);
                }
                trigger();
            },
        };
    });
};
