import { Card } from 'antd';
import { debounce } from 'lodash';
import React from 'react';
import { connect } from 'umi';
import ViewIcon from '@/assets/projectManagement/view.svg';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import CommonTable from '../../../CommonTable';
import FilterButton from '../../../FilterButton';
import FilterPopover from '../../../FilterPopover';
import SearchBar from '../../../SearchBar';

import FilterResourcesContent from './components/FilterResourcesContent';
import styles from './index.less';

const ResourcesCard = () => {
  const onSearchDebounce = debounce((value) => {
    console.log('value', value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Document Name',
        dataIndex: 'documentName',
        key: 'documentName',
        render: (documentName) => {
          return <span className={styles.clickableTag}>{documentName || '-'}</span>;
        },
      },
      {
        title: 'Document Type',
        dataIndex: 'documentType',
        key: 'documentType',
        render: (documentType) => {
          return <span className={styles.clickableTag}>{documentType || '-'}</span>;
        },
      },
      {
        title: 'Uploaded By',
        dataIndex: 'uploadedBy',
        key: 'uploadedBy',
        render: (uploadedBy) => {
          return <span className={styles.clickableTag}>{uploadedBy || '-'}</span>;
        },
      },
      {
        title: 'Uploaded On',
        dataIndex: 'uploadedOn',
        key: 'uploadedOn',
        render: (uploadedOn) => {
          return <span>{uploadedOn || '-'}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: () => {
          return (
            <div className={styles.action}>
              <img src={ViewIcon} alt="" />
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
        <SearchBar onSearch={onSearch} placeholder="Search by Resource Type" />
      </div>
    );
  };

  return (
    <div className={styles.ResourcesCard}>
      <Card title="Resource" extra={renderOption()}>
        <div className={styles.tableContainer}>
          <CommonTable columns={generateColumns()} list={[]} />
        </div>
      </Card>
    </div>
  );
};
export default connect(() => ({}))(ResourcesCard);
