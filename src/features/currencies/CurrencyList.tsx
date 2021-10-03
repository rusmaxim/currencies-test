import { FC, useEffect, useState } from "react";
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
} from '@devexpress/dx-react-grid-material-ui';

import {
    DataTypeProvider,
    FilteringState,
    IntegratedSorting,
    SortingState,
} from "@devexpress/dx-react-grid";


import { CurrencyRate, getCurrencyRates } from "./currencyRates.service";
import { CurrencyTypesCodes, getCurrencyTypes } from "./currencyTypes.service";
import { DatePicker } from "@material-ui/pickers";

const currencyTypes = getCurrencyTypes();

type CurrencyListRow = {
    currency: CurrencyTypesCodes
    rate: number
    date: string
}

const prepareRows = (currencyRate: CurrencyRate[]) => {
    return currencyRate.map(rate => ({
        currency: currencyTypes[rate[0]],
        rate: rate[2],
        date: rate[1].format("DD.MM.YYYY"),
    }))
}

const DateEditor: React.ComponentType<DataTypeProvider.ValueEditorProps> = ({value, onValueChange}) => {
    const handleChange = (value: any) => {
        onValueChange(value);
    };
    return <DatePicker
        value={value}
        onChange={handleChange}
        animateYearScrolling
    />;
}

export const CurrencyList: FC = () => {
    const [rates, setRates] = useState<CurrencyListRow[]>([]);

    const [columns] = useState([
        { name: 'currency', title: 'Currency' },
        { name: 'rate', title: 'Rate' },
        { name: 'date', title: 'Date' },
    ]);

    const [filters, setFilters] = useState<any[]>([])

    const [filteringStateColumnExtensions] = useState([
        { columnName: 'rate', filteringEnabled: false },
      ]);

    const [dateColumns] = useState(['date']);
    const [dateFilterOperations] = useState(['date']);

    useEffect(() => {
        let invalidateFlag = false;
        async function fetchRates() {
            if (invalidateFlag) return;

            const filterDate = filters.find(({columnName}) => columnName === 'date')
            const filterCurrency = filters.find(({columnName}) => columnName === 'currency')

            const currencyRates = await getCurrencyRates(filterDate ? filterDate.value : undefined);

            const rows = prepareRows(currencyRates)
            if (filterCurrency) {
                const currenciesFilters = filterCurrency.value.split(" ");
                return setRates(rows.filter((rate) =>
                    currenciesFilters.some((filter: any) => filter && rate.currency.indexOf(filter) > -1))
                )
            }
            setRates(rows);
        }
        fetchRates()

        return () => {
            invalidateFlag = true
        }
    }, [filters])

    return <Paper>
        <Grid
            rows={rates}
            columns={columns}
        >
            <DataTypeProvider
                for={dateColumns}
                availableFilterOperations={dateFilterOperations}
                editorComponent={DateEditor}
            />
            <FilteringState
                filters={filters}
                onFiltersChange={setFilters}
                columnExtensions={filteringStateColumnExtensions}
            />
            <SortingState
                defaultSorting={[{ columnName: 'currency', direction: 'asc' }]}
            />
            <IntegratedSorting />
            <Table />
            <TableHeaderRow showSortingControls />
            <TableFilterRow
                showFilterSelector
            />
        </Grid>
    </Paper>
}
