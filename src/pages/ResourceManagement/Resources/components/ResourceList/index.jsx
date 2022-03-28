import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
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
  } = props;

  const modifyResourcePermission = permissions.modifyResource !== -1;
  const modeViewAdmin = permissions.viewModeAdmin !== -1;
  const [pageSelected, setPageSelected] = useState(1);
  const [availableStatusState, setAvailableStatusState] = useState('ALL');
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState({});
  const [resourceListState, setResourceListState] = useState([]);

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

    dispatch({
      type: 'resourceManagement/getResources',
      payload: {
        // status: 'New',
        page: pageSelected,
        limit: size,
        availableStatus: availableStatusState || availableStatus,
        ...sort,
        ...filterTemp,
        location: selectedLocations,
        division: selectedDivisions,
      },
    });
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

  const searchTable = (searchKey) => {
    const value = searchKey.searchKey || '';
    dispatch({
      type: 'resourceManagement/getResources',
      payload: {
        page: pageSelected,
        availableStatus: availableStatusState || availableStatus,
        q: value,
      },
    }).then(() => {
      const array = formatData(resourceList, projectList);

      setResourceListState(array);
      setPageSelected(1);
    });
  };

  const fetchDivisions = async () => {
    dispatch({
      type: 'resourceManagement/fetchDivisions',
      payload: {
        name: 'Engineering',
      },
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
        limit: total,
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
  ]);

  useEffect(() => {
    updateData(resourceList);
  }, [JSON.stringify(resourceList)]);

  return (
    <div className={styles.containerTickets}>
      <div className={styles.tabTickets}>
        {modeViewAdmin && (
          <ResourceStatus
            currentStatus={availableStatusState}
            changeAvailableStatus={changeAvailableStatus}
          />
        )}
        <div className={styles.rightHeaderTable}>
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
          <SearchTable onFilterChange={onFilterChange} filter={filter} searchTable={searchTable} />
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
    } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
      permissions = {},
    } = {},
    loading,
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    loading: loading.effects['resourceManagement/getResources'],
    resourceList,
    total,
    locationID,
    companyID,
    projectList,
    listLocationsByCompany,
    permissions,
    selectedDivisions,
    selectedLocations,
  }),
)(ResourceList);
