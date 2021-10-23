export const formatCurrency = (price = 0, currency) => {
  if (price) {
    return decorateCurrency(Number(price / 100).toFixed(2))
  }
  return decorateCurrency('0.00', currency)
}
