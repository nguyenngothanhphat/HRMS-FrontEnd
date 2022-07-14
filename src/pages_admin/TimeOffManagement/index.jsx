import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { PageContainer } from '@/layouts/layout/src';
import LocationDropdownSelector from './components/LocationDropdownSelector';
import TableContainer from './components/TableContainer';
import styles from './index.less';
import CustomBlueButton from '@/components/CustomBlueButton';
import DownloadIcon from '@/assets/timeOffManagement/ic_download.svg';

const { TabPane } = Tabs;

const TimeOffManagement = (props) => {
  const {
    dispatch,
    timeOffManagement: {
      locationsOfCountries = [],
      selectedLocations: selectedLocationsProp = [],
    } = {},
    loadingExport = false,
    loadingGetMissingLeaveDates = false,
    loadingList = false,
    loadingFetchLocation = false,
  } = props;

  const [selectedLocations, setSelectedLocation] = useState([]);
  const [payload, setPayload] = useState({});
  const [data, setData] = useState([]);

  const saveLocationToRedux = (arr) => {
    dispatch({
      type: 'timeOffManagement/save',
      payload: {
        selectedLocations: arr,
      },
    });
  };

  const onExport = () => {
    dispatch({
      type: 'timeOffManagement/exportCSVEffect',
      payload,
    });
  };

  const onGetMissingLeaveDates = () => {
    dispatch({
      type: 'timeOffManagement/getMissingLeaveDatesEffect',
      payload,
    });
  };

  useEffect(() => {
    const tempData = locationsOfCountries.map((x, i) => {
      return {
        title: x.country?.name,
        // When you select locations,
        // Antd Tree will include this key in the output values.
        // So, I'll remove this key from the output values by filter typeof x !== 'number'.
        key: i, // <-- this
        children: x.data.map((y) => {
          return {
            title: y.name,
            key: y._id,
          };
        }),
      };
    });
    setData(tempData);
  }, [JSON.stringify(locationsOfCountries)]);

  useEffect(() => {
    dispatch({
      type: 'timeOffManagement/getListEmployeesEffect',
      payload: {
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
        status: ['INACTIVE', 'ACTIVE'],
      },
    });
    dispatch({
      type: 'timeOffManagement/getTimeOffTypeListEffect',
      payload: {
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
      },
    });
    if (!locationsOfCountries.length) {
      dispatch({
        type: 'timeOffManagement/getLocationsOfCountriesEffect',
      });
    }
    return () =>
      dispatch({
        type: 'timeOffManagement/save',
        payload: {
          listTimeOff: [],
        },
      });
  }, []);

  useEffect(() => {
    setSelectedLocation(selectedLocationsProp);
  }, [JSON.stringify(selectedLocationsProp)]);

  const renderFilterBar = () => {
    return (
      <div className={styles.options}>
        <LocationDropdownSelector
          data={data}
          selectedLocations={selectedLocations}
          saveLocationToRedux={saveLocationToRedux}
        />
        <CustomBlueButton
          icon={
            <img
              src={DownloadIcon}
              style={{
                width: 26,
                height: 26,
                paddingRight: 8,
              }}
              alt=""
            />
          }
          onClick={onGetMissingLeaveDates}
          loading={loadingGetMissingLeaveDates}
          disabled={loadingList || loadingFetchLocation}
        >
          Missing Leave days
        </CustomBlueButton>
        <CustomBlueButton
          icon={
            <img
              src={DownloadIcon}
              style={{
                width: 26,
                height: 26,
                paddingRight: 8,
              }}
              alt=""
            />
          }
          loading={loadingExport}
          onClick={onExport}
          disabled={loadingList || loadingFetchLocation}
        >
          Download
        </CustomBlueButton>
      </div>
    );
  };

  return (
    <div className={styles.TimeOffManagement}>
      <PageContainer>
        <Tabs activeKey="overview" tabBarExtraContent={renderFilterBar()} destroyInactiveTabPane>
          <TabPane tab="Timeoff Management" key="overview">
            <TableContainer payload={payload} setPayload={setPayload} />
          </TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};
export default connect(
  ({ loading, user: { currentUser = {}, permissions = {} } = {}, timeOffManagement }) => ({
    currentUser,
    permissions,
    timeOffManagement,
    loadingExport: loading.effects['timeOffManagement/exportCSVEffect'],
    loadingGetMissingLeaveDates: loading.effects['timeOffManagement/getMissingLeaveDatesEffect'],
    loadingList: loading.effects['timeOffManagement/getListTimeOffEffect'],
    loadingFetchLocation: loading.effects['timeOffManagement/getLocationsOfCountriesEffect'],
  }),
)(TimeOffManagement);
