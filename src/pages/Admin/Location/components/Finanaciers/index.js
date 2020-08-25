import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { List } from 'antd';
import styles from './index.less';

const Financiers = ({ position, user, format = 'vertical' }) => {
  const namePosition = {
    dep: formatMessage({ id: 'location.department' }),
    lead: formatMessage({ id: 'location.lead' }),
    work: formatMessage({ id: 'location.worklist' }),
  };
  return (
    user && (
      <div className={`${styles.root} ${styles[format]}`}>
        <div className={styles.position}>{namePosition[position]}:</div>
        <List
          size="small"
          dataSource={user}
          renderItem={item => (
            <List.Item>
              <div className={styles.fullName}>{item}</div>
            </List.Item>
          )}
        />
      </div>
    )
  );
};

export default Financiers;
