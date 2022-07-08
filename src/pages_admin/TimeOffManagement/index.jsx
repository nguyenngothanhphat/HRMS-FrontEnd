import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { PageContainer } from '@/layouts/layout/src';
import LocationDropdownSelector from './components/LocationDropdownSelector';
import TableContainer from './components/TableContainer';
import styles from './index.less';

const { TabPane } = Tabs;

const TimeOffManagement = (props) => {
  const {
    dispatch,
    timeOffManagement: {
      locationsOfCountries = [],
      selectedLocations: selectedLocationsProp = [],
    } = {},
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

  useEffect(() => {
    const tempData = locationsOfCountries.map((x, i) => {
      return {
        title: x.country?.name,
        key: i, // do not change this key
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
        // location: selectedLocations,
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
  ({ user: { currentUser = {}, permissions = {} } = {}, timeOffManagement }) => ({
    currentUser,
    permissions,
    timeOffManagement,
  }),
)(TimeOffManagement);
