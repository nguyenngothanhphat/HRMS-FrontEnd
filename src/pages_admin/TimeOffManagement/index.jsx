import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import TableContainer from './components/TableContainer';
import styles from './index.less';

const { TabPane } = Tabs;

const TimeOffManagement = (props) => {
  const { dispatch, companyLocationList = [] } = props;
  const [selectedLocations, setSelectedLocation] = useState([]);

  const getCountryId = (locationObj) => {
    const type = typeof locationObj?.headQuarterAddress?.country;
    switch (type) {
      case 'string':
        return locationObj?.headQuarterAddress?.country;
      case 'object':
        return locationObj?.headQuarterAddress?.country?._id;
      default:
        return '';
    }
  };

  const fetchTimeoffType = () => {
    if (selectedLocations.length > 0) {
      const selectedLocationObj = companyLocationList.find((x) => x._id === selectedLocations[0]);
      const country = getCountryId(selectedLocationObj);
      dispatch({
        type: 'timeOffManagement/fetchTimeOffTypesByCountry',
        payload: {
          country,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        },
      });
    } else {
      dispatch({
        type: 'timeOffManagement/save',
        payload: {
          timeOffTypesByCountry: [],
        },
      });
    }
  };

  useEffect(() => {
    fetchTimeoffType();
  }, [JSON.stringify(selectedLocations)]);

  const onLocationChange = (selection = []) => {
    let temp = [];
    if (selection.length > 0) {
      temp = [selection[selection.length - 1]];
    }
    dispatch({
      type: 'timeOffManagement/save',
      payload: {
        selectedLocations: [...temp],
      },
    });
    setSelectedLocation([...temp]);
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: 'timeOffManagement/save',
        payload: {
          selectedLocations: [],
        },
      });
    };
  }, []);

  const renderLocationOptions = () => {
    return companyLocationList.map((x) => {
      return {
        _id: x._id,
        name: x.name,
      };
    });
  };

  const renderFilterBar = () => {
    return (
      <div className={styles.options}>
        <CustomDropdownSelector
          options={renderLocationOptions()}
          onChange={onLocationChange}
          disabled={renderLocationOptions().length < 2}
          label="Location"
          selectedList={selectedLocations}
          multiple={false}
        />
      </div>
    );
  };

  return (
    <div className={styles.TimeOffManagement}>
      <PageContainer>
        <Tabs activeKey="overview" tabBarExtraContent={renderFilterBar()} destroyInactiveTabPane>
          <TabPane tab="Timeoff Management" key="overview">
            <TableContainer />
          </TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};
export default connect(
  ({
    user: { currentUser = {}, permissions = [] } = {},
    location: { companyLocationList = [] },
    timeOffManagement,
  }) => ({
    currentUser,
    permissions,
    companyLocationList,
    timeOffManagement,
  }),
)(TimeOffManagement);
