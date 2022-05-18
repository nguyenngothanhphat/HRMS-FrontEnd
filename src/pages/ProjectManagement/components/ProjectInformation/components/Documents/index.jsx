import { Card, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { DATE_FORMAT_LIST } from '@/utils/projectManagement';
import AddButton from '../AddButton';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import CustomSearchBox from '@/components/CustomSearchBox';
import CommonModal from '@/components/CommonModal';
import AddContent from './components/AddContent';
import FilterContent from './components/FilterContent';
import CommonTable from '../CommonTable';
import ViewIcon from '@/assets/projectManagement/view.svg';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import styles from './index.less';

const Documents = (props) => {
  const {
    dispatch,
    projectDetails: { projectId = '', documentList = [] } = {},
    loadingAddDocument = false,
    loadingFetchDocument = false,
  } = props;

  // permissions
  const { allowModify = false } = props;

  const [applied, setApplied] = useState(0);
  const [addDocumentModalVisible, setAddDocumentModalVisible] = useState(false);
  const [viewFileModalVisible, setViewFileModalVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  // if reselect project status or search, clear filter form
  const [needResetFilterForm, setNeedResetFilterForm] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const fetchDocumentList = (searchKey, filterPayload) => {
    dispatch({
      type: 'projectDetails/fetchDocumentListEffect',
      payload: {
        projectId,
        searchKey,
        ...filterPayload,
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
    setNeedResetFilterForm(true);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const onFilter = (filterPayload) => {
    fetchDocumentList('', filterPayload);
    if (Object.keys(filterPayload).length > 0) {
      setIsFiltering(true);
      setApplied(Object.keys(filterPayload).length);
    } else {
      setIsFiltering(false);
      setApplied(0);
    }
  }

  const clearFilter = () => {
    onFilter({});
    setNeedResetFilterForm(true);
  }

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
        dataIndex: 'documentTypeName',
        key: 'documentTypeName',
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
        align: 'center',
        render: (_, row) => {
          return (
            <div className={styles.action}>
              <img
                src={ViewIcon}
                alt=""
                onClick={() => {
                  setFileUrl(row.attachmentInfo?.url);
                  setViewFileModalVisible(true);
                }}
              />
              {allowModify && (
                <img src={DeleteIcon} alt="" onClick={() => removeDocument(row?.id)} />
              )}
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const renderOption = () => {
    const content = <FilterContent
      onFilter={onFilter}
      needResetFilterForm={needResetFilterForm}
      setNeedResetFilterForm={setNeedResetFilterForm}
      setIsFiltering={setIsFiltering}
      setApplied={setApplied}
    />;
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
            {applied} applied
          </Tag>
        )}
        {allowModify && (
          <AddButton text="Add new Document" onClick={() => setAddDocumentModalVisible(true)} />
        )}
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton showDot={isFiltering} />
        </FilterPopover>
        <CustomSearchBox onSearch={onSearch} placeholder="Search by Document Type" />
      </div>
    );
  };

  return (
    <div className={styles.Documents}>
      <Card title="Documents" extra={renderOption()}>
        <div className={styles.tableContainer}>
          <CommonTable
            columns={generateColumns()}
            list={documentList.reverse()}
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
      <ViewDocumentModal
        visible={viewFileModalVisible}
        onClose={() => setViewFileModalVisible(false)}
        url={fileUrl}
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
