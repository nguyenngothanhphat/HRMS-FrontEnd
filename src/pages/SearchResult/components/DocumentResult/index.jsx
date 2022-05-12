/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { Table, Popover } from 'antd';
import { formatMessage, connect, history, Link } from 'umi';
import moment from 'moment';
import { isEmpty } from 'lodash';
import filterIcon from '@/assets/offboarding-filter.svg';
import iconPDF from '@/assets/pdf-2.svg';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { isOwner } from '@/utils/authority';
import { getTimezoneViaCity } from '@/utils/times';
import PopoverInfo from '@/pages/Directory/components/Directory/components/DirectoryTable/components/ModalTerminate/PopoverInfo';
import styles from '../../index.less';

const DocumentResult = React.memo((props) => {
  const {
    keySearch,
    loadTableData,
    dispatch,
    isSearch,
    documnetAdvance,
    documentList,
    isSearchAdvance,
    totalDocuments,
    loadTableData2,
    tabName,
    companyLocationList,
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [timezoneList, setTimezoneList] = useState([]);
  const [currentTime] = useState(moment());

  const fetchTimezone = () => {
    const timezoneListTemp = [];
    companyLocationList.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timezoneListTemp.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    setTimezoneList(timezoneListTemp);
  };
  useEffect(() => {
    fetchTimezone();
  }, []);

  useEffect(() => {
    if (isSearch && tabName === 'documents') {
      if (isSearchAdvance) {
        dispatch({
          type: 'searchAdvance/searchDocument',
          payload: { ...documnetAdvance },
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

  const dateFormat = 'DD.MM.YY';
  const [visable, setVisiable] = useState(false);
  const [urlDocument, setUrlDocument] = useState('');
  const [displayDocumentName, setDisplayDocumentName] = useState('');
  const viewDocument = (document) => {
    const { name: attachmentName = '', url: attachmentUrl = '' } = document;
    setVisiable(true);
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
            <Popover
              content={
                <PopoverInfo
                  companyLocationList={companyLocationList}
                  propsState={{ currentTime, timezoneList }}
                  data={manager}
                />
              }
              placement="bottomRight"
              trigger="hover"
            >
              <Link
                className={styles.managerName}
                to={() =>
                  handleProfileEmployee(manager._id, manager.tenant, manager.generalInfo?.userId)
                }
              >
                {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
              </Link>
            </Popover>
          );
        }
        return '-';
      },
    },
    {
      title: 'Created On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => <div>{moment(createdAt).format(dateFormat)}</div>,
    },
    {
      title: 'Last Modified On',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt) => <div>{moment(updatedAt).format(dateFormat)}</div>,
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
            <Popover
              content={
                <PopoverInfo
                  companyLocationList={companyLocationList}
                  propsState={{ currentTime, timezoneList }}
                  data={manager}
                />
              }
              placement="bottomRight"
              trigger="hover"
            >
              <Link
                className={styles.managerName}
                to={() =>
                  handleProfileEmployee(manager._id, manager.tenant, manager.generalInfo?.userId)
                }
              >
                {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
              </Link>
            </Popover>
          );
        }
        return '-';
      },
    },
  ];

  const pagination = {
    position: ['bottomLeft'],
    total: totalDocuments,
    showTotal: (total, range) => (
      <span>
        {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
      </span>
    ),
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    pageSize: limit,
    current: page,
    onChange: (nextPage, pageSize) => {
      setPage(nextPage);
      setLimit(pageSize);
    },
  };
  return (
    <div className={styles.resultContent}>
      <div className={styles.filter}>
        <img src={filterIcon} alt="filter icon" onClick={clickFilter} />
      </div>
      <div className={styles.result}>
        <Table
          columns={columns}
          dataSource={documentList}
          size="middle"
          pagination={pagination}
          loading={loadTableData || loadTableData2}
        />
      </div>
      <ViewDocumentModal
        visible={visable}
        fileName={displayDocumentName}
        url={urlDocument}
        onClose={() => setVisiable(false)}
      />
    </div>
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
      documnetAdvance,
      globalSearchAdvance: { employeeDoc: documentList, totalDocuments },
    },
  }) => ({
    loadTableData: loading.effects['searchAdvance/searchDocument'],
    loadTableData2: loading.effects['searchAdvance/searchGlobalByType'],
    documentList,
    totalDocuments,
    documnetAdvance,
    isSearch,
    isSearchAdvance,
    keySearch,
    companyLocationList,
  }),
)(DocumentResult);
