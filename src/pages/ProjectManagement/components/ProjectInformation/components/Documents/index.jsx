import { Card } from 'antd';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'umi';
import AddButton from '../AddButton';
import FilterButton from '../FilterButton';
import FilterPopover from '../FilterPopover';
import SearchBar from '../SearchBar';
import CommonModal from '../CommonModal';
import AddContent from './components/AddContent';
import FilterContent from './components/FilterContent';
import CommonTable from '../../../Projects/components/CommonTable';
import ViewIcon from '@/assets/projectManagement/view.svg';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import styles from './index.less';

const Documents = (props) => {
  const [addDocumentModalVisible, setAddDocumentModalVisible] = useState(false);

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
    const content = <FilterContent />;
    return (
      <div className={styles.options}>
        <AddButton text="Add new Document" onClick={() => setAddDocumentModalVisible(true)} />
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton />
        </FilterPopover>
        <SearchBar onSearch={onSearch} placeholder="Search by Document Type" />
      </div>
    );
  };

  return (
    <div className={styles.Documents}>
      <Card title="Documents" extra={renderOption()}>
        <CommonTable columns={generateColumns()} list={[]} />
      </Card>
      <CommonModal
        visible={addDocumentModalVisible}
        onClose={() => setAddDocumentModalVisible(false)}
        firstText="Add Document"
        content={<AddContent />}
        title="Add Document"
      />
    </div>
  );
};
export default connect(() => ({}))(Documents);
