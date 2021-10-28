import React, { Component } from 'react';
import styles from './index.less';
import SearchTable from '../SearchTable';
import TableTickets from '../TableTickets';
import TicketInfo from '../TicketInfo';

export class TicketQueue extends Component {
    render() {
        return (
            <>
                <div>
                    <TicketInfo />
                </div>
                <div className={styles.containerTickets}>
                    <div className={styles.tabTickets}>
                        <SearchTable />
                    </div>
                    <TableTickets />
                </div>
            </>
        )
    }
}

export default TicketQueue
