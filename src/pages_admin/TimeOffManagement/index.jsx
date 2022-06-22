import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
import TableContainer from './components/TableContainer';
import styles from './index.less';

const { TabPane } = Tabs;

const TimeOffManagement = (props) => {
  const { dispatch, companyLocationList = [] } = props;
  const [selectedLocations, setSelectedLocation] = useState([]);

  const onLocationChange = (selection) => {
    dispatch({
      type: 'timeOffManagement/save',
      payload: {
        selectedLocations: [...selection],
      },
    });
    setSelectedLocation([...selection]);
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
