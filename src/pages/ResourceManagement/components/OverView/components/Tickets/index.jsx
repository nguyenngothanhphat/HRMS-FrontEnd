import React from 'react';
import { Input } from 'antd';
import styles from './index.less';

const Tickets = () => {
    return (
      <div className={styles.Tickets}>
        <div>
          <h1>Incoming Tickets</h1>
          <Input />
        </div>
      </div>
    )
}

export default Tickets
