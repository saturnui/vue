export const decorateCurrency = (amount = '0.00', currency = 'usd') => {
    switch (currency) {
        default:
            return '$ ' + amount;
    }
};
