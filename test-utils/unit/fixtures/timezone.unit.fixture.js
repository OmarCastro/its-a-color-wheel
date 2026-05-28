const oldIntlDateTimeFormat = Intl.DateTimeFormat


export function setup(){
  let timeZone = null


  Intl.DateTimeFormat = (locales, options, ...args) => {
    return oldIntlDateTimeFormat(locales, timeZone ? {timeZone, ...options} : options, ...args)
  }

  return {
    useUTC(){
      timeZone = "UTC"
    }
  }

}

export function teardown() {
  Intl.DateTimeFormat = oldIntlDateTimeFormat
}

/**
 * @typedef {object} MockApi
 * @property {() => void} useUTC - applies UTC timezone to time related operations
 */

