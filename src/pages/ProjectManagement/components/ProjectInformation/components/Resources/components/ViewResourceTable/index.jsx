import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import CommonTable from '@/components/CommonTable';
import { DATE_FORMAT_LIST } from '@/utils/projectManagement';
import styles from './index.less';

const ViewResourceTable = (props) => {
  const { viewRecord: { resourceType: { _id = '' } = {}, billingStatus = '' } = {} } = props;
  const {
    dispatch,
    loadingFetchResourceList = false,
    employee = '',
    permissions = {},
    projectDetails: { projectDetail = {}, resourceList = [] } = {},
  } = props;

  const {
    id: projectNumberId = '',
    startDate = '',
    endDate = '',
    tentativeEndDate = '',
  } = projectDetail;
  const adminMode = permissions.viewResourceAdminMode !== -1;
  const countryMode = permissions.viewResourceCountryMode !== -1;
  const employeeId = employee ? employee._id : '';

  useEffect(() => {
    dispatch({
      type: 'projectDetails/fetchResourceListEffect',
      payload: {
        employeeId,
        adminMode,
        countryMode,
        title: [_id],
        projects: [projectNumberId],
      },
    });
  }, []);

  const renderTimeTitle = (title) => {
    return (
      <span className={styles.timeTitle}>
        <span>{title}</span>
        <span className={styles.smallText}>(mm/dd/yyyy)</span>
      </span>
    );
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        render: (generalInfo = {}) => {
          const { legalName = '' } = generalInfo;
          return <span>{legalName}</span>;
        },
      },
      {
        title: 'Designation',
        dataIndex: 'titleInfo',
        key: 'titleInfo',
        render: (titleInfo) => {
          return (
            <div className={styles.cell}>
              <span>{titleInfo.name}</span>
            </div>
          );
        },
      },
      {
        title: 'Billing Status',
        dataIndex: 'billingStatus',
        key: 'billingStatus',
        render: () => {
          return <span>{billingStatus || '-'}</span>;
        },
      },
      {
        title: renderTimeTitle('Start Date'),
        dataIndex: 'startDate',
        key: 'startDate',
        align: 'center',
        render: () => {
          const value = startDate ? moment(startDate).format(DATE_FORMAT_LIST) : null;
          return <span>{value || '-'}</span>;
        },
      },
      {
        title: renderTimeTitle('End Date'),
        dataIndex: 'endDate',
        key: 'endDate',
        align: 'center',
        render: () => {
          const value =
            endDate || tentativeEndDate
              ? moment(endDate || tentativeEndDate).format(DATE_FORMAT_LIST)
              : null;
          return <span>{value || '-'}</span>;
        },
      },
    ];

    return columns;
  };

  return (
    <div className={styles.ViewResourceTable}>
      <CommonTable
        columns={generateColumns()}
        list={resourceList}
        showPagination={false}
        loading={loadingFetchResourceList}
      />
    </div>
  );
};
export default connect(
  ({
    loading,
    projectDetails,
    user: { currentUser: { employee = {} } = {}, permissions = {} },
  }) => ({
    employee,
    permissions,
    projectDetails,
    loadingFetchResourceList: loading.effects['projectDetails/fetchResourceListEffect'],
  }),
)(ViewResourceTable);
