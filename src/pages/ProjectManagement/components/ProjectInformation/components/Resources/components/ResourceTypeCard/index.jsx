import { Card } from 'antd';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'umi';
import ViewIcon from '@/assets/projectManagement/view.svg';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import CommonTable from '../../../../../Projects/components/CommonTable';
import AddButton from '../../../AddButton';
import CommonModal from '../../../CommonModal';
import FilterButton from '../../../FilterButton';
import FilterPopover from '../../../FilterPopover';
import SearchBar from '../../../SearchBar';
import AddResourceTypeContent from '../AddResourceTypeContent';
import FilterResourceTypeContent from './components/FilterResourceTypeContent';
import styles from './index.less';

const ResourceTypeCard = (props) => {
  const [addResourceTypeModalVisible, setAddResourceTypeModalVisible] = useState(false);
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
    const content = <FilterResourceTypeContent />;
    return (
      <div className={styles.options}>
        <AddButton text="Add Resource Type" onClick={() => setAddResourceTypeModalVisible(true)} />
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton />
        </FilterPopover>
        <SearchBar onSearch={onSearch} placeholder="Search by Resource Type" />
      </div>
    );
  };

  return (
    <div className={styles.ResourceTypeCard}>
      <Card title="Resource Type" extra={renderOption()}>
        <CommonTable columns={generateColumns()} list={[]} />
        <CommonModal
          visible={addResourceTypeModalVisible}
          onClose={() => setAddResourceTypeModalVisible(false)}
          firstText="Add Resource Type"
          content={<AddResourceTypeContent />}
          title="Add Resource Type"
        />
      </Card>
    </div>
  );
};
export default connect(() => ({}))(ResourceTypeCard);
