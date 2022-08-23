import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { SwapRightOutlined } from '@ant-design/icons';
import CommonTable from '@/components/CommonTable';
import styles from './index.less';

const EmploymentHistory = (props) => {
  const {
    loading,
    employeeProfile: {
      originData: {
        generalData: { employee: employeeId = '' } = {},
        changeHistories = [],
        changeHistoriesTotal = 0,
      } = {},
    } = {},
    fetchChangeHistories = () => {},
  } = props;

  const [expandData, setExpandData] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const replaceArrow = (str = '') => {
    const parts = str.split('=>');
    if (parts.length > 1) {
      return (
        <>
          <span>{parts[0]}</span>
          <SwapRightOutlined />
          <span>{parts[1]}</span>
        </>
      );
    }
    return str;
  };

  const formatData = (data) => {
    const newData = data.map((item, index) => ({
      key: `${index + 1}`,
      changed: item.changed,
      effectiveDate: moment(item?.effectiveDate).locale('en').format('Do MMM YYYY'),
      changedBy: item?.changeByEmployee?.changeByInfo?.generalInfoInfo || '',
      changeDate: moment(item?.changeDate).locale('en').format('Do MMM YYYY'),
      action: item?.takeEffect === 'WILL_UPDATE' ? 'Revoke' : '',
      reason: item?.reasonChange,
      id: item?._id,
    }));

    setExpandData(newData);
  };

  useEffect(() => {
    if (employeeId) {
      fetchChangeHistories({ employee: employeeId, limit, page });
    }
  }, [page, limit, employeeId]);

  useEffect(() => {
    formatData(changeHistories);
  }, [JSON.stringify(changeHistories)]);

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Change Type',
        dataIndex: 'changed',
        key: 'changed',
        render: (changed = {}) => {
          return (
            <div className={styles.changeType}>
              <span className={styles.type}>{changed.type}</span>
              <span className={styles.value}>{replaceArrow(changed.detail)}</span>
            </div>
          );
        },
        align: 'left',
        width: '25%',
      },
      {
        title: 'Effective Date',
        dataIndex: 'effectiveDate',
        key: 'effectiveDate',
        align: 'left',
      },
      {
        title: 'Initiated Date',
        key: 'changeDate',
        dataIndex: 'changeDate',
        align: 'left',
        render: (changeDate) => <span>{changeDate}</span>,
      },
      {
        title: 'Changed By',
        dataIndex: 'changedBy',
        key: 'changedBy',
        align: 'left',
        render: (changedBy) => (
          <span
            style={{ color: 'blue', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => viewProfile(changedBy?.userId)}
          >
            {changedBy?.legalName} {changedBy?.userId ? `(${changedBy?.userId})` : ''}
          </span>
        ),
      },
      {
        title: 'Changed Reason',
        dataIndex: 'reason',
        key: 'reason',
        align: 'left',
        width: '25%',
        render: (reason) => reason || '',
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  // const handleClick = (id) => {
  //   dispatch({
  //     type: 'employeeProfile/revokeHistory',
  //     payload: {
  //       employee: employeeId,
  //       id,
  //       tenantId: getCurrentTenant(),
  //     },
  //   });
  // };

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l);
  };

  return (
    <div className={styles.EmploymentHistory}>
      <CommonTable
        loading={loading}
        columns={generateColumns()}
        list={expandData}
        showPagination
        isBackendPaging
        limit={limit}
        page={page}
        onChangePage={onChangePage}
        pageSizeOptions={['5', '10', '25', '50', '100']}
        total={changeHistoriesTotal}
      />
    </div>
  );
};

export default connect(({ employeeProfile, loading }) => ({
  employeeProfile,
  loading:
    loading.effects['employeeProfile/addNewChangeHistory'] ||
    loading.effects['employeeProfile/revokeHistory'] ||
    loading.effects['employeeProfile/fetchChangeHistories'],
}))(EmploymentHistory);
