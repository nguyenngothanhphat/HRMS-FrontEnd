import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CustomBlueButton from '@/components/CustomBlueButton';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
import { PageContainer } from '@/layouts/layout/src';
import { OFFBOARDING_TABS } from '@/utils/offboarding';
import RequestTable from '../RequestTable';
import Settings from '../Settings';
import styles from './index.less';
import { getCurrentLocation } from '@/utils/authority';
import LocationDropdownSelector from '@/components/LocationDropdownSelector';

const { TabPane } = Tabs;

const HRView = (props) => {
  const {
    dispatch,
    tabName = '',
    type = '',
    offboarding: { selectedLocations: selectedLocationsProp = [], locationsOfCountries = [] },
  } = props;

  const [selectedLocations, setSelectedLocation] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState('');
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

  const onDivisionChange = (selection) => {
    dispatch({
      type: 'offboarding/save',
      payload: {
        selectedDivisions: [...selection],
      },
    });
    setSelectedDivisions([...selection]);
  };

  const options = () => {
    return (
      <div className={styles.options}>
        <LocationDropdownSelector
          saveLocationToRedux={onLocationChange}
          selectedLocations={selectedLocations}
          data={data}
        />
        <CustomDropdownSelector
          options={[]}
          onChange={onDivisionChange}
          disabled={[].length < 2}
          label="Division"
          selectedList={selectedDivisions}
        />
        <CustomBlueButton>Generate Report</CustomBlueButton>
      </div>
    );
  };

  return (
    <div className={styles.ManagerView}>
      <PageContainer>
        <Tabs
          activeKey={tabName || OFFBOARDING_TABS.COMPANY_WIDE}
          tabBarExtraContent={options()}
          onChange={(key) => {
            history.push(`/offboarding/${key}`);
          }}
          destroyInactiveTabPane
        >
          <TabPane tab="Company Wide" key={OFFBOARDING_TABS.COMPANY_WIDE}>
            <RequestTable type={OFFBOARDING_TABS.COMPANY_WIDE} />
          </TabPane>
          <TabPane tab="Team Request" key={OFFBOARDING_TABS.TEAM}>
            <RequestTable type={OFFBOARDING_TABS.TEAM} />
          </TabPane>
          <TabPane tab="Settings" key="settings">
            <Settings type={type} />
          </TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default connect(({ location: { companyLocationList = [] }, offboarding }) => ({
  companyLocationList,
  offboarding,
}))(HRView);
