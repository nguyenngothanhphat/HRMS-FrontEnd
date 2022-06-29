import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CustomBlueButton from '@/components/CustomBlueButton';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
import { PageContainer } from '@/layouts/layout/src';
import { OFFBOARDING_TABS } from '@/utils/offboarding';
import TeamRequest from '../ManagerView/components/TeamRequest';
import Settings from '../Settings';
import styles from './index.less';

const { TabPane } = Tabs;

const HRView = (props) => {
  const {
    dispatch,
    tabName = '',
    type = '',
    companyLocationList = [],
    offboarding: { selectedLocations: selectedLocationsProp = [] },
  } = props;

  const [selectedLocations, setSelectedLocation] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState('');

  useEffect(() => {
    setSelectedLocation(selectedLocationsProp);
  }, [JSON.stringify(selectedLocationsProp)]);

  const onLocationChange = (selection) => {
    dispatch({
      type: 'offboarding/save',
      payload: {
        selectedLocations: [...selection],
      },
    });
    setSelectedLocation([...selection]);
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
            <TeamRequest type={OFFBOARDING_TABS.COMPANY_WIDE} />
          </TabPane>
          <TabPane tab="Team Request" key={OFFBOARDING_TABS.TEAM}>
            <TeamRequest type={OFFBOARDING_TABS.TEAM} />
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
