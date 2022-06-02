import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import TableContainer from './components/TableContainer';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import styles from './index.less';
import CheckboxMenu from '@/components/CheckboxMenu';

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

  const getSelectedLocationName = () => {
    if (selectedLocations.length === 1) {
      return companyLocationList.find((x) => x._id === selectedLocations[0])?.name || '';
    }
    if (selectedLocations.length > 0 && selectedLocations.length < companyLocationList.length) {
      return `${selectedLocations.length} locations selected`;
    }
    if (selectedLocations.length === companyLocationList.length) {
      return 'All';
    }
    return 'None';
  };

  const renderLocationOptions = () => {
    return companyLocationList.map((x) => {
      return {
        _id: x._id,
        name: x.name,
      };
    });
  };

  const renderFilterBar = () => {
    // if only one selected
    const selectedLocationName = getSelectedLocationName();

    return (
      <div className={styles.options}>
        <div className={styles.item}>
          <span className={styles.label}>Location</span>

          <CheckboxMenu
            options={renderLocationOptions()}
            onChange={onLocationChange}
            list={companyLocationList}
            default={selectedLocations}
            disabled={renderLocationOptions().length < 2}
          >
            <div
              className={`${
                renderLocationOptions().length < 2 ? styles.noDropdown : styles.dropdown
              }`}
              onClick={(e) => e.preventDefault()}
            >
              <span>{selectedLocationName}</span>
              {renderLocationOptions().length < 2 ? null : <img src={SmallDownArrow} alt="" />}
            </div>
          </CheckboxMenu>
        </div>
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
