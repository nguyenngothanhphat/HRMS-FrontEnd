import { Card, Col, Row, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import TimeIcon from '@/assets/projectManagement/time.svg';
import CommonTable from '@/components/CommonTable';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import CustomSearchBox from '@/components/CustomSearchBox';
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
    resourceTypeName = '',
    noOfResources = 0,
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchValue, setSearchValue] = useState('');
  const [applied, setApplied] = useState(0);
  // if reselect project status or search, clear filter form
  const [needResetFilterForm, setNeedResetFilterForm] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filter, setFilter] = useState({});

  useEffect(
    () =>
      filter ? fetchData(searchValue, page, limit, filter) : fetchData(searchValue, page, limit),
    [page, limit],
  );

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l || limit);
  };

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
    if (filter) {
      fetchData(value, page, limit, filter);
    } else {
      fetchData(value, page, limit);
    }
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const setSelectedRowKeys = (ids = []) => {
    const result = data.filter((x) => ids.includes(x._id));
    setSelectedResources(result);
  };

  const onFilter = (filterPayload) => {
    fetchData(searchValue, page, limit, filterPayload);
    if (Object.keys(filterPayload).length > 0) {
      setIsFiltering(true);
      setFilter(filterPayload);
      setApplied(Object.keys(filterPayload).length);
    } else {
      setIsFiltering(false);
      setFilter(null);
      setApplied(0);
    }
  };

  const clearFilter = () => {
    onFilter({});
    setNeedResetFilterForm(true);
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        fixed: 'left',
        render: (generalInfo = {}) => {
          const { legalName = '', available = true, workEmail = '' } = generalInfo;
          const userId = workEmail.substring(0, workEmail.lastIndexOf('@'));
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
        dataIndex: 'tagDivision',
        key: 'tagDivision',
        width: '14%',
        render: (tagDivision) => {
          return (
            <div className={styles.cell}>
              <span className={styles.division}>{tagDivision}</span>
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
          if (!projects || projects.length === 0) return '';
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
                      <span className={styles.selectableTag}>
                        {p.project?.projectName || 'Null value'}
                      </span>
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
        onFilter={onFilter}
        needResetFilterForm={needResetFilterForm}
        setNeedResetFilterForm={setNeedResetFilterForm}
        setIsFiltering={setIsFiltering}
        setApplied={setApplied}
      />
    );
    return (
      <div className={styles.options}>
        {applied > 0 && (
          <Tag
            className={styles.tagCountFilter}
            closable
            closeIcon={<CloseOutlined />}
            onClose={() => {
              clearFilter();
            }}
          >
            {applied} filters applied
          </Tag>
        )}
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton showDot={isFiltering} />
        </FilterPopover>
        <CustomSearchBox onSearch={onSearch} placeholder="Search by Name" />
      </div>
    );
  };

  const renderTitle = () => {
    return (
      <span>
        {resourceTypeName} -{' '}
        <span
          style={{
            color: '#2c6df9',
          }}
        >
          {selectedResources.length}
        </span>
        /{noOfResources}
      </span>
    );
  };
  return (
    <div className={styles.ResourceTableCard}>
      <Card title={renderTitle()} extra={renderOption()}>
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
