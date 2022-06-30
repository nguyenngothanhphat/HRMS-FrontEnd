import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CustomBlueButton from '@/components/CustomBlueButton';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentLocation } from '@/utils/authority';
import RequestTable from '../RequestTable';
import styles from './index.less';

const TABS = {
  MY: 'my',
  TEAM: 'team',
};

const { TabPane } = Tabs;

const ManagerView = (props) => {
  const {
    dispatch,
    tabName = '',
    companyLocationList = [],
    offboarding: { selectedLocations: selectedLocationsProp = [] },
  } = props;

  const [selectedLocations, setSelectedLocation] = useState([]);

  useEffect(() => {
    let location = [getCurrentLocation()];
    if (selectedLocationsProp.length) {
      location = selectedLocationsProp;
    }
    setSelectedLocation(location);
  }, [JSON.stringify(selectedLocationsProp)]);

  useEffect(() => {
    dispatch({
      type: 'offboarding/save',
      payload: {
        viewingRequest: {},
      },
    });
  }, []);

  const onLocationChange = (selection) => {
    dispatch({
      type: 'offboarding/save',
      payload: {
        selectedLocations: [...selection],
      },
    });
    setSelectedLocation([...selection]);
  };

  const renderLocationOptions = () => {
    return companyLocationList.map((x) => {
      return {
        _id: x._id,
        name: x.name,
      };
    });
  };

  const options = () => {
    return (
      <div className={styles.options}>
        <CustomDropdownSelector
          options={renderLocationOptions()}
          onChange={onLocationChange}
          disabled={renderLocationOptions().length < 2}
          label="Location"
          selectedList={selectedLocations}
        />
        <CustomBlueButton>Generate Report</CustomBlueButton>
      </div>
    );
  };

  return (
    <div className={styles.ManagerView}>
      <PageContainer>
        <Tabs
          activeKey={tabName || TABS.TEAM}
          tabBarExtraContent={options()}
          onChange={(key) => {
            history.push(`/offboarding/${key}`);
          }}
          destroyInactiveTabPane
        >
          <TabPane tab="Team Request" key={TABS.TEAM}>
            <RequestTable />
          </TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default connect(({ location: { companyLocationList = [] }, offboarding }) => ({
  companyLocationList,
  offboarding,
}))(ManagerView);
