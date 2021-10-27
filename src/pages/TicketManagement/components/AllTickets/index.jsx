import React from 'react';
import Summary from './components/Summary';
import SearchTable from './components/SearchTable';
import styles from './index.less';
import TableTickets from './components/TableTickets'

const AllTickets = () => {
    return (
        <div className={styles.containerTickets}>
            <div className={styles.tabTickets}>
                <Summary />
                <SearchTable />
            </div>
            <TableTickets />
        </div>
    )
}

export default AllTickets
