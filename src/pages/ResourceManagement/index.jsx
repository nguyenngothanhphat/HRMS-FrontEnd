import { Tabs } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect, history, Redirect } from 'umi';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
import LocationDropdownSelector from '@/components/LocationDropdownSelector';
import { PageContainer } from '@/layouts/layout/src';
import Overview from '@/pages/ResourceManagement/components/Overview';
import {
  setResourceSelectedDivisions,
  setResourceSelectedLocations,
} from '@/utils/resourceManagement';
import ProjectList from './components/Projects';
import ResourceList from './components/ResourceList';
import styles from './index.less';

const baseModuleUrl = '/resource-management';

const TABS = {
  OVERVIEW: 'overview',
  RESOURCES: 'resources',
  PROJECTS: 'projects',
};

const { TabPane } = Tabs;

const ResourcesManagement = (props) => {
  const {
    dispatch,
    match: { params: { tabName = '' } = {} },
    locationID = '',
    totalList = [],
    permissions = {},
    headQuarterAddress: { country: { _id: currentCountryId = '' } = {} } = {},
    divisionInfo = {},
    resourceManagement: {
      divisions: divisionList = [],
      locationsOfCountries = [],
      selectedDivisions: selectedDivisionsProp = [],
      selectedLocations: selectedLocationsProp = [],
    },
  } = props;

  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // permissions
  const viewResourceListPermission = permissions.viewResourceListTab !== -1;
  const viewUtilizationPermission = permissions.viewUtilizationTab !== -1;
  const viewResourceProjectListPermission = permissions.viewResourceProjectListTab !== -1;
  const viewModeCountry = permissions.viewResourceCountryMode !== -1;
  const viewModeDivision = permissions.viewResourceDivisionMode !== -1;

  const getWillLoadTab = () => {
    if (viewUtilizationPermission) return TABS.OVERVIEW;
    return TABS.RESOURCES;
  };

  if (!tabName) return <Redirect to={`${baseModuleUrl}/${getWillLoadTab()}`} />;

  useEffect(() => {
    setSelectedDivisions(selectedDivisionsProp);
    setSelectedLocations(selectedLocationsProp);
  }, [JSON.stringify(selectedDivisionsProp), JSON.stringify(selectedLocationsProp)]);

  const onSaveToRedux = (type, selection) => {
    dispatch({
      type: 'resourceManagement/save',
      payload: {
        [type]: selection,
      },
    });
  };

  const debouncedChangeLocation = debounce((selection) => {
    onSaveToRedux('selectedLocations', selection);
    setResourceSelectedLocations(selection);
  }, 1000);

  const debouncedChangeDivision = debounce((selection) => {
    onSaveToRedux('selectedDivisions', selection);
    setResourceSelectedDivisions(selection);
  }, 1000);

  useEffect(() => {
    if (tabName) {
      dispatch({
        type: 'resourceManagement/fetchDivisions',
        payload: {
          name: 'Engineering',
        },
      });
      dispatch({
        type: 'resourceManagement/getLocationsOfCountriesEffect',
      });
    }
  }, []);

  const onLocationChange = (selection) => {
    setSelectedLocations(selection);
    debouncedChangeLocation(selection);
  };

  const onDivisionChange = (selection) => {
    setSelectedDivisions(selection);
    debouncedChangeDivision(selection);
  };

  const renderActionButton = () => {
    // if only one selected
    const divisionOfUser = divisionInfo ? divisionInfo.name : '';
    let locationOptions = [];
    let divisionOptions = [];

    const listLocationByPermission = viewModeCountry
      ? locationsOfCountries.filter((x) => {
          return x.country._id === currentCountryId;
        })
      : locationsOfCountries;

    locationOptions = listLocationByPermission.map((x, i) => {
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

    if (viewModeDivision) {
      divisionOptions = divisionList.filter((x) => {
        if (x.name === divisionOfUser) {
          return {
            _id: x.name,
            name: x.name,
          };
        }
        return false;
      });
    } else {
      divisionOptions = divisionList.map((x) => {
        return {
          _id: x.name,
          name: x.name,
        };
      });
    }

    return (
      <div className={styles.options}>
        <LocationDropdownSelector
          saveLocationToRedux={onLocationChange}
          selectedLocations={selectedLocations}
          data={locationOptions}
        />

        <CustomDropdownSelector
          options={divisionOptions}
          onChange={onDivisionChange}
          disabled
          selectedList={selectedDivisions}
          label="Division"
        />
      </div>
    );
  };

  return (
    <div className={styles.ResourcesManagement}>
      <PageContainer>
        <Tabs
          activeKey={tabName || (viewUtilizationPermission ? TABS.OVERVIEW : TABS.RESOURCES)}
          onChange={(key) => {
            history.push(`${baseModuleUrl}/${key}`);
          }}
          tabBarExtraContent={renderActionButton(viewModeCountry, viewModeDivision)}
          destroyInactiveTabPane
        >
          {viewUtilizationPermission && (
            <TabPane tab="Overview" key={TABS.OVERVIEW}>
              <Overview />
            </TabPane>
          )}
          {viewResourceListPermission && (
            <TabPane tab="Resources" key={TABS.RESOURCES}>
              <ResourceList location={[locationID]} countData={totalList} />
            </TabPane>
          )}
          {viewResourceProjectListPermission && (
            <TabPane tab="Projects" key={TABS.PROJECTS}>
              <ProjectList />
            </TabPane>
          )}
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default connect(
  ({
    resourceManagement,
    user: {
      currentUser: {
        location: { _id: locationID = '', headQuarterAddress = {} } = {},
        company: { _id: companyID } = {},
        employee: { _id: currentUserId = '', divisionInfo = {} } = {},
      } = {},
      permissions = {},
    } = {},
    location: { companyLocationList = [] },
  }) => ({
    resourceManagement,
    permissions,
    locationID,
    companyID,
    companyLocationList,
    currentUserId,
    headQuarterAddress,
    divisionInfo,
  }),
)(ResourcesManagement);
