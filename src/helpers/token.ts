import { getCookie, setCookie } from './cookie'

const ACCESS_TOKEN_COOKIE = 'access'
const REFRESH_TOKEN_COOKIE = 'refresh'

export const getAccessToken = (): string => {
  return getCookie(ACCESS_TOKEN_COOKIE)
}

export const setAccessToken = (token: string, expirationInSeconds = 0) => {
  setCookie(ACCESS_TOKEN_COOKIE, token, new Date(expirationInSeconds * 1000).getTime())
}

export const getRefreshToken = (): string => {
  return getCookie(REFRESH_TOKEN_COOKIE)
}

export const setRefreshToken = (token: string) => {
  setCookie(REFRESH_TOKEN_COOKIE, token, new Date(2100, 1, 1).getTime())
}

export const clearTokens = () => {
  setCookie(ACCESS_TOKEN_COOKIE, '', Date.now())
  setCookie(REFRESH_TOKEN_COOKIE, '', Date.now())
}
