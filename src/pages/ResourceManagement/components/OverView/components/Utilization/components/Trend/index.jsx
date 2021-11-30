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
// import CustomDot from '@/assets/resourceManagement/customDot.svg';
import EmptyImage from '@/assets/resourceManagement/emptyImage.png';
import styles from './index.less';

const Trend = (props) => {
  const { dispatch, startDate = '', endDate = '', invalidDates = false } = props;

  // redux
  const {
    resourceManagement: { resourceUtilizationChartData: { type = '', result = [] } = {} } = {},
  } = props;

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
    if (type === 'M') {
      return moment(x.date).format('DD');
    }
    if (type === 'W') {
      return `Week ${x.week}`;
    }
    if (type === 'Y') {
      return x.month;
    }
    return '';
  };

  const renderPercent = (x) => {
    if (x === 0 || Number.isInteger(x)) return x;
    return parseFloat(x).toFixed(2);
  };

  const formatData = () => {
    return result.map((x) => {
      const { summary = [] } = x;
      const billable = summary.find((y) => y.status === 'Billable');
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
    const tempData = formatData(result);
    setData(tempData);
  }, [JSON.stringify(result)]);

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
          value:
            total && total.count !== 0 ? `${renderPercent((billable?.count / total?.count) *100)}%` : '-',
        },
        {
          name: 'Total Resources',
          value: total?.count || 0,
        },
        {
          name: 'Total Billable resources',
          value: `${billable?.count} (${renderPercent(billable?.percent)}%)`,
        },
        {
          name: 'Total Buffer resources',
          value: `${buffer?.count} (${renderPercent(buffer?.percent)}%)`,
        },
        {
          name: 'Total Benched resources',
          value: `${bench?.count} (${renderPercent(bench?.percent)}%)`,
        },
      ];
      return (
        <div className={styles.customTooltip}>
          {items.map((x) => (
            <div
              className={styles.tooltipItem}
              style={x.name === 'Current Utilization' ? { marginBottom: '10px' } : {}}
            >
              <span className={styles.left}>{x.name}</span>
              <span className={styles.right}>{x.value}</span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const CustomizeDot = ({ cx, cy }) => {
    return (
      <svg
        cx={cx - 6}
        cy={cy - 6}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="6" cy="6" r="5" fill="white" stroke="#2C6DF9" strokeWidth="2" />
      </svg>
    );
  };

  if (invalidDates) {
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
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          width={500}
          height={300}
          data={data}
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
