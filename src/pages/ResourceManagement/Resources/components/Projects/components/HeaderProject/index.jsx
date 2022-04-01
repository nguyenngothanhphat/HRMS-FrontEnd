import React, { useEffect, useState } from 'react';
import { Select, Input, Button, Col, Row } from 'antd';
import { connect, formatMessage } from 'umi';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import FilterButton from '@/components/FilterButton';
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
    currentUserId = '',
    total,
    dispatch,
    filter = [],
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

  const exportToExcel = async () => {
    const fileName = 'rm-projects.csv';
    const getListExport = await dispatch({
      type: 'resourceManagement/exportReportProject',
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
        <FilterPopover
          placement="bottomRight"
          onSubmit={onFilter}
          needResetFilterForm={needResetFilterForm}
          setNeedResetFilterForm={setNeedResetFilterForm}
        >
          <FilterButton fontSize={14} showDot={Object.keys(filter).length > 0} />
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

export default connect(
  ({
    resourceManagement: { total = 0, filter = [] } = {},
    user: { currentUser: { employee: { _id: currentUserId = '' } = {} } = {} } = {},
  }) => ({ total, currentUserId, filter }),
)(HeaderProjectRM);
