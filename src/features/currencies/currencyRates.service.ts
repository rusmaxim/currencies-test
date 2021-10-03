import moment from "moment"

type CurrencyRateInput = [number, string, number]
export type CurrencyRate = [number, moment.Moment, number]

const inputCurrencyRates: CurrencyRateInput[] = [
    [1, "02.07.2021", 1.2312],
    [1, "05.07.2021", 1.2307],
    [1, "06.07.2021", 1.2411],
    [1, "07.07.2021", 1.2417],
    [1, "08.07.2021", 1.2421],
    [1, "09.07.2021", 1.2291],
    [1, "12.07.2021", 1.2302],
    [1, "13.07.2021", 1.2378],
    [1, "14.07.2021", 1.2369],
    [2, "02.07.2021", 1.378415],
    [2, "05.07.2021", 1.381722],
    [2, "06.07.2021", 1.391914],
    [2, "07.07.2021", 1.387173],
    [2, "08.07.2021", 1.388364],
    [2, "09.07.2021", 1.382674],
    [2, "12.07.2021", 1.388644],
    [2, "13.07.2021", 1.396277],
    [2, "14.07.2021", 1.395577],
    [3, "02.07.2021", 0.01772],
    [3, "05.07.2021", 0.017649],
    [3, "06.07.2021", 0.017513],
    [3, "07.07.2021", 0.017698],
    [3, "08.07.2021", 0.017605],
    [3, "13.07.2021", 0.017664],
    [3, "14.07.2021", 0.017564],
]

const currencyRates = inputCurrencyRates.map<CurrencyRate>(([id, dateString, value]) => ([id, moment(dateString, "DD.MM.YYYY"), value]))

export async function getCurrencyRates(date: moment.Moment) {
    return filterCurrencyRatesByDate(date ? date : moment(), currencyRates)
}

// TODO: Good candidate for unit test.
async function filterCurrencyRatesByDate(date: moment.Moment, rates: CurrencyRate[]) {
    return rates.reduce<CurrencyRate[]>((arr, currencyRate) => {
        if (currencyRate[1].isAfter(date)) {
            return arr
        }

        const latestRate = arr.find(rate => rate[0] === currencyRate[0])
        if (!latestRate) {
            return [...arr, currencyRate]
        }

        if (currencyRate[1].isSameOrBefore(latestRate[1])) {
            return arr
        }

        return [...arr.filter(rate => rate[0] !== currencyRate[0]), currencyRate]
    }, [])
}