import { Tabs } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect, history, Redirect } from 'umi';
import CustomBlueButton from '@/components/CustomBlueButton';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
import LocationDropdownSelector from '@/components/LocationDropdownSelector';
import { OFFBOARDING_TABS } from '@/constants/offboarding';
import ROLES from '@/constants/roles';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentLocation } from '@/utils/authority';
import { getOffboardingEmpMode, setOffboardingEmpMode } from '@/utils/offboarding';
import { goToTop } from '@/utils/utils';
import MyRequest from './components/MyRequest';
import RequestTable from './components/RequestTable';
import Settings from './components/Settings';
import styles from './index.less';

const { TabPane } = Tabs;

const Offboarding = (props) => {
  const {
    dispatch,
    match: { params: { tabName = '', type = '' } = {} },
    offboarding: {
      selectedLocations: selectedLocationsProp = [],
      locationsOfCountries = [],
      myRequest = {},
    },
  } = props;

  const listRole = localStorage.getItem('antd-pro-authority');
  const roles = JSON.parse(listRole);
  const lowerCaseRoles = roles.map((x) => x.toLowerCase());

  const showCompanyWideRequest =
    lowerCaseRoles.includes(ROLES.HR) || lowerCaseRoles.includes(ROLES.HR_MANAGER);
  const showTeamRequest = lowerCaseRoles.includes(ROLES.MANAGER);
  const showSettings = showCompanyWideRequest;
  const showMyRequest = getOffboardingEmpMode() || (!showCompanyWideRequest && !showTeamRequest);

  if (!tabName) {
    if (showMyRequest) return <Redirect to="/offboarding/my-request" />;
    if (showCompanyWideRequest) return <Redirect to="/offboarding/company-wide" />;
    if (showTeamRequest) return <Redirect to="/offboarding/team" />;
  }

  // STATES
  const [selectedLocations, setSelectedLocation] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState('');
  const [data, setData] = useState([]);

  const getMyRequest = () => {
    dispatch({
      type: 'offboarding/getMyRequestEffect',
      payload: {},
    });
  };

  useEffect(() => {
    if (!isEmpty(myRequest)) {
      setOffboardingEmpMode(true);
    }
  }, [JSON.stringify(myRequest)]);

  useEffect(() => {
    setSelectedLocation(selectedLocationsProp);
  }, [JSON.stringify(selectedLocationsProp)]);

  useEffect(() => {
    if (tabName) {
      getMyRequest();
      dispatch({
        type: 'offboarding/getLocationsOfCountriesEffect',
      });
    }
    return () => {
      setData([]);
      setSelectedLocation([]);
      dispatch({
        type: 'offboarding/save',
        locationsOfCountries: [],
      });
    };
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

  useEffect(() => {
    goToTop();
  }, []);

  const options = () => {
    if ([OFFBOARDING_TABS.COMPANY_WIDE, OFFBOARDING_TABS.TEAM].includes(tabName)) {
      return (
        <div className={styles.options}>
          <LocationDropdownSelector
            saveLocationToRedux={onLocationChange}
            selectedLocations={selectedLocations}
            data={data}
          />
          {tabName === OFFBOARDING_TABS.COMPANY_WIDE && (
            <CustomDropdownSelector
              options={[]}
              onChange={onDivisionChange}
              disabled={[].length < 2}
              label="Division"
              selectedList={selectedDivisions}
            />
          )}
          <CustomBlueButton>Generate Report</CustomBlueButton>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.Offboarding}>
      <PageContainer>
        <Tabs
          activeKey={tabName}
          tabBarExtraContent={options()}
          onChange={(key) => {
            history.push(`/offboarding/${key}`);
          }}
          destroyInactiveTabPane
        >
          {showMyRequest && (
            <TabPane tab="Terminate work relationship" key={OFFBOARDING_TABS.MY}>
              <MyRequest getMyRequest={getMyRequest} />
            </TabPane>
          )}
          {showCompanyWideRequest && (
            <TabPane tab="Company Wide" key={OFFBOARDING_TABS.COMPANY_WIDE}>
              <RequestTable type={OFFBOARDING_TABS.COMPANY_WIDE} />
            </TabPane>
          )}
          {showTeamRequest && (
            <TabPane tab="Team Request" key={OFFBOARDING_TABS.TEAM}>
              <RequestTable type={OFFBOARDING_TABS.TEAM} />
            </TabPane>
          )}
          {showSettings && (
            <TabPane tab="Settings" key={OFFBOARDING_TABS.SETTINGS}>
              <Settings type={type} />
            </TabPane>
          )}
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default connect(({ location: { companyLocationList = [] }, offboarding }) => ({
  companyLocationList,
  offboarding,
}))(Offboarding);
