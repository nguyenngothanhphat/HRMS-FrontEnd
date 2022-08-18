import { Card } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import ViewIcon from '@/assets/projectManagement/view.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import CustomAddButton from '@/components/CustomAddButton';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { DATE_FORMAT_LIST } from '@/constants/projectManagement';
import AddContent from './components/AddContent';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const Documents = (props) => {
  const {
    dispatch,
    projectDetails: { projectId = '', documentList = [], documentTypeList = [] } = {},
    loadingAddDocument = false,
    loadingFetchDocument = false,
  } = props;

  // permissions
  const { allowModify = false } = props;

  const [addDocumentModalVisible, setAddDocumentModalVisible] = useState(false);
  const [viewFileModalVisible, setViewFileModalVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [isValidForm, setIsValidForm] = useState(true);
  const [filter, setFilter] = useState({});
  const [searchValue, setSearchValue] = useState('');

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const fetchDocumentList = () => {
    dispatch({
      type: 'projectDetails/fetchDocumentListEffect',
      payload: {
        projectId,
        searchKey: searchValue,
        ...filter,
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
  }, [searchValue, JSON.stringify(filter)]);

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const onFilter = (values) => {
    setFilter(values);
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

  const fetchFilterData = () => {
    if (isEmpty(documentTypeList)) {
      dispatch({
        type: 'projectDetails/fetchDocumentTypeListEffect',
      });
    }
  };

  const renderOption = () => {
    const applied = Object.values(filter).filter((v) => v).length;
    const content = <FilterContent onFilter={onFilter} filter={filter} />;

    return (
      <div className={styles.options}>
        <FilterCountTag
          count={applied}
          onClearFilter={() => {
            onFilter({});
          }}
        />
        {allowModify && (
          <CustomAddButton onClick={() => setAddDocumentModalVisible(true)}>
            Add new Document
          </CustomAddButton>
        )}
        <FilterPopover placement="bottomRight" content={content}>
          <CustomOrangeButton onClick={fetchFilterData} showDot={applied > 0} />
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
            onValidForm={setIsValidForm}
          />
        }
        title="Add Document"
        loading={loadingAddDocument}
        disabledButton={!isValidForm}
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
