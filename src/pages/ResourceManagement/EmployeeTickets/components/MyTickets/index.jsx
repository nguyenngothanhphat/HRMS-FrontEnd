import React, { PureComponent } from 'react';
import styles from './index.less';
import SearchTable from '../SearchTable';
import TableTickets from '../TableTickets';
import TicketInfo from '../TicketInfo';
import Summary from "../Summary"

class MyTickets extends PureComponent {
    render() {
        return (
          <>
            <div>
              <TicketInfo />
            </div>
            <div className={styles.containerTickets}>
              <div className={styles.tabTickets}>
                <Summary />
                <SearchTable />
              </div>
              <TableTickets />
            </div>
          </>
        )
    }
}

export default MyTickets
