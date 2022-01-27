import React, { useState } from 'react';
import { connect } from 'umi';
import { Dropdown, Menu } from 'antd';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import BarGraph from '@/pages/HomePage/components/Voting/components/BarGraph';
import PieChart from '@/pages/HomePage/components/Voting/components/PieChart';

import styles from './index.less';

const TYPE = {
  BAR_GRAPH: 'Bar Graph',
  PIE_CHART: 'Pie Chart',
};

const mockOptions = [
  {
    id: 1,
    text: '🤩 Wayyy too excited, cannot wait!!',
    percent: 54,
  },
  {
    id: 2,
    text: '😇 Ready for the change, I guess!',
    percent: 42,
  },
  {
    id: 3,
    text: '🥱 Meh, want some more time',
    percent: 4,
  },
];

const ChartPreviewModalContent = () => {
  const [mode, setMode] = useState(TYPE.BAR_GRAPH);

  const menu = (
    <Menu onClick={({ key }) => setMode(key)}>
      <Menu.Item key={TYPE.BAR_GRAPH}>{TYPE.BAR_GRAPH}</Menu.Item>
      <Menu.Item key={TYPE.PIE_CHART}>{TYPE.PIE_CHART}</Menu.Item>
    </Menu>
  );

  const renderResult = () => {
    if (mode === TYPE.BAR_GRAPH) return <BarGraph options={mockOptions} showTitle={false} />;
    return <PieChart options={mockOptions} showTitle={false} />;
  };

  return (
    <div className={styles.ChartPreviewModalContent}>
      <div className={styles.selectMode}>
        <span className={styles.showAs}>Show as</span>
        <div className={styles.dropdownMenu}>
          <Dropdown overlay={menu}>
            <div className={styles.options} onClick={(e) => e.preventDefault()}>
              <span>{mode}</span>
              <img src={SmallDownArrow} alt="" />
            </div>
          </Dropdown>
        </div>
      </div>
      {renderResult()}
    </div>
  );
};
export default connect(() => ({}))(ChartPreviewModalContent);
