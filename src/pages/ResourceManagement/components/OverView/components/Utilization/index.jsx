import { Card, Tabs } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import CustomRangePicker from '../CustomRangePicker';
import Latest from './components/Latest';
import Trend from './components/Trend';
import styles from './index.less';

const { TabPane } = Tabs;

const Utilization = () => {
  const [activeKey, setActiveKey] = useState('1'); // 1: latest, 2: trend
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [invalidDates, setInvalidDates] = useState(false); 

  useEffect(() => {
    const theFirst = moment().startOf('year');
    const theLast = moment().endOf('year');
    setStartDate(theFirst);
    setEndDate(theLast);
  }, []);

  const onDatePickerChange = (dates = []) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
    const duration = moment.duration(dates[1].diff(dates[0])).asDays() + 1;
    if (duration < 28) {
      setInvalidDates(true);
    } else {
      setInvalidDates(false)
    }
  };

  const options = () => {
    if (activeKey === '1') return '';
    return (
      <CustomRangePicker startDate={startDate} endDate={endDate} onChange={onDatePickerChange} />
    );
  };

  return (
    <Card title="Resource Utilization" className={styles.Utilization}>
      <Tabs
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        tabBarExtraContent={options()}
        destroyInactiveTabPane
      >
        <TabPane tab="Latest" key="1">
          <Latest />
        </TabPane>
        <TabPane tab="Trend" key="2">
          <Trend startDate={startDate} endDate={endDate} invalidDates={invalidDates} />
        </TabPane>
      </Tabs>
    </Card>
  );
};;

export default Utilization;
