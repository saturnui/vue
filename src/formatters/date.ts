import dayjs from 'dayjs'

export const formatLongDate = (tsSeconds = 0) => {
  return dayjs(tsSeconds * 1000).format('MMMM DD, YYYY')
}
