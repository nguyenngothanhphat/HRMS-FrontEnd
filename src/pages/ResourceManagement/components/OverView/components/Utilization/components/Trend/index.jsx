import EmptyImage from '@/assets/resourceManagement/emptyImage.png';
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
  const { dispatch, startDate = '', endDate = '', mode = 'X' } = props;

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

  const getNameByMode = (x) => {
    if (mode === 'W') {
      return x.week;
    }
    if (mode === 'D') {
      return x.date ? moment(x.date).format('DD') : '';
    }
    return '';
  };

  const formatData = () => {
    return resourceUtilizationChartData.map((x) => {
      const { summary = [] } = x;
      const billable = summary.find((y) => y.status === 'Unpaid');
      const total = summary.find((y) => y.status === 'Total');

      return {
        ...x,
        // eslint-disable-next-line no-nested-ternary
        name: getNameByMode(x),
        utilization:
          billable && total && total?.count !== 0 ? (billable.count / total.count) * 100 : 0,
      };
    });
  };

  useEffect(() => {
    const tempData = formatData(resourceUtilizationChartData);
    setData(tempData);
  }, [JSON.stringify(resourceUtilizationChartData)]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { payload: { summary = [] } = {} || {} } = payload[0] || {};

      const billable = summary.find((x) => x.status === 'Billable');
      const bench = summary.find((x) => x.status === 'Bench');
      const buffer = summary.find((x) => x.status === 'Buffer');
      const total = summary.find((x) => x.status === 'Total');

      const items = [
        {
          name: 'Current Utilization',
          value: total && total.count !== 0 ? (billable?.count / total?.count) * 100 : '-',
        },
        {
          name: 'Total Resources',
          value: total?.count || 0,
        },
        {
          name: 'Total Billable resources',
          value: `${billable?.count} (${Math.round(billable?.percent * 100)}%)`,
        },
        {
          name: 'Total Buffer resources',
          value: `${buffer?.count} (${Math.round(buffer?.percent * 100)}%)`,
        },
        {
          name: 'Total Benched resources',
          value: `${bench?.count} (${Math.round(bench?.percent * 100)}%)`,
        },
      ];
      return (
        <div className={styles.customTooltip}>
          {items.map((x) => (
            <div className={styles.tooltipItem}>
              <span className={styles.left}>{x.name}</span>
              <span className={styles.right}>{x.value}</span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  if (mode === 'X') {
    return (
      <div className={styles.Trend}>
        <div className={styles.emptyContainer}>
          <img src={EmptyImage} alt="" />
          <p>
            The selected time range is too small. <br />
            Minimum time range should be 1 month.
          </p>
        </div>
      </div>
    );
  }
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
          <CartesianGrid horizontal={false} vertical={false} max={100} />
          <XAxis dataKey="name" />
          <YAxis /> {/* domain={[0, 100]} */}
          <Tooltip
            wrapperStyle={{ background: '#1A1A46', borderRadius: '4px', padding: '16px' }}
            content={<CustomTooltip />}
          />
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
