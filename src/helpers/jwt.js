import { atob } from './crypt';
export const decode = (token) => {
    if (token) {
        const base64UrlSlice = token.split('.');
        if (base64UrlSlice.length) {
            const base64Url = base64UrlSlice[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64)
                .split('')
                .map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
                .join(''));
            return JSON.parse(jsonPayload);
        }
    }
    return;
};
export const expired = (token) => {
    try {
        const decodedToken = decode(token);
        if (decodedToken) {
            return new Date() > new Date(decodedToken.exp * 1000);
        }
    }
    catch (e) {
        console.warn(e);
    }
    return true;
};
