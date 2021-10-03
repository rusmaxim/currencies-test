export enum CurrencyTypesCodes {
    EUR = "EUR",
    GBP = "GBP",
    RUR = "RUR",
}

export type CurrencyTypes = {
    [key: number]: CurrencyTypesCodes
}

const currencyTypes:CurrencyTypes = {
    1 : CurrencyTypesCodes.EUR,
    2 : CurrencyTypesCodes.GBP,
    3 : CurrencyTypesCodes.RUR,
}

export function getCurrencyTypes() {
    return currencyTypes
}
