import { Select } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React from 'react';
import { connect } from 'umi';
import ArrowDown from '@/assets/projectManagement/arrowDown.svg';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { exportRawDataToCSV } from '@/utils/exportToCsv';
import FilterContent from '../FilterContent';
import styles from './index.less';

const { Option } = Select;

const HeaderProjectRM = (props) => {
  const {
    data = [],
    setProjectStatus = () => {},
    currentUserId = '',
    dispatch,
    payloadProject = {},
    setSearchValue = () => {},
    filter = {},
    setFilter = () => {},
    projectManagement: {
      projectTypeList = [],
      projectStatusList = [],
      divisionList = [],
      employeeList = [],
      projectNameList = [],
    } = {},
  } = props;

  const onFilter = (values) => {
    setFilter(values);
  };

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const exportData = async () => {
    const fileName = 'rm-projects.csv';
    const getListExport = await dispatch({
      type: 'resourceManagement/exportReportProject',
      payload: {
        employeeId: currentUserId,
        ...payloadProject,
      },
    });
    const getDataExport = getListExport ? getListExport.data : '';
    exportRawDataToCSV(getDataExport, fileName);
  };

  const onFilterClick = () => {
    if (isEmpty(projectNameList)) {
      dispatch({
        type: 'projectManagement/fetchProjectNameListEffect',
      });
    }
    if (isEmpty(projectTypeList)) {
      dispatch({
        type: 'projectManagement/fetchProjectTypeListEffect',
      });
    }
    if (isEmpty(divisionList)) {
      dispatch({
        type: 'projectManagement/fetchDivisionListEffect',
        payload: {
          name: 'Engineering',
        },
      });
    }
    if (isEmpty(projectStatusList)) {
      dispatch({
        type: 'projectManagement/fetchProjectStatusListEffect',
      });
    }
    if (isEmpty(employeeList)) {
      dispatch({
        type: 'projectManagement/fetchEmployeeListEffect',
      });
    }
  };

  const allProject = data.filter((obj) => obj.statusId === undefined || obj.statusId === 0);
  const listStatus = data.filter((obj) => obj.statusName !== 'All Projects');
  const applied = Object.keys(filter).length;

  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
        <div className={styles.projectSelector}>
          {allProject.map((obj) => (
            <Select
              className={styles.select}
              onChange={(val) => setProjectStatus(val)}
              suffixIcon={<img src={ArrowDown} alt="" />}
              placeholder="Select"
              defaultValue={`${obj.statusName || 'All Projects'} (${obj.count || 0})`}
            >
              <Option value="All">
                {obj.statusName} ({obj.count})
              </Option>
              {listStatus.map((list) => (
                <Option value={list.statusName}>
                  {list.statusName} ({list.count})
                </Option>
              ))}
            </Select>
          ))}
        </div>
      </div>

      <div className={styles.Header__right}>
        <FilterCountTag count={applied} onClearFilter={() => setFilter({})} />
        <CustomOrangeButton icon={DownloadIcon} onClick={exportData}>
          Export
        </CustomOrangeButton>

        <FilterPopover
          placement="bottomRight"
          content={<FilterContent onSubmit={onFilter} filter={filter} />}
        >
          <CustomOrangeButton onClick={onFilterClick} />
        </FilterPopover>
        <CustomSearchBox placeholder="Search by Project ID, customer name" onSearch={onSearch} />
      </div>
    </div>
  );
};

export default connect(
  ({
    resourceManagement: { total = 0, payloadProject = {} } = {},
    user: { currentUser: { employee: { _id: currentUserId = '' } = {} } = {} } = {},
    projectManagement,
  }) => ({ total, currentUserId, payloadProject, projectManagement }),
)(HeaderProjectRM);
