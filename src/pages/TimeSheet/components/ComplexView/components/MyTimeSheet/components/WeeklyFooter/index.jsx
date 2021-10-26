import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Table } from 'antd';
import styles from './index.less';

const WeeklyFooter = (props) => {
  const { data = {} } = props;
  const [totalList, setTotalList] = useState([]);

  const getTotalList = () => {
    const header = {};
    for (let i = 0; i < 9; i += 1) {
      header[`index${i}`] = ``;
    }
    setTotalList([header]);
  };

  useEffect(() => {
    getTotalList();
  }, []);

  const getValueOfEachCol = (index) => {
    switch (index) {
      case 0:
        return <span className={styles.text}>Total</span>;

      default:
        return '';
    }
  };

  const columns = () => {
    const result = [];
    for (let i = 0; i < 9; i += 1) {
      result.push({
        title: `index${i}`,
        dataIndex: `index${i}`,
        key: `index${i}`,
        align: 'center',
        width: `${100 / 9}%`,
        render: () => {
          return getValueOfEachCol(i);
        },
      });
    }
    return result;
  };

  // MAIN AREA
  return (
    <div className={styles.WeeklyFooter}>
      <Table columns={columns()} dataSource={totalList} pagination={false} />
    </div>
  );
};

export default connect(() => ({}))(WeeklyFooter);
