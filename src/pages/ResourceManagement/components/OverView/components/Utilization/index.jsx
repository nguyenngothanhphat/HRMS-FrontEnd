import { Button, Card, message, notification, Spin, Tabs } from 'antd';
import FileSaver from 'file-saver';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useCurrentPng } from 'recharts-to-png';
import { connect } from 'umi';
import DownloadIcon from '@/assets/resourceManagement/download.svg';
import CustomRangePicker from '../CustomRangePicker';
import Latest from './components/Latest';
import Trend from './components/Trend';
import styles from './index.less';

const { TabPane } = Tabs;

const Utilization = (props) => {
  const { loadingFetch = false } = props;
  const [activeKey, setActiveKey] = useState('1'); // 1: latest, 2: trend
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [invalidDates, setInvalidDates] = useState(false);
  const [getChartPng, { ref: chartRef, isLoading }] = useCurrentPng();

  useEffect(() => {
    const theFirst = moment.utc().add(-1, 'years').add(1, 'months').startOf('month');
    const theLast = moment.utc().endOf('month');
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
      setInvalidDates(false);
    }
  };

  const exportChart = useCallback(async () => {
    const png = await getChartPng();
    if (png) {
      FileSaver.saveAs(png, 'resource_utilization_trend.png');
    } else {
      notification.error({
        message: 'Nothing to export',
        description: 'Please choose another range',
      });
    }
  }, [getChartPng]);

  useEffect(() => {
    if (isLoading) {
      const hide = message.loading('Exporting to PNG...', 0);
      // Dismiss manually and asynchronously
      setTimeout(hide, 1500);
    }
  }, [isLoading]);

  const exportBtn = () => {
    if (activeKey === '1') return '';
    return (
      <Button
        className={styles.exportBtn}
        onClick={exportChart}
        icon={<img src={DownloadIcon} alt="" />}
      >
        Export
      </Button>
    );
  };

  const options = () => {
    if (activeKey === '1') return '';
    return (
      <CustomRangePicker startDate={startDate} endDate={endDate} onChange={onDatePickerChange} />
    );
  };

  return (
    <Card title="Resource Utilization" className={styles.Utilization} extra={exportBtn()}>
      <Spin spinning={loadingFetch}>
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
            <Trend
              startDate={startDate}
              endDate={endDate}
              invalidDates={invalidDates}
              chartRef={chartRef}
            />
          </TabPane>
        </Tabs>
      </Spin>
    </Card>
  );
};

export default connect(({ resourceManagement, loading }) => ({
  resourceManagement,
  loadingFetch:
    loading.effects['resourceManagement/fetchResourceUtilizationList'] ||
    loading.effects['resourceManagement/fetchResourceUtilizationChart'],
}))(Utilization);
