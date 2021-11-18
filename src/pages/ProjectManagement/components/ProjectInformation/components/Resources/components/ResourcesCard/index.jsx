import { Card } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import EditIcon from '@/assets/projectManagement/edit2.svg';
import CommonTable from '../../../CommonTable';
import FilterButton from '../../../FilterButton';
import FilterPopover from '../../../FilterPopover';
import OrangeAddButton from '../../../OrangeAddButton';
import SearchBar from '../../../SearchBar';
import AddResourcesModal from '../AddResourcesModal';
import FilterResourcesContent from './components/FilterResourcesContent';
import styles from './index.less';

const ResourcesCard = (props) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [addResourceModalVisible, setAddResourceModalVisible] = useState('');

  const {
    dispatch,
    projectDetails: {
      projectDetail: { projectId = '' } = {},
      projectResourceList = [],
      projectResourceListTotal: total = '',
    } = {},
    loadingFetchList = false,
  } = props;

  const fetchResourceOfProject = (name, p, l) => {
    dispatch({
      type: 'projectDetails/fetchResourceOfProjectEffect',
      payload: {
        project: [projectId],
        name,
        page: p,
        limit: l,
      },
    });
  };

  useEffect(() => {
    fetchResourceOfProject(searchValue, page, limit);
  }, [page, limit]);

  // useEffect(() => {
  //   fetchResourceOfProject();
  // }, []);

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l || limit);
  };

  const onSearchDebounce = debounce((value) => {
    fetchResourceOfProject(value);
    setSearchValue(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        fixed: 'left',
        render: (generalInfo = {}) => {
          const { legalName = '' } = generalInfo;
          return <span>{legalName}</span>;
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
        title: 'Billing Status',
        dataIndex: 'billingStatus',
        key: 'billingStatus',
        render: (billingStatus) => {
          return <span>{billingStatus || '-'}</span>;
        },
      },
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (startDate) => {
          return <span>{startDate || '-'}</span>;
        },
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (endDate) => {
          return <span>{endDate || '-'}</span>;
        },
      },
      {
        title: 'Revised End Date',
        dataIndex: 'revisedEndDate',
        key: 'revisedEndDate',
        render: (revisedEndDate) => {
          return <span>{revisedEndDate || '-'}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: () => {
          return (
            <div className={styles.actions}>
              <img src={EditIcon} alt="" />
              <img src={DeleteIcon} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const renderOption = () => {
    const content = <FilterResourcesContent />;
    return (
      <div className={styles.options}>
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton />
        </FilterPopover>
        <OrangeAddButton text="Add Resources" onClick={() => setAddResourceModalVisible(true)} />
        <SearchBar onSearch={onSearch} placeholder="Search by Resource Type" />
      </div>
    );
  };

  return (
    <div className={styles.ResourcesCard}>
      <Card title="Resource" extra={renderOption()}>
        <div className={styles.tableContainer}>
          <CommonTable
            columns={generateColumns()}
            list={projectResourceList}
            page={page}
            limit={limit}
            onChangePage={onChangePage}
            loading={loadingFetchList}
            total={total}
            isBackendPaging
          />
        </div>
      </Card>
      <AddResourcesModal
        visible={addResourceModalVisible}
        onClose={() => setAddResourceModalVisible(false)}
      />
    </div>
  );
};
export default connect(({ projectDetails, loading }) => ({
  projectDetails,
  loadingFetchList: loading.effects['projectDetails/fetchResourceOfProjectListEffect'],
}))(ResourcesCard);
