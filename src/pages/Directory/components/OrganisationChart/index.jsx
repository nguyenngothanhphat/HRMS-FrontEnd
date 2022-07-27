import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DetailEmployeeChart from './components/DetailEmployeeChart';
import OrganizationChart from './components/OrganizationChart';
import styles from './index.less';

const OrganisationChart = (props) => {
  const { dispatch, employee: { _id = '' } = {} } = props;

  const [selectedId, setSelectedId] = useState('');
  const [chartDetails, setChartDetails] = useState({});

  const fetchDataOrgChart = (id) => {
    dispatch({
      type: 'employee/fetchDataOrgChart',
      payload: { employee: id },
    }).then((response) => {
      const { statusCode, data: dataOrgChart = {} } = response;
      if (statusCode === 200) {
        setChartDetails(dataOrgChart?.user);
      }
    });
  };

  useEffect(() => {
    if (selectedId) {
      fetchDataOrgChart(selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    setSelectedId(_id);
  }, [_id]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'employee/save',
        payload: { dataOrgChart: {} },
      });
    };
  }, []);

  const onClose = () => {
    setChartDetails({});
  };

  return (
    <div className={styles.container}>
      <div className={styles.orgChart}>
        <OrganizationChart selectedId={selectedId} setSelectedId={setSelectedId} />
        <div className={styles.orgChart__detailEmplChart}>
          <DetailEmployeeChart
            chartDetails={chartDetails}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({
    employee: { dataOrgChart = {}, listEmployeeAll = [] } = {},
    loading,
    location: { companyLocationList = [] } = {},
    user: {
      currentUser: { employee: { _id: myEmployeeId = '' } = {}, employee = {} } = {},
      companiesOfUser = [],
    } = {},
  }) => ({
    dataOrgChart,
    loading: loading.effects['employee/fetchDataOrgChart'],
    loadingFetchListAll: loading.effects['employee/fetchAllListUser'],
    myEmployeeId,
    companiesOfUser,
    companyLocationList,
    listEmployeeAll,
    employee,
  }),
)(OrganisationChart);
