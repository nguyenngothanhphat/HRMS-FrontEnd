import { CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage } from 'umi';
import { formatData } from '@/utils/resourceManagement';
import SearchTable from '../SearchTable';
import TableResources from '../TableResources';
import ResourceStatus from './components/ResourceStatus';
import styles from './index.less';

const ResourceList = (props) => {
  const {
    dispatch,
    availableStatus,
    resourceList,
    projectList = [],
    selectedLocations = [],
    selectedDivisions = [],
    loading,
    loadingSearch,
    total = 0,
    permissions,
    currentUserId = '',
    employeeId = '',
    // currentUserRoles = [],
    currentPayload = {},
  } = props;

  const viewModeAdmin = permissions.viewResourceAdminMode !== -1;
  const modifyResourcePermission = permissions.modifyResource !== -1;
  const adminMode = permissions.viewResourceAdminMode !== -1;
  const countryMode = permissions.viewResourceCountryMode !== -1;

  const [pageSelected, setPageSelected] = useState(1);
  const [availableStatusState, setAvailableStatusState] = useState('ALL');
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState({});
  const [resourceListState, setResourceListState] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [applied, setapplied] = useState(0);
  const [form, setForm] = useState(null);
  const [filter, setFilter] = useState({
    name: undefined,
    tagDivision: [],
    title: [],
    skill: [],
    project: [],
    expYearBegin: undefined,
    expYearEnd: undefined,
  });

  const updateData = (listOffAllTicket) => {
    const array = formatData(listOffAllTicket, projectList);
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
      // status: 'New',
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
    if (searchKey) {
      payload.name = searchKey;
      payload.page = 1;
    }
    dispatch({
      type: 'resourceManagement/getResources',
      payload,
    });
    setIsSearching(false);
  };

  const fetchProjectList = async () => {
    dispatch({
      type: 'resourceManagement/getProjectList',
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

  const searchTable = (searchKeyProp) => {
    const value = searchKeyProp.searchKey || '';
    setIsSearching(true);
    setTimeout(() => {
      setSearchKey(value);
    }, 100);
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
      // payload: {
      //     name: 'Engineering'
      // }
    });
  };

  const onSort = (sortProp) => {
    setSort(sortProp);
  };

  const exportToExcel = async () => {
    const fileName = 'resource.csv';
    const getListExport = await dispatch({
      type: 'resourceManagement/exportResourceManagement',
      payload: {
        employeeId: currentUserId,
        ...currentPayload,
      },
    });
    const getDataExport = getListExport ? getListExport.data : '';
    const downloadLink = document.createElement('a');
    const universalBOM = '\uFEFF';
    downloadLink.href = `data:text/csv; charset=utf-8,${encodeURIComponent(
      universalBOM + getDataExport,
    )}`;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    fetchProjectList();
    fetchStatusList();
    fetchDivisions();
    fetchTitleList();
  }, []);

  useEffect(() => {
    fetchResourceList();
  }, [
    JSON.stringify(selectedDivisions),
    JSON.stringify(selectedLocations),
    JSON.stringify(filter),
    size,
    pageSelected,
    availableStatusState,
  ]);

  useEffect(() => {
    if (isSearching) {
      if (pageSelected !== 1) {
        setPageSelected(1);
      } else {
        fetchResourceList();
      }
    }
  }, [searchKey]);

  useEffect(() => {
    updateData(resourceList);
  }, [JSON.stringify(resourceList)]);
  // const clearFilter = () => {};
  const clearTagFilter = () => {
    setFilter({});
    setapplied(0);
    // clearFilter();
    form?.resetFields();
  };
  return (
    <div className={styles.containerTickets}>
      <div className={styles.tabTickets}>
        <span>
          <ResourceStatus
            currentStatus={availableStatusState}
            changeAvailableStatus={changeAvailableStatus}
          />
        </span>
        <div className={styles.rightHeaderTable}>
          <div>
            {applied > 0 && (
              <Tag
                className={styles.tagCountFilter}
                closable
                onClose={clearTagFilter}
                closeIcon={<CloseOutlined />}
              >
                {applied} applied
              </Tag>
            )}
          </div>
          <div className={styles.download}>
            <Row gutter={[24, 0]}>
              <Col>
                <Button
                  icon={<DownloadOutlined />}
                  className={styles.generate}
                  type="text"
                  onClick={exportToExcel}
                >
                  {formatMessage({ id: 'Export' })}
                </Button>
              </Col>
            </Row>
          </div>
          <SearchTable
            setapplied={setapplied}
            onFilterChange={onFilterChange}
            filter={filter}
            searchTable={searchTable}
            setForm={setForm}
          />
        </div>
      </div>
      <TableResources
        refreshData={refreshData}
        data={resourceListState}
        projectList={projectList}
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
    resourceManagement: {
      resourceList = [],
      projectList = [],
      total = 0,
      selectedLocations = [],
      selectedDivisions = [],
      currentPayload = {},
    } = {},
    user: {
      currentUser: { employee: { _id: employeeId = '' } = {} } = {},
      permissions = {},
      currentUserRoles = [],
    } = {},
    loading,
    location: { companyLocationList = [] },
  }) => ({
    loading: loading.effects['resourceManagement/getResources'],
    resourceList,
    total,
    projectList,
    companyLocationList,
    permissions,
    selectedDivisions,
    selectedLocations,
    employeeId,
    currentUserRoles,
    currentPayload,
  }),
)(ResourceList);
