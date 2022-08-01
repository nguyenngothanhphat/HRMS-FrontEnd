import { PlusOutlined } from '@ant-design/icons';
// eslint-disable-next-line no-unused-vars
import { Popconfirm } from 'antd';
import { debounce, uniq } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/customerManagement/recycleBin.svg';
import ViewIcon from '@/assets/customerManagement/view.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterPopover from '@/components/FilterPopover';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import AddContent from './components/AddContent';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const Documents = (props) => {
  const {
    dispatch,
    reId,
    loadingDocument = false,
    loadingFilterDocument = false,
    loadingSearchDocument = false,
    loadingAddDocument = false,
    permissions = {},
    customerProfile: { documents = [], documentType = [], info: { customerId = '' } = {} } = {},
  } = props;

  const viewAddCustomerDocument = permissions.viewAddCustomerDocument !== -1;
  const managerCustomerDocument = permissions.managerCustomerDocument !== -1;

  const [searchValue, setSearchValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [viewDocumentModalVisible, setViewDocumentModalVisible] = useState(false);
  const [isValidForm, setIsValidForm] = useState(false);
  const [url, setUrl] = useState('');

  const fetchData = () => {
    dispatch({
      type: 'customerProfile/fetchDocuments',
      payload: {
        id: reId,
        searchKey: searchValue,
      },
    });
  };

  const fetchDocumentTypeList = () => {
    dispatch({
      type: 'customerProfile/fetchDocumentsTypes',
    });
  };

  useEffect(() => {
    fetchDocumentTypeList();
  }, []);

  useEffect(() => {
    fetchData();
  }, [searchValue]);

  const showModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const onFilter = (values) => {
    const { byType, fromDate, toDate, byUpload } = values;
    dispatch({
      type: 'customerProfile/filterDoc',
      payload: {
        customerId,
        type: parseInt(byType, 10) || '',
        uploadedBy: byUpload || '',
        fromDate: fromDate || '',
        toDate: toDate || '',
      },
    });
  };

  const removeDoc = (idProp) => {
    dispatch({
      type: 'customerProfile/removeDoc',
      payload: {
        id: idProp,
      },
    }).then(() => {
      dispatch({
        type: 'customerProfile/fetchDocuments',
        payload: {
          id: reId,
        },
      });
    });
  };

  const viewDocument = (doc) => {
    setUrl(doc.attachmentInfo?.url);
    setViewDocumentModalVisible(true);
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Document Name',
        dataIndex: 'documentName',
        align: 'left',
        fixed: 'left',
        width: '10%',
      },
      {
        title: 'Document Type',
        dataIndex: 'documentTypeName',
        align: 'left',
        width: '10%',
      },
      {
        title: 'Uploaded By',
        dataIndex: 'ownerName',
        width: '10%',
        align: 'left',
      },
      {
        title: 'Uploaded On',
        dataIndex: 'createdAt',
        width: '10%',
        align: 'left',
        render: (createdAt) => {
          const time = moment(createdAt).format(DATE_FORMAT_MDY);
          return <span>{time}</span>;
        },
      },
      {
        title: 'Action',
        // dataIndex: 'pendingTasks',
        width: '10%',
        align: 'center',
        render: (document) => {
          return (
            <div className={styles.action}>
              {viewAddCustomerDocument && (
                <img src={ViewIcon} alt="" onClick={() => viewDocument(document)} />
              )}

              {managerCustomerDocument && (
                <Popconfirm onConfirm={() => removeDoc(document.id)} title="Sure to remove?">
                  <img src={DeleteIcon} alt="" />
                </Popconfirm>
              )}
            </div>
          );
        },
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  const uploadByList =
    documents && documents.length > 0
      ? documents.map((d) => {
          return d.ownerName;
        })
      : [];
  const uniqUploadByList = uniq(uploadByList);

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (e) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  return (
    <div className={styles.Documents}>
      <div className={styles.documentHeader}>
        <div className={styles.documentHeaderTitle}>
          <span>Documents</span>
        </div>
        <div className={styles.documentHeaderFunction}>
          {/* Add doc */}
          {managerCustomerDocument && (
            <div className={styles.buttonAddImport} onClick={showModal}>
              <PlusOutlined />
              Add Document
            </div>
          )}

          <CommonModal
            visible={visible}
            onClose={closeModal}
            firstText="Add Document"
            loading={loadingAddDocument}
            content={
              <AddContent
                visible={visible}
                onClose={closeModal}
                refreshData={fetchData}
                onValidForm={setIsValidForm}
              />
            }
            title="Add Document"
            disabledButton={!isValidForm}
          />

          <div className={styles.filterPopover}>
            <FilterPopover
              content={
                <FilterContent
                  documentType={documentType}
                  onFilter={onFilter}
                  uploadByList={uniqUploadByList}
                />
              }
            >
              <CustomOrangeButton>Filter</CustomOrangeButton>
            </FilterPopover>
          </div>

          <CustomSearchBox onSearch={onSearch} placeholder="Search by Document Type" />
        </div>
      </div>
      <div className={styles.documentBody}>
        <CommonTable
          columns={generateColumns()}
          list={documents}
          loading={loadingDocument || loadingSearchDocument || loadingFilterDocument}
        />
        <ViewDocumentModal
          url={url}
          visible={viewDocumentModalVisible}
          onClose={() => setViewDocumentModalVisible(false)}
        />
      </div>
    </div>
  );
};

export default connect(
  ({ loading, customerProfile, user: { companiesOfUser = [], permissions = {} } = {} }) => ({
    loadingDocument: loading.effects['customerProfile/fetchDocuments'],
    loadingDocumentType: loading.effects['customerProfile/fetchDocumentsTypes'],
    loadingSearchDocument: loading.effects['customerProfile/searchDocuments'],
    loadingFilterDocument: loading.effects['customerProfile/filterDoc'],
    loadingAddDocument: loading.effects['customerProfile/addDoc'],
    customerProfile,
    permissions,
    companiesOfUser,
  }),
)(Documents);
