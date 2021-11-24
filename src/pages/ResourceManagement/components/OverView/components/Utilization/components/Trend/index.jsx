import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { connect } from 'umi';

import styles from './index.less';

const Trend = (props) => {
  const { dispatch, startDate = '', endDate = '' } = props;

  // redux
  const { resourceManagement: { resourceUtilizationChartData = [] } = {} } = props;

  const [data, setData] = useState([]);

  const fetchResourceUtilizationChart = (start, end) => {
    dispatch({
      type: 'resourceManagement/fetchResourceUtilizationChart',
      payload: {
        startDate: start ? moment(start) : '',
        endDate: end ? moment(end) : '',
      },
    });
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchResourceUtilizationChart(startDate, endDate);
    }
  }, [startDate, endDate]);

  const formatData = () => {
    return resourceUtilizationChartData.map((x) => {
      const { summary = [] } = x;
      const billable = summary.find((y) => y.status === 'Unpaid');
      const total = summary.find((y) => y.status === 'Total');

      return {
        ...x,
        name: x.week,
        utilization: billable && total && total?.count !== 0 ? (billable.count / total.count)*100 : 0,
      };
    });
  };

  useEffect(() => {
    const tempData = formatData(resourceUtilizationChartData);
    setData(tempData);
  }, [JSON.stringify(resourceUtilizationChartData)]);

  return (
    <div className={styles.Trend}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          width={500}
          height={200}
          data={data}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D7E3FF" stopOpacity={0.753} />
              <stop offset="95%" stopColor="rgba(226, 235, 255, 0)" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            dataKey="utilization"
            strokeWidth={2}
            stroke="#2C6DF9"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default connect(({ resourceManagement }) => ({ resourceManagement }))(Trend);
