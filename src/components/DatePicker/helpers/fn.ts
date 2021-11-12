export const usePreviousDate = (date: any) => {
  const display = []
  for (let i = 0; i <= date.date(0).day(); i++)
    display.push(date.date(0).subtract(i, 'day'))

  return display.sort((a, b) => a.date() - b.date())
}

export const useCurrentDate = (date: any) => {
  return Array.from(
    {
      length: date.daysInMonth(),
    },
    (v, k) => date.date(k + 1),
  )
}

export const useNextDate = (date: any) => {
  const display = []
  for (
    let i = 1;
    i <= 42 - (usePreviousDate(date).length + date.daysInMonth());
    i++
  ) {
    display.push(
      date
        .date(i)
        .month(date.month())
        .add(1, 'month'),
    )
  }
  return display
}

export const useDisableDate = (date: any, { disableDate }: any) => {
  if (typeof disableDate === 'function')
    return disableDate(date.toDate())

  else
    return false
}

export const useBetweenRange = (date: any, { previous, next }: any) => {
  let pattern
  if (previous.isAfter(next, 'date'))
    pattern = '(]'

  else
    pattern = '[)'

  return !!(date.isBetween(previous, next, 'date', pattern) && !date.off)
}

export const useToValueFromString = (date: any, { formatter }: any) => {
  return date.format(formatter.date)
}

export const useToValueFromArray = (
  { previous, next }: any,
  { formatter, separator }: any,
) => {
  return `${previous.format(formatter.date)}${separator}${next.format(
    formatter.date,
  )}`
}

export const useDirective = (binding: any) => {
  const { instance, arg, value } = binding
  document.body.addEventListener('click', (event) => {
    const targetElem = event.target as HTMLElement
    if (targetElem.classList.contains('litepie-datepicker-overlay')) {
      return (instance.isShow = false)
    }
    else {
      if (instance.vuwiDateRangePicker) {
        const { autoApply, previous, next } = instance
        const target = targetElem.classList.contains(
          'vuwi-datepicker-date',
        )
        if (target && autoApply && !previous && !next)
          return (instance.isShow = false)

        if (
          !autoApply
          && targetElem.classList.contains(`${arg}-apply-picker`)
          && instance.value !== ''
        )
          return (instance.isShow = false)

        if (targetElem.classList.contains(`${arg}-cancel-picker`))
          return (instance.isShow = false)

        if (
          targetElem.classList.contains('vuwi-shortcuts')
          && autoApply
        )
          return (instance.isShow = false)

        return (instance.isShow
          = instance.vuwiDateRangePicker.contains(targetElem)
          || document.getElementById(value) === targetElem
          || value === targetElem)
      }
      return (instance.isShow = true)
    }
  })
}

export const useVisibleViewport = (el: HTMLElement) => {
  const { right } = el.getBoundingClientRect()
  const vWidth = window.innerWidth || document.documentElement.clientWidth

  return right < vWidth
}
