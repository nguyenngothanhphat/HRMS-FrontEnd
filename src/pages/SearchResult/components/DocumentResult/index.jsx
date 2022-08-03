/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/destructuring-assignment */
import { Card } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history, Link } from 'umi';
import iconPDF from '@/assets/pdf-2.svg';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { isOwner } from '@/utils/authority';
import styles from '../../index.less';

const DocumentResult = React.memo((props) => {
  const {
    keySearch,
    loadTableData,
    dispatch,
    isSearch,
    documentAdvance,
    documentList,
    isSearchAdvance,
    loadTableData2,
    tabName,
  } = props;

  useEffect(() => {
    if (isSearch && tabName === 'documents') {
      if (isSearchAdvance) {
        dispatch({
          type: 'searchAdvance/searchDocument',
          payload: { ...documentAdvance },
        });
      } else if (keySearch) {
        dispatch({
          type: 'searchAdvance/searchGlobalByType',
          payload: {
            keySearch,
            searchType: 'DOCUMENT',
          },
        });
      }
    }
  }, [isSearch]);

  const [visible, setVisible] = useState(false);
  const [urlDocument, setUrlDocument] = useState('');
  const [displayDocumentName, setDisplayDocumentName] = useState('');
  const viewDocument = (document) => {
    const { name: attachmentName = '', url: attachmentUrl = '' } = document;
    setVisible(true);
    setUrlDocument(attachmentUrl);
    setDisplayDocumentName(attachmentName);
  };

  const clickFilter = () => {
    history.push('documents/advanced-search');
  };

  const handleProfileEmployee = (_id, tenant, userId) => {
    localStorage.setItem('tenantCurrentEmployee', tenant);
    const pathname = isOwner()
      ? `/employees/employee-profile/${userId}`
      : `/directory/employee-profile/${userId}`;
    return pathname;
  };

  const columns = [
    {
      title: 'Document',
      dataIndex: 'key',
      key: 'name',
      width: 400,
      fixed: 'left',
      render: (key, record) => (
        <div className={styles.document} onClick={() => viewDocument(record.attachment)}>
          <div className={styles.text}>{key}</div>
          <img alt="pdf-img" src={iconPDF} />
        </div>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'Owner',
      key: 'Owner',
      render: (owner) => {
        if (owner && owner[0]) {
          const {
            _id,
            departmentInfo: department = {},
            employeeId,
            employeeTypeInfo: employeeType = {},
            titleInfo: title = {},
            generalInfoInfo: generalInfo = {},
            locationInfo: location = {},
          } = owner[0];
          const manager = {
            _id,
            department,
            employeeId,
            title,
            generalInfo,
            location,
            employeeType,
          };

          return (
            <Link
              className={styles.managerName}
              to={() =>
                handleProfileEmployee(manager._id, manager.tenant, manager.generalInfo?.userId)
              }
            >
              {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
            </Link>
          );
        }
        return '-';
      },
    },
    {
      title: 'Created On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => <div>{moment(createdAt).format(DATE_FORMAT_MDY)}</div>,
    },
    {
      title: 'Last Modified On',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt) => <div>{moment(updatedAt).format(DATE_FORMAT_MDY)}</div>,
    },
    {
      title: 'Last Modified By',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner) => {
        if (owner && owner[0]) {
          const {
            _id,
            departmentInfo: department = {},
            employeeId,
            employeeTypeInfo: employeeType = {},
            titleInfo: title = {},
            generalInfoInfo: generalInfo = {},
            locationInfo: location = {},
          } = owner[0];
          const manager = {
            _id,
            department,
            employeeId,
            title,
            generalInfo,
            location,
            employeeType,
          };
          return (
            <Link
              className={styles.managerName}
              to={() =>
                handleProfileEmployee(manager._id, manager.tenant, manager.generalInfo?.userId)
              }
            >
              {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
            </Link>
          );
        }
        return '-';
      },
    },
  ];

  const renderOption = () => {
    return (
      <div className={styles.options}>
        <CustomOrangeButton onClick={clickFilter}>Filter</CustomOrangeButton>
      </div>
    );
  };
  return (
    <Card className={styles.ResultContent} extra={renderOption()}>
      <div className={styles.tableContainer}>
        <CommonTable
          columns={columns}
          list={documentList}
          loading={loadTableData || loadTableData2}
          scrollable
        />
      </div>
      <ViewDocumentModal
        visible={visible}
        fileName={displayDocumentName}
        url={urlDocument}
        onClose={() => setVisible(false)}
      />
    </Card>
  );
});
export default connect(
  ({
    loading,
    location: { companyLocationList = [] },
    searchAdvance: {
      keySearch = '',
      isSearch,
      isSearchAdvance,
      documentAdvance,
      globalSearchAdvance: { employeeDoc: documentList, totalDocuments },
    },
  }) => ({
    loadTableData: loading.effects['searchAdvance/searchDocument'],
    loadTableData2: loading.effects['searchAdvance/searchGlobalByType'],
    documentList,
    totalDocuments,
    documentAdvance,
    isSearch,
    isSearchAdvance,
    keySearch,
    companyLocationList,
  }),
)(DocumentResult);
