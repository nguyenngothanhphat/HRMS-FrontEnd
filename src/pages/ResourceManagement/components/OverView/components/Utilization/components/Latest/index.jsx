import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Gauge } from '@ant-design/charts';
import { Col, Row, Tooltip as TooltipAntd } from 'antd';
import styles from './index.less';
import TopArrowIcon from '@/assets/resourceManagement/topArrow.svg';
import HelpIcon from '@/assets/resourceManagement/helpIcon.svg';

const UtilizationGauge = ({ percent = 0 }) => {
  const config = {
    percent,
    innerRadius: 0.8,
    range: {
      ticks: [0, 1],
      color: ['l(0) 0:#F4664A 0.5:#FAAD14 1:#30BF78'],
    },
    axis: {
      label: {
        formatter: (text) => {
          return text * 100;
        },
      },
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#2C6DF9',
        },
      },
      pin: {
        style: {
          stroke: '#2C6DF9',
        },
      },
    },
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Gauge width={310} height={310} {...config} />;
};

const Latest = (props) => {
  const {
    dispatch,
    resourceManagement: {
      resourceUtilizationList = {},
      selectedLocations = [],
      selectedDivisions = [],
    } = {},
    employee = {},
    permissions = {}
  } = props;
  const { summaryToday = [], summaryYesterday = [] } = resourceUtilizationList;
  const [calculatedData, setCalculatedData] = useState({
    utilization: 0,
    increasePercent: 0,
  });

  const adminMode = permissions.viewResourceAdminMode !== -1;
  const countryMode = permissions.viewResourceCountryMode !== -1;
  const employeeId = employee ? employee._id : ''

  const fetchData = () => {
    dispatch({
      type: 'resourceManagement/fetchResourceUtilizationList',
      payload: {
        location: selectedLocations,
        division: selectedDivisions,
        employeeId,
        adminMode,
        countryMode
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(selectedLocations), JSON.stringify(selectedDivisions)]);

  const renderPercent = (x) => {
    if (x === 0 || Number.isInteger(x)) return x;
    return parseFloat(x).toFixed(2);
  };

  const calculateUtilization = () => {
    const billableToday = summaryToday.find((x) => x.status === 'Billable') || {};
    const totalToday = summaryToday.find((x) => x.status === 'Total') || {};

    const billableYesterday = summaryYesterday.find((x) => x.status === 'Billable') || {};
    const totalYesterday = summaryYesterday.find((x) => x.status === 'Total') || {};

    // other
    if (totalYesterday && totalYesterday?.count > 0 && totalToday && totalToday?.count > 0) {
      const utilizationYesterdayTemp = billableYesterday.count / totalYesterday.count;
      const utilizationTodayTemp = billableToday.count / totalToday.count;
      let result = 0;
      if (utilizationYesterdayTemp > 0 && utilizationTodayTemp > 0) {
        result =
          ((utilizationTodayTemp - utilizationYesterdayTemp) / utilizationYesterdayTemp) * 100;
      }
      setCalculatedData({
        utilization: utilizationTodayTemp * 100,
        increasePercent: result,
      });
    }
  };

  useEffect(() => {
    calculateUtilization();
  }, [JSON.stringify(resourceUtilizationList)]);

  const generateItems = () => {
    const billableToday = summaryToday.find((x) => x.status === 'Billable') || {};
    const benchToday = summaryToday.find((x) => x.status === 'Bench') || {};
    // const unpaidToday = summaryToday.find((x) => x.status === 'Unpaid') || {};
    const bufferToday = summaryToday.find((x) => x.status === 'Buffer') || {};
    const totalToday = summaryToday.find((x) => x.status === 'Total') || {};

    return [
      {
        name: 'Total Resources',
        value: totalToday.count,
      },
      {
        name: 'Total Billable resources',
        value: `${billableToday?.count} (${renderPercent(billableToday?.percent)}%)`,
      },
      // {
      //   name: 'Total Unpaid resources',
      //   value: `${unpaidToday?.count} (${Math.round(unpaidToday?.percent)}%)`,
      // },
      {
        name: 'Total Buffer resources',
        value: `${bufferToday?.count} (${renderPercent(bufferToday?.percent)}%)`,
      },
      {
        name: 'Total Benched resources',
        value: `${benchToday?.count} (${renderPercent(benchToday?.percent)}%)`,
      },
    ];
  };

  return (
    <div className={styles.Latest}>
      <Row className={styles.container} gutter={[50, 0]} justify="center">
        <Col span={12}>
          <div className={styles.left}>
            <div className={styles.chart}>
              <UtilizationGauge percent={calculatedData.utilization / 100} />
            </div>
            <div className={styles.numbers}>
              <div className={styles.numbers__above}>
                <span className={styles.bigNumber}>
                  {renderPercent(calculatedData.utilization)}%
                </span>
                <span className={styles.smallNumber}>
                  <img src={TopArrowIcon} alt="" />
                  <span>{renderPercent(calculatedData.increasePercent)}%</span>
                </span>
              </div>
              <div className={styles.numbers__below}>
                <div>
                  Current Utilization{' '}
                  <TooltipAntd
                    title={
                      <div style={{ fontSize: '12px' }}>
                        Current utilization is calculated as a percentage of Total Billable
                        resources / Total Resources
                        <br />
                        <br />
                        Compared to the previous week, the Resource utilization has increased by{' '}
                        {calculatedData.increasePercent}%
                      </div>
                    }
                    placement="rightTop"
                    color="#1A1A46"
                    overlayInnerStyle={{
                      padding: '7px 15px',
                    }}
                    overlayStyle={{
                      borderRadius: '5px',
                    }}
                  >
                    <img src={HelpIcon} alt="" />
                  </TooltipAntd>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.right}>
            <div className={styles.information}>
              {generateItems().map((x) => (
                <div className={styles.item}>
                  <span className={styles.label}>{x.name}</span>
                  <span className={styles.value}>{x.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ resourceManagement, user: { currentUser: { employee = {} } = {}, permissions = {} } }) => ({
  resourceManagement,
  employee,
  permissions,
}))(Latest);
