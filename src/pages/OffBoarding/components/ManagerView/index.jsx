import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CustomBlueButton from '@/components/CustomBlueButton';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentLocation } from '@/utils/authority';
import RequestTable from '../RequestTable';
import styles from './index.less';
import LocationDropdownSelector from '@/components/LocationDropdownSelector';

const TABS = {
  MY: 'my',
  TEAM: 'team',
};

const { TabPane } = Tabs;

const ManagerView = (props) => {
  const {
    dispatch,
    tabName = '',
    offboarding: { selectedLocations: selectedLocationsProp = [], locationsOfCountries = [] },
  } = props;

  const [selectedLocations, setSelectedLocation] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setSelectedLocation(selectedLocationsProp);
  }, [JSON.stringify(selectedLocationsProp)]);

  useEffect(() => {
    dispatch({
      type: 'offboarding/getLocationsOfCountriesEffect',
    });
  }, []);

  useEffect(() => {
    const tempData = locationsOfCountries.map((x, i) => {
      return {
        title: x.country?.name,
        key: i,
        children: x.data.map((y) => {
          return {
            title: y.name,
            key: y._id,
          };
        }),
      };
    });

    setSelectedLocation([getCurrentLocation()]);
    setData(tempData);
    dispatch({
      type: 'offboarding/save',
      payload: {
        selectedLocations: [getCurrentLocation()],
      },
    });
    return () => {
      setData([]);
      setSelectedLocation([]);
      dispatch({
        type: 'offboarding/save',
        locationsOfCountries: [],
      });
    };
  }, [JSON.stringify(locationsOfCountries)]);

  const onLocationChange = (selection) => {
    dispatch({
      type: 'offboarding/save',
      payload: {
        selectedLocations: selection,
      },
    });
  };

  const options = () => {
    return (
      <div className={styles.options}>
        <LocationDropdownSelector
          saveLocationToRedux={onLocationChange}
          selectedLocations={selectedLocations}
          data={data}
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
