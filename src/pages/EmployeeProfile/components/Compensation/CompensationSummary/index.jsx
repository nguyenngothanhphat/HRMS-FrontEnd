import React from 'react';
import { Card } from 'antd';
import CompensationDetail from './component/CompensationDetail';
import PayHistory from './component/PayHistory';
import PayDetail from './component/PayDetail';

import styles from './index.less';

const CompensationSummary = (props) => {
  return (
    <div className={styles.CompensationSummary}>
      <Card title="" className={styles.CompensationSummary__detail}>
        <CompensationDetail />
      </Card>
      <Card title="Pay Details (Yearly basis)" className={styles.CompensationSummary__payDetail}>
        <PayDetail />
      </Card>
      <Card title="Pay History" className={styles.CompensationSummary__payHistory}>
        <PayHistory />
      </Card>
    </div>
  );
};

export default CompensationSummary;
