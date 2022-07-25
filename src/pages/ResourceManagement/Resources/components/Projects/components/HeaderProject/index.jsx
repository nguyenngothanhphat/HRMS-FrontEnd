import { CloseOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select, Tag } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage } from 'umi';
import { exportRawDataToCSV } from '@/utils/exportToCsv';
import CustomOrangeButton from '@/components/CustomOrangeButton';
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
    payloadProject = {},
  } = props;
  const [needResetFilterForm, setNeedResetFilterForm] = useState(false);
  const [applied, setApplied] = useState(0);
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

  const allProject = data.filter((obj) => obj.statusId === undefined || obj.statusId === 0);
  const listStatus = data.filter((obj) => obj.statusName !== 'All Projects');

  const clearTagFilter = () => {
    setApplied(0);
    setNeedResetFilterForm(true);
    onSearchDebounce();
  };
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
        <div>
          {applied > 0 && (
            <Tag
              closable
              className={styles.tagCountFilter}
              onClose={clearTagFilter}
              closeIcon={<CloseOutlined />}
            >
              {applied} filters applied
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
                onClick={exportData}
              >
                {formatMessage({ id: 'Export' })}
              </Button>
            </Col>
          </Row>
        </div>
        <FilterPopover
          setApplied={setApplied}
          placement="bottomRight"
          onSubmit={onFilter}
          needResetFilterForm={needResetFilterForm}
          setNeedResetFilterForm={setNeedResetFilterForm}
        >
          {/* <CustomOrangeButton fontSize={14} showDot={Object.keys(filter).length > 0} /> */}
          <CustomOrangeButton fontSize={14} />
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
    resourceManagement: { total = 0, filter = [], payloadProject = {} } = {},
    user: { currentUser: { employee: { _id: currentUserId = '' } = {} } = {} } = {},
  }) => ({ total, currentUserId, filter, payloadProject }),
)(HeaderProjectRM);
