import React, { useEffect, useState } from 'react';
import { Row, Select, Col, Menu, Statistic, Input, Drawer } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import { connect } from 'dva';
import { ReactComponent as FilterIcon } from '@/assets/svg/filter.svg';
import { ReactComponent as FilterFillIcon } from '@/assets/svg/filter_fill.svg';
import windowSize from 'react-window-size';
import { formatNumber } from '../../utils/utils.js';
import PaymentQueueTable from './PaymentQueueTable';
import PaymentHistory from './PaymentHistory';
import FilterForm from './FilterForm';

import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const financeRole = 'FINANCE';

const Payment = props => {
  const {
    windowWidth,
    reimbursement: { teamReport = [], paymentHistory = [] } = {},
    user: {
      employeeList = [],
      financeLocations = [],
      currentUser,
      currentUser: { location: { currency: { _id: userCurrency = '' } = {} } = {} } = {},
    } = {},
    listLocation = {},
    loading,
    currency: { list: listCurrency = [] } = {},
    dispatch,
  } = props;
  const onLocationChange = () => {};
  const getCurrentYear = () => {
    return moment().year();
  };
  const [menuFilter, setMenuFilter] = useState({
    currentMenuFilter: currentUser.appRole === financeRole ? 'queue' : 'history',
    year: getCurrentYear(),
  });
  const [yearFilter, setYearFilter] = useState(getCurrentYear());
  const [isFiltering, setIsFiltering] = useState(false);
  const onMenuSelect = key => {
    if (key !== menuFilter.currentMenuFilter) {
      setMenuFilter({
        ...menuFilter,
        currentMenuFilter: key,
      });
    }
  };
  const onYearFilterChange = value => {
    setYearFilter(value);
    const payload = { year: value };
    if (menuFilter.currentMenuFilter === 'queue') {
      dispatch({ type: 'reimbursement/filterRecentReport', ...payload });
    }
    if (menuFilter.currentMenuFilter === 'history') {
      dispatch({
        type: 'reimbursement/fetchPaymentHistory',
        payload: {
          year: value,
          location: currentUser.location ? currentUser.location._id : '',
        },
      });
    }
  };
  const [isShowFilterForm, setIsShowFilterForm] = useState(false);
  const [selectedListID, setSelectedListID] = useState([]);
  const [selectedPaymentHistoryId, setSelectedPaymentHistoryId] = useState([]);
  const onSearch = value => {
    dispatch({
      type: 'reimbursement/fetchPaymentHistory',
      payload: {
        q: value,
        location: currentUser.location ? currentUser.location._id : '',
      },
    });
  };
  const getPrefix = () => {
    const currentCurrency = listCurrency.find(item => item._id === userCurrency) || {};
    return currentCurrency.symbol || '';
  };
  const getTotalAmountCompleteReport = () => {
    let result = 0;
    teamReport.forEach(rp => {
      result += rp.amount;
    });
    return result;
  };
  const getTotalAmountPaid = () => {
    let result = 0;
    paymentHistory.forEach(paidRp => {
      result += paidRp.amount;
    });
    return result;
  };
  const getSummaryMenu = () => {
    if (currentUser.appRole === financeRole) {
      return [
        {
          key: 'queue',
          amount: getTotalAmountCompleteReport(),
          count: teamReport.length,
        },
        {
          key: 'history',
          amount: getTotalAmountPaid(),
          count: paymentHistory.length,
        },
      ];
    }
    return [
      {
        key: 'history',
        amount: getTotalAmountPaid(),
        count: paymentHistory.length,
      },
    ];
  };
  const actionBtn = [
    {
      key: 'filterbtn',
      icon: (
        <>
          {isFiltering ? (
            <FilterFillIcon
              className={styles.iconPrimary}
              onClick={() => setIsShowFilterForm(true)}
            />
          ) : (
            <FilterIcon
              onClick={() => setIsShowFilterForm(true)}
              style={{ fill: 'black', width: 18 }}
            />
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    dispatch({ type: 'locations/fetch' });
    if (currentUser.appRole === financeRole) {
      dispatch({
        type: 'reimbursement/fetchTeamReportComplete',
        payload: {
          location: currentUser.location ? currentUser.location._id : '',
          year: getCurrentYear(),
        },
      });
    }
    dispatch({
      type: 'reimbursement/fetchPaymentHistory',
      payload: {
        location: currentUser.location ? currentUser.location._id : '',
        year: getCurrentYear(),
      },
    });
    dispatch({
      type: 'user/getEmployeeList',
      payload: {
        location: currentUser.location ? currentUser.location._id : '',
      },
    });
  }, []);
  return (
    <div className={styles.listPaymentWrapper}>
      <Row type="flex" justify="space-between">
        <div className={styles.title}>
          <span>{formatMessage({ id: 'payment.title' })}</span>
        </div>
        <Row className={styles.headerSearch}>
          <div className={styles.headerSearchWrapContent}>
            <Select
              className={styles.selectLocation}
              defaultValue={currentUser.location.country.name}
              onChange={value => onLocationChange(value)}
              disabled={currentUser.appRole !== 'FINANCE'}
            >
              {listLocation.map(item => {
                let result = null;
                if (financeLocations.includes(item.id)) {
                  result = (
                    <Option id={item.id} value={item.id}>
                      {item.country.name}
                    </Option>
                  );
                }
                return result;
              })}
            </Select>
            <Select
              className={styles.selectFY}
              defaultValue={`FY ${getCurrentYear()}`}
              style={{ width: '100px' }}
              onChange={value => onYearFilterChange(value)}
            >
              <Option value="2018">FY 2018</Option>
              <Option value="2019">FY 2019</Option>
              <Option value="2020">FY 2020</Option>
            </Select>
          </div>
        </Row>
      </Row>
      <Row type="flex" justify="space-between" className={styles.menuArea}>
        <Col span={12}>
          <Menu
            selectedKeys={menuFilter.currentMenuFilter}
            mode="horizontal"
            style={{ backgroundColor: '#eff2fa' }}
            onSelect={({ key }) => onMenuSelect(key)}
          >
            {getSummaryMenu().map(item => {
              return (
                <Menu.Item key={item.key}>
                  <div className={styles.summary}>
                    <Statistic
                      value={formatNumber(item.amount).value}
                      prefix={getPrefix()}
                      suffix={formatNumber(item.amount).suffix}
                      precision={formatNumber(item.amount).precision}
                    />
                    <div className={styles.summaryCount}>
                      {`${formatMessage({
                        id: `payment.${item.key}`,
                      })} (${item.count})`}
                    </div>
                  </div>
                </Menu.Item>
              );
            })}
          </Menu>
        </Col>
        {menuFilter.currentMenuFilter === 'history' && (
          <Col className={styles.actionBtn}>
            <Search
              placeholder={formatMessage({ id: 'payment.searchPH' })}
              onSearch={value => onSearch(value)}
              style={{ width: '310px', height: '44px', marginRight: '30px' }}
            />
            {actionBtn.map(item => {
              return (
                <span key={item.key} className={styles.btn}>
                  {item.icon}
                </span>
              );
            })}
          </Col>
        )}
      </Row>
      {menuFilter.currentMenuFilter === 'queue' && (
        <PaymentQueueTable
          loading={loading}
          dispatch={dispatch}
          data={teamReport}
          selectedListID={selectedListID}
          setSelectedListID={setSelectedListID}
          currentUser={currentUser}
        />
      )}
      {menuFilter.currentMenuFilter === 'history' && (
        <React.Fragment>
          <PaymentHistory
            data={paymentHistory}
            loading={loading}
            selectedPaymentHistoryId={selectedPaymentHistoryId}
            setSelectedPaymentHistoryId={setSelectedPaymentHistoryId}
            userCurrency={userCurrency}
          />

          <Drawer
            placement="right"
            title={
              <span className={styles.filterDrawerTitle}>
                {formatMessage({ id: 'common.filter' })}
              </span>
            }
            closable
            onClose={() => setIsShowFilterForm(false)}
            visible={isShowFilterForm}
            className={styles.filterDrawer}
            width={windowWidth <= 450 ? 'auto' : 450}
            headerStyle={{ padding: '41px 24px 0 49px', border: 'none' }}
            bodyStyle={{ borderRadius: 4, padding: '26px 50px 28px 50px' }}
          >
            <FilterForm
              yearFilter={yearFilter}
              dispatch={dispatch}
              closeFilterForm={() => setIsShowFilterForm(false)}
              setIsFiltering={setIsFiltering}
              employeeList={employeeList}
              location={currentUser.location ? currentUser.location._id : ''}
              loading={loading}
            />
          </Drawer>
        </React.Fragment>
      )}
    </div>
  );
};

export default connect(
  ({ user, loading, reimbursement, currency, locations: { list: listLocation = [] } }) => ({
    loading: loading.models.reimbursement,
    reimbursement,
    currency,
    listLocation,
    user,
  })
)(windowSize(Payment));
