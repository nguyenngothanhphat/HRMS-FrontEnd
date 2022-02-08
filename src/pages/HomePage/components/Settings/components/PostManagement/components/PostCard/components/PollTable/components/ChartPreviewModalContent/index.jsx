import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Dropdown, Menu } from 'antd';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import BarGraph from '@/pages/HomePage/components/Voting/components/BarGraph';
import PieChart from '@/pages/HomePage/components/Voting/components/PieChart';

import styles from './index.less';

const TYPE = {
  BAR_GRAPH: 'Bar Graph',
  PIE_CHART: 'Pie Chart',
};

const ChartPreviewModalContent = (props) => {
  const { pollDetail = {} } = props;
  const [timeLeft, setTimeLeft] = useState('');

  // redux
  const { homePage: { pollResult = [] } = {} } = props;

  const [mode, setMode] = useState(TYPE.BAR_GRAPH);
  const [options, setOptions] = useState([]);

  const countVotes = () => {
    if (pollResult) {
      return pollResult.reduce((acc, obj) => {
        return acc + obj.count;
      }, 0);
    }
    return 0;
  };

  useEffect(() => {
    const { endDate } = pollDetail;
    if (endDate) {
      moment.locale('en', {
        relativeTime: {
          future: '%s left',
          past: 'Expired',
          s: 'seconds',
          ss: '%ss',
          m: 'a minute',
          mm: '%dm',
          h: 'an hour',
          hh: '%dh',
          d: 'a day',
          dd: '%dd',
          M: 'a month',
          MM: '%dM',
          y: 'a year',
          yy: '%dY',
        },
      });
      const timeLeftTemp = moment(endDate).fromNow();
      setTimeLeft(timeLeftTemp);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(pollDetail).length > 0) {
      const temp = [
        {
          id: 'response1',
          text: pollDetail.response1,
          percent: pollResult.find((x) => x._id === 'response1')?.percent || 0,
        },
        {
          id: 'response2',
          text: pollDetail.response2,
          percent: pollResult.find((x) => x._id === 'response2')?.percent || 0,
        },
        {
          id: 'response3',
          text: pollDetail.response3,
          percent: pollResult.find((x) => x._id === 'response3')?.percent || 0,
        },
      ];
      setOptions(temp);
    }
  }, [JSON.stringify(pollDetail), JSON.stringify(pollResult)]);

  const menu = (
    <Menu onClick={({ key }) => setMode(key)}>
      <Menu.Item key={TYPE.BAR_GRAPH}>{TYPE.BAR_GRAPH}</Menu.Item>
      <Menu.Item key={TYPE.PIE_CHART}>{TYPE.PIE_CHART}</Menu.Item>
    </Menu>
  );

  const renderResult = () => {
    if (mode === TYPE.BAR_GRAPH)
      return (
        <BarGraph options={options} showTitle={false} countVotes={countVotes} timeLeft={timeLeft} />
      );
    return (
      <PieChart options={options} showTitle={false} countVotes={countVotes} timeLeft={timeLeft} />
    );
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
export default connect(({ homePage }) => ({ homePage }))(ChartPreviewModalContent);
