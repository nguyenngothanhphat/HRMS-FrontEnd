import React, { useState } from 'react';
import { Card, Dropdown, Menu } from 'antd';
import SmallDownArrow from '@/assets/smallDropdownGray.svg';
import CompensationDetail from './component/CompensationDetail';
import PayHistory from './component/PayHistory';
import PayDetail from './component/PayDetail';

import styles from './index.less';

const CompensationSummary = () => {
  const [filterMode, setFilterMode] = useState('2021');

  const renderFilterMode = () => {
    if (filterMode === '2021') return '2021';
    return '2022';
  };

  const onClick = ({ key }) => {
    setFilterMode(key);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="2021">2021</Menu.Item>
      <Menu.Item key="2022">2022</Menu.Item>
    </Menu>
  );

  const renderOption = () => {
    return (
      <Dropdown overlay={menu}>
        <div className={styles.options} onClick={(e) => e.preventDefault()}>
          <span>{renderFilterMode()}</span>

          <img src={SmallDownArrow} alt="" />
        </div>
      </Dropdown>
    );
  };
  return (
    <div className={styles.CompensationSummary}>
      <Card title="" className={styles.CompensationSummary__detail}>
        <CompensationDetail />
      </Card>
      <Card
        title="Pay Details (Yearly basis)"
        className={styles.CompensationSummary__payDetail}
        extra={renderOption()}
      >
        <PayDetail />
      </Card>
      <Card title="Pay History" className={styles.CompensationSummary__payHistory}>
        <PayHistory />
      </Card>
    </div>
  );
};

export default CompensationSummary;
