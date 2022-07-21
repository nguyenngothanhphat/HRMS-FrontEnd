import { Button, Card, Dropdown, Menu } from 'antd';
import React, { useState } from 'react';
import SmallDownArrow from '@/assets/smallDropdownGray.svg';
import styles from './index.less';

const Form16 = ({ url }) => {
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
    <div className={styles.Form16}>
      <Card title="Form 16" extra={renderOption()}>
        <div className={styles.viewFile}>
          <iframe width="100%" height="500" src={url} title="pdf" />
        </div>
      </Card>
      <div className={styles.btnDownLoad}>
        <Button>DownLoad</Button>
      </div>
    </div>
  );
};

export default Form16;
