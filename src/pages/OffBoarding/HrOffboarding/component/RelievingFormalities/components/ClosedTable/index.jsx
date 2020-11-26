import React, { PureComponent } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent';
import filterIcon from './assets/filterIcon.png';
import styles from './index.less';

class ClosedTable extends PureComponent {
  render() {
    const closedTable = [
      {
        ticketId: 123,
        employeeId: 'PSI 2090',
        name: 'Vamsi Venkat Krishna A..',
        department: 'UX & Research',
        lwd: '22.01.2021',
      },
      {
        ticketId: 123,
        employeeId: 'PSI 2090',
        name: 'Vamsi Venkat Krishna A..',
        department: 'UX & Research',
        lwd: '22.01.2021',
      },
    ];

    return (
      <div className={styles.closedTable}>
        <div className={styles.toolbar}>
          <div className={styles.filter}>
            <Button
              type="link"
              shape="round"
              icon={<img src={filterIcon} alt="icon" />}
              size="small"
            >
              Filter
            </Button>
          </div>
          <div className={styles.searchBar}>
            <Input
              placeholder="Search for ticket ID, resignee, requests …"
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
        <TableComponent data={closedTable} isClosedTable />
      </div>
    );
  }
}

export default ClosedTable;
