// import moment from 'moment';
import { Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import OptionsHeader from './components/Header';
import TableTimeOff from './components/TableTimeOff';
import styles from './index.less';

const TableContainer = (props) => {
  const {
    dispatch,
    timeOffManagement: { listTimeOff = [], selectedLocations = [], listTotal = 0 },
    loadingList = false,
    payload = {},
    setPayload = () => {},
    loadingFetchLocation = false,
  } = props;

  const [fromDate, setFromDate] = useState(moment().startOf('month'));
  const [toDate, setToDate] = useState(moment().endOf('month'));
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const didMount = useRef(true);

  const getDataTable = (values = {}) => {
    const { status = [], types = [], user = null } = values;

    const from = fromDate ? moment(fromDate).format('YYYY-MM-DD') : null;
    const to = toDate ? moment(toDate).format('YYYY-MM-DD') : null;

    dispatch({
      type: 'timeOffManagement/getListTimeOffEffect',
      payload: {
        types: (types || []).reduce((a, b) => [...a, ...b], []),
        tenantId: getCurrentTenant(),
        selectedLocations,
        status,
        employee: user,
        from,
        to,
        page,
        limit,
      },
    });
  };

  useEffect(() => {
    if (selectedLocations.length || !didMount.current) {
      getDataTable(payload);
    }
    didMount.current = false;
  }, [JSON.stringify(payload), page, limit, JSON.stringify(selectedLocations)]);

  return (
    <div className={styles.TimeOffTableContainer}>
      <Spin spinning={loadingFetchLocation}>
        <div className={styles.optionsHeader}>
          <OptionsHeader
            disabled={loadingList}
            setPayload={setPayload}
            setFromDate={setFromDate}
            setToDate={setToDate}
            fromDate={fromDate}
            toDate={toDate}
          />
        </div>
        <div className={styles.contentContainer}>
          <TableTimeOff
            listTimeOff={listTimeOff}
            loading={loadingList}
            setPage={setPage}
            setLimit={setLimit}
            listTotal={listTotal}
            page={page}
            limit={limit}
          />
        </div>
      </Spin>
    </div>
  );
};

export default connect(
  ({
    loading,
    timeOffManagement,
    user: { companiesOfUser = [] } = {},
    location: { companyLocationList = [] } = {},
  }) => ({
    timeOffManagement,
    companiesOfUser,
    companyLocationList,
    loadingList: loading.effects['timeOffManagement/getListTimeOffEffect'],
    loadingFetchLocation: loading.effects['timeOffManagement/getLocationsOfCountriesEffect'],
  }),
)(TableContainer);
