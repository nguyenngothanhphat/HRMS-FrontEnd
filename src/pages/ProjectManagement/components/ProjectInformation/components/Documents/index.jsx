import { Card } from 'antd';
import { debounce } from 'lodash';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { DATE_FORMAT_LIST } from '@/utils/projectManagement';
import AddButton from '../AddButton';
import FilterButton from '../FilterButton';
import FilterPopover from '../FilterPopover';
import SearchBar from '../SearchBar';
import CommonModal from '../CommonModal';
import AddContent from './components/AddContent';
import FilterContent from './components/FilterContent';
import CommonTable from '../CommonTable';
import ViewIcon from '@/assets/projectManagement/view.svg';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import styles from './index.less';

const Documents = (props) => {
  const {
    dispatch,
    projectDetails: { projectId = '', documentList = [] } = {},
    loadingAddDocument = false,
    loadingFetchDocument = false,
  } = props;
  const [addDocumentModalVisible, setAddDocumentModalVisible] = useState(false);

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const fetchDocumentList = (searchKey) => {
    dispatch({
      type: 'projectDetails/fetchDocumentListEffect',
      payload: {
        projectId,
        searchKey,
      },
    });
  };

  const removeDocument = async (id) => {
    const res = await dispatch({
      type: 'projectDetails/removeDocumentEffect',
      payload: {
        projectId,
        id,
      },
    });
    if (res.statusCode === 200) {
      fetchDocumentList();
    }
  };

  useEffect(() => {
    fetchDocumentList();
  }, []);

  const onSearchDebounce = debounce((value) => {
    fetchDocumentList(value);
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
          return <span>{documentName || '-'}</span>;
        },
      },
      {
        title: 'Document Type',
        dataIndex: 'documentTypeName ',
        key: 'documentTypeName ',
        render: (documentTypeName) => {
          return <span>{documentTypeName || '-'}</span>;
        },
      },
      {
        title: 'Uploaded By',
        dataIndex: 'uploadedBy',
        key: 'uploadedBy',
        render: (_, row) => {
          const { owner = '', ownerName = '' } = row;
          return (
            <span className={styles.clickableTag} onClick={() => viewProfile(owner)}>
              {ownerName || '-'}
            </span>
          );
        },
      },
      {
        title: 'Uploaded On',
        dataIndex: 'timeTaken',
        key: 'timeTaken',
        render: (timeTaken) => {
          return (
            <span>{timeTaken ? moment(timeTaken).locale('en').format(DATE_FORMAT_LIST) : '-'}</span>
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (_, row) => {
          return (
            <div className={styles.action}>
              <img src={ViewIcon} alt="" />
              <img src={DeleteIcon} alt="" onClick={() => removeDocument(row?.id)} />
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
        <div className={styles.tableContainer}>
          <CommonTable
            columns={generateColumns()}
            list={documentList}
            loading={loadingFetchDocument}
          />
        </div>
      </Card>
      <CommonModal
        visible={addDocumentModalVisible}
        onClose={() => setAddDocumentModalVisible(false)}
        firstText="Add Document"
        content={
          <AddContent
            visible={addDocumentModalVisible}
            onClose={() => setAddDocumentModalVisible(false)}
            refreshData={fetchDocumentList}
          />
        }
        title="Add Document"
        loading={loadingAddDocument}
      />
    </div>
  );
};
export default connect(({ projectDetails, loading }) => ({
  projectDetails,
  loadingAddDocument:
    loading.effects['projectDetails/addDocumentEffect'] || loading.effects['upload/uploadFile'],
  loadingFetchDocument: loading.effects['projectDetails/fetchDocumentListEffect'],
}))(Documents);
