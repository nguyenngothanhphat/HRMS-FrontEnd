import { Card, Col, Row } from 'antd';
import { debounce } from 'lodash';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import TimeIcon from '@/assets/projectManagement/time.svg';
import CommonTable from '@/pages/ProjectManagement/components/ProjectInformation/components/CommonTable';
import FilterButton from '@/pages/ProjectManagement/components/ProjectInformation/components/FilterButton';
import FilterPopover from '@/pages/ProjectManagement/components/ProjectInformation/components/FilterPopover';
import SearchBar from '@/pages/ProjectManagement/components/ProjectInformation/components/SearchBar';
import FilterResourcesListContent from './components/FilterResourcesListContent';
import styles from './index.less';

const ResourceTableCard = (props) => {
  const {
    data = [],
    fetchData = () => {},
    loading = false,
    total = 0,
    selectedResources = [],
    setSelectedResources = () => {},
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchData(searchValue, page, limit);
  }, [page, limit]);

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l || limit);
  };

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
    fetchData(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const setSelectedRowKeys = (ids = []) => {
    const result = data.filter((x) => ids.includes(x._id));
    setSelectedResources(result);
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        fixed: 'left',
        render: (generalInfo = {}) => {
          const { legalName = '', userId = '', available = true } = generalInfo;
          return (
            <div className={styles.cell}>
              <div className={styles.resourceName}>
                {available ? (
                  <span className={styles.availableNowTag}>Available Now</span>
                ) : (
                  <span className={styles.availableSoonTag}>Available Soon</span>
                )}
                <span className={styles.selectableTag}>
                  {legalName} {`${userId ? `(${userId})` : ''}`}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: 'Division',
        dataIndex: 'departmentInfo',
        key: 'departmentInfo',
        render: (departmentInfo) => {
          return (
            <div className={styles.cell}>
              <span className={styles.division}>{departmentInfo?.name}</span>
            </div>
          );
        },
      },
      {
        title: 'Designation',
        dataIndex: 'titleInfo',
        key: 'titleInfo',
        render: (titleInfo) => {
          return (
            <div className={styles.cell}>
              <span>{titleInfo.name}</span>
            </div>
          );
        },
      },
      {
        title: 'Experience',
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        render: (generalInfo = {}) => {
          return (
            <div className={styles.cell}>
              <span>{generalInfo?.totalExp}</span>
            </div>
          );
        },
      },
      {
        title: 'Projects',
        dataIndex: 'projects',
        key: 'projects',
        width: '20%',
        render: (projects = []) => {
          return (
            <Row className={styles.projectContainer} align="middle">
              {projects.map((p, i) => {
                return (
                  <>
                    <Col
                      span={24}
                      className={`${styles.project} ${projects.length > 1 ? styles.hasBorder : ''}`}
                      style={
                        i + 1 < projects.length
                          ? {
                              borderBottom: '1px solid #d6dce0',
                            }
                          : {}
                      }
                    >
                      <span className={styles.selectableTag}>{p.projectName || 'Null value'}</span>
                    </Col>
                  </>
                );
              })}
            </Row>
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        fixed: 'right',
        width: '8%',
        render: () => {
          return <img src={TimeIcon} alt="" />;
        },
      },
    ];

    return columns;
  };

  const renderOption = () => {
    const content = (
      <FilterResourcesListContent
        onFilter={(values) => fetchData(searchValue, page, limit, values)}
      />
    );
    return (
      <div className={styles.options}>
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton />
        </FilterPopover>
        <SearchBar onSearch={onSearch} placeholder="Search by Name" />
      </div>
    );
  };

  return (
    <div className={styles.ResourceTableCard}>
      <Card extra={renderOption()}>
        <CommonTable
          columns={generateColumns()}
          list={data}
          selectable
          rowKey="_id"
          isBackendPaging
          page={page}
          limit={limit}
          onChangePage={onChangePage}
          loading={loading}
          total={total}
          selectedRowKeys={selectedResources.map((x) => x._id)}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </Card>
    </div>
  );
};
export default connect(() => ({}))(ResourceTableCard);
