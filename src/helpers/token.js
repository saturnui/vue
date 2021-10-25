import { getCookie, setCookie } from './cookie';
const ACCESS_TOKEN_COOKIE = 'access';
const REFRESH_TOKEN_COOKIE = 'refresh';
export const getAccessToken = () => {
    return getCookie(ACCESS_TOKEN_COOKIE);
};
export const setAccessToken = (token, expirationInSeconds = 0) => {
    setCookie(ACCESS_TOKEN_COOKIE, token, new Date(expirationInSeconds * 1000).getTime());
};
export const getRefreshToken = () => {
    return getCookie(REFRESH_TOKEN_COOKIE);
};
export const setRefreshToken = (token) => {
    setCookie(REFRESH_TOKEN_COOKIE, token, new Date(2100, 1, 1).getTime());
};
export const clearTokens = () => {
    setCookie(ACCESS_TOKEN_COOKIE, '', Date.now());
    setCookie(REFRESH_TOKEN_COOKIE, '', Date.now());
};
