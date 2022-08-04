import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { exportRawDataToCSV } from '@/utils/exportToCsv';
import { formatData } from '@/utils/resourceManagement';
import FilterContent from './components/FilterContent';
import ResourceStatus from './components/ResourceStatus';
import TableResources from './components/TableResources';
import styles from './index.less';

const ResourceList = (props) => {
  const {
    dispatch,
    availableStatus,
    loading,
    loadingSearch,
    permissions,
    currentUserId = '',
    employeeId = '',
    resourceManagement: {
      resourceList = [],
      total = 0,
      selectedLocations = [],
      selectedDivisions = [],
      currentPayload = {},
      divisions = [],
      titleList = [],
      listSkill = [],
    } = {},
  } = props;

  const modifyResourcePermission = permissions.modifyResource !== -1;
  const adminMode = permissions.viewResourceAdminMode !== -1;
  const countryMode = permissions.viewResourceCountryMode !== -1;

  const [pageSelected, setPageSelected] = useState(1);
  const [availableStatusState, setAvailableStatusState] = useState('ALL');
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState({});
  const [resourceListState, setResourceListState] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [filter, setFilter] = useState({});

  const updateData = (listOffAllTicket) => {
    const array = formatData(listOffAllTicket);
    setResourceListState(array);
  };

  const onFilterChange = (filters) => {
    setFilter({ ...filters });
  };

  const convertFilter = () => {
    const newFilterObj = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filter)) {
      if (value) {
        if (Array.isArray(value) && value.length > 0) {
          newFilterObj[key] = value;
        } else if (!Array.isArray(value)) {
          newFilterObj[key] = value;
        }
      }
    }
    return newFilterObj;
  };

  const fetchResourceList = async () => {
    const filterTemp = convertFilter();
    const payload = {
      page: pageSelected,
      limit: size,
      availableStatus: availableStatusState || availableStatus,
      ...sort,
      ...filterTemp,
      location: selectedLocations,
      division: selectedDivisions,
      employeeId,
      adminMode,
      countryMode,
    };
    if (searchValue) {
      payload.name = searchValue;
      payload.page = 1;
    }
    dispatch({
      type: 'resourceManagement/getResources',
      payload,
    });
  };

  const fetchListSkill = async () => {
    dispatch({
      type: 'resourceManagement/fetchListSkill',
    });
  };

  const getPageAndSize = (page, pageSize) => {
    setPageSelected(page);
    setSize(pageSize);
  };

  const changeAvailableStatus = (status) => {
    setAvailableStatusState(status);
  };

  const refreshData = () => {
    fetchResourceList();
  };

  const fetchDivisions = async () => {
    dispatch({
      type: 'resourceManagement/fetchDivisions',
    });
  };

  const fetchStatusList = async () => {
    dispatch({
      type: 'resourceManagement/fetchResourceStatus',
      payload: {
        name: 'Engineering',
      },
    });
  };

  const fetchTitleList = async () => {
    dispatch({
      type: 'resourceManagement/fetchTitleList',
    });
  };

  const onSort = (sortProp) => {
    setSort(sortProp);
  };

  const exportData = async () => {
    const date = moment().locale('en').format('MM-DD-YYYY');
    const fileName = `resource - ${date}.csv`;
    const getListExport = await dispatch({
      type: 'resourceManagement/exportResourceManagement',
      payload: {
        employeeId: currentUserId,
        ...currentPayload,
      },
    });
    const getDataExport = getListExport ? getListExport.data : '';
    exportRawDataToCSV(getDataExport, fileName);
  };

  useEffect(() => {
    fetchStatusList();
  }, []);

  useEffect(() => {
    fetchResourceList();
  }, [
    JSON.stringify(selectedDivisions),
    JSON.stringify(selectedLocations),
    JSON.stringify(filter),
    size,
    searchValue,
    pageSelected,
    availableStatusState,
  ]);

  useEffect(() => {
    updateData(resourceList);
  }, [JSON.stringify(resourceList)]);

  const onFilterClick = () => {
    if (isEmpty(divisions)) {
      fetchDivisions();
    }
    if (isEmpty(titleList)) {
      fetchTitleList();
    }
    if (isEmpty(listSkill)) {
      fetchListSkill();
    }
  };

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (e) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const applied = Object.keys(filter).length;

  return (
    <div className={styles.ResourceList}>
      <div className={styles.tabTickets}>
        <ResourceStatus
          currentStatus={availableStatusState}
          changeAvailableStatus={changeAvailableStatus}
        />
        <div className={styles.rightHeaderTable}>
          <FilterCountTag count={applied} onClearFilter={() => setFilter({})} />
          <CustomOrangeButton icon={DownloadIcon} onClick={exportData}>
            Export
          </CustomOrangeButton>

          <FilterPopover
            content={<FilterContent filter={filter} onFilterChange={onFilterChange} />}
          >
            <CustomOrangeButton onClick={onFilterClick}>Filter</CustomOrangeButton>
          </FilterPopover>

          <CustomSearchBox placeholder="Search by Name, user ID" onSearch={onSearch} />
        </div>
      </div>
      <TableResources
        refreshData={refreshData}
        data={resourceListState}
        loading={loading || loadingSearch}
        pageSelected={pageSelected}
        total={total}
        size={size}
        onSort={onSort}
        getPageAndSize={getPageAndSize}
        allowModify={modifyResourcePermission}
      />
    </div>
  );
};

export default connect(
  ({
    resourceManagement,
    user: {
      currentUser: { employee: { _id: employeeId = '' } = {} } = {},
      permissions = {},
      currentUserRoles = [],
    } = {},
    loading,
    location: { companyLocationList = [] },
  }) => ({
    loading: loading.effects['resourceManagement/getResources'],
    resourceManagement,
    companyLocationList,
    permissions,

    employeeId,
    currentUserRoles,
  }),
)(ResourceList);
