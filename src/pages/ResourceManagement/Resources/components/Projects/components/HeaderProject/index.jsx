import React, { useEffect, useState } from 'react';
import { Select, Input } from 'antd';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import FilterIcon from '@/assets/projectManagement/filter.svg';
import ArrowDown from '@/assets/projectManagement/arrowDown.svg';
import FilterPopover from '../FilterPopover';
import styles from './index.less';

const { Option } = Select;

const HeaderProjectRM = (props) => {
  const {
    data = [],
    projectStatus = 'All',
    setProjectStatus = () => {},
    fetchProjectList = () => {},
  } = props;
  const [needResetFilterForm, setNeedResetFilterForm] = useState(false);

  const onFilter = (payload) => {
    fetchProjectList(payload);
  };

  const onSearchDebounce = debounce((value) => {
    fetchProjectList({ searchKey: value });
    setNeedResetFilterForm(true);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  useEffect(() => {
    setNeedResetFilterForm(true);
  }, [projectStatus]);

  const searchPrefix = () => {
    return (
      <SearchOutlined
        style={{
          fontSize: 16,
          color: 'black',
          marginRight: '10px',
        }}
      />
    );
  };

  const exportCustomers = async () => {
    const { dispatch } = props;

    const getListExport = await dispatch({
      type: 'resourceManagement/exportReportProject',
    });
    const downloadLink = document.createElement('a');
    const universalBOM = '\uFEFF';
    downloadLink.href = `data:text/csv; charset=utf-8,${encodeURIComponent(
      universalBOM + getListExport,
    )}`;
    downloadLink.download = 'rm-projects.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const allProject = data.filter((obj) => obj.statusId === undefined);
  const listStatus = data.filter((obj) => obj.statusName !== 'All Projects');
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
                <Option value={list.statusId}>
                  {list.statusName} ({list.count})
                </Option>
              ))}
            </Select>
          ))}
        </div>
      </div>

      <div className={styles.Header__right}>
        <p
          style={{
            marginBottom: '0',
            marginRight: '25px',
            color: '#ffa100',
            fontWeight: '700',
            cursor: 'pointer',
          }}
          onClick={exportCustomers}
        >
          <DownloadOutlined /> Export
        </p>
        <FilterPopover
          placement="bottomRight"
          onSubmit={onFilter}
          needResetFilterForm={needResetFilterForm}
          setNeedResetFilterForm={setNeedResetFilterForm}
        >
          <div className={styles.filterIcon}>
            <img src={FilterIcon} alt="" />
            <span>Filter</span>
          </div>
        </FilterPopover>
        <div className={styles.searchBar}>
          <Input
            className={styles.searchInput}
            placeholder="Search by Project ID, customer name"
            prefix={searchPrefix()}
            onChange={onSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(({ resourceManagement }) => ({ resourceManagement }))(HeaderProjectRM);
