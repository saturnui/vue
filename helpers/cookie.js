const COOKIE_PREFIX = 'novo_'

export const isIPAddress = val => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    val
  )
}

export const parseHostname = url => {
  let hostname
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }
  //find & remove port number
  hostname = hostname.split(':')[0]
  //find & remove "?"
  hostname = hostname.split('?')[0]
  return hostname
}

export const parseDomain = url => {
  let hostname = parseHostname(url)
  if (hostname === 'localhost') {
    return hostname
  }
  let slices = hostname.split('.')
  return slices[slices.length - 2] + '.' + slices[slices.length - 1]
}

/**
 * Sets a domain cookie
 *
 * @param key
 * @param val
 * @param expiresAt
 */
export const setCookie = (key, val, expiresAt) => {
  let domain = location.hostname
  if (!isIPAddress(domain) && domain !== 'localhost') {
    domain = '.' + parseDomain(domain)
  }
  let expires = ''
  let d = new Date()
  if (expiresAt) {
    d.setTime(expiresAt)
    expires = 'expires=' + d.toUTCString()
  }
  document.cookie = COOKIE_PREFIX + key + '=' + val + ';' + expires + ';path=/;SameSite=None;Secure;Domain=' + domain
}

/**
 * Gets a domain cookie
 *
 * @param key
 */
export const getCookie = key => {
  let name = COOKIE_PREFIX + key + '='
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
