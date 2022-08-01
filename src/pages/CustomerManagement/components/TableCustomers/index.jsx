import { Avatar, Popover } from 'antd';
import React, { useState } from 'react';
import { connect, formatMessage, history, Link } from 'umi';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import DeleteIcon from '@/assets/customerManagement/delete.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import UserProfilePopover from '@/components/UserProfilePopover';
import { getEmployeeUrl } from '@/utils/directory';
import DeleteCustomerModalContent from './components/DeleteCustomerModalContent';
import styles from './index.less';

const TableCustomers = (props) => {
  const {
    listCustomer = [],
    loadingCustomer = false,
    loadingFilter = false,
    loadingDeleteProject = false,
    dispatch,
    permissions,
  } = props;

  const viewDeleteCustomer = permissions.deleteCustomerManagement !== -1;

  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isDeleteCustomer, setIsDeleteCustomer] = useState(false);

  const getCustomerUrl = (account) => {
    return `/customer-management/list/customer-profile/${account}`;
  };

  const getCustomerProjectUrl = (record) => {
    const { customerId = '' } = record;
    return `/customer-management/list/customer-profile/${customerId}/projects`;
  };

  const renderCustomerId = (customerId, record) => {
    const { avatar = '' } = record;

    const popupImg = () => {
      return (
        <div className={styles.popupImg}>
          <img
            src={avatar || DefaultAvatar}
            alt="avatar"
            onError={(e) => {
              e.target.src = DefaultAvatar;
            }}
          />
        </div>
      );
    };

    return (
      <div>
        <Popover placement="rightTop" content={popupImg} trigger="hover">
          <Avatar
            size="medium"
            style={{ marginRight: '10px' }}
            src={
              <img
                src={avatar || DefaultAvatar}
                alt=""
                onError={(e) => {
                  e.target.src = DefaultAvatar;
                }}
              />
            }
            alt="avatar"
          />
        </Popover>
        <span className={styles.blueText}>{customerId}</span>
      </div>
    );
  };

  const generateColumns = () => {
    let columns = [
      {
        title: formatMessage({ id: 'page.customermanagement.customerID' }),
        dataIndex: 'customerId',
        align: 'left',
        fixed: 'left',
        // width: '10%',
        render: (customerId, record) => {
          return (
            <Link style={{ fontWeight: '700', color: '#2C6DF9' }} to={getCustomerUrl(customerId)}>
              {renderCustomerId(customerId, record)}
            </Link>
          );
        },
      },
      {
        title: formatMessage({ id: 'page.customermanagement.companyName' }),
        dataIndex: 'legalName',
        align: 'left',
        // width: '10%',
        render: (legalName) => <span className={styles.blueText}>{legalName}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.openLeads' }),
        dataIndex: 'openLeads',
        // width: '10%',
        align: 'center',
        render: (openLeads) => <span className={styles.blueText}>{openLeads}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.pendingTickets' }),
        dataIndex: 'pendingTickets',
        // width: '10%',
        align: 'center',
        render: (pendingTickets) => <span className={styles.blueText}>{pendingTickets}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.pendingTasks' }),
        dataIndex: 'pendingTasks',
        // width: '10%',
        align: 'center',
        render: (pendingTasks) => <span className={styles.blueText}>{pendingTasks}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.activeProjects' }),
        dataIndex: 'activeProject',
        // width: '10%',
        align: 'center',
        render: (activeProject, record) => (
          <Link className={styles.blueText} to={getCustomerProjectUrl(record)}>
            {activeProject}
          </Link>
        ),
      },
      {
        title: formatMessage({ id: 'page.customermanagement.status' }),
        dataIndex: 'status',
        align: 'left',
        // width: '10%',
      },
      {
        title: formatMessage({ id: 'page.customermanagement.accountOwner' }),
        dataIndex: 'accountOwner',
        align: 'left',
        key: 'legalName',
        // width: '10%',
        render: (accountOwner = {}) => {
          return (
            <UserProfilePopover data={accountOwner || {}} placement="leftTop">
              <Link
                to={getEmployeeUrl(accountOwner?.generalInfo?.userId)}
                className={styles.blueText}
              >
                {accountOwner?.generalInfo?.legalName || ''}
              </Link>
            </UserProfilePopover>
          );
        },
      },
      {
        title: 'Action',
        key: 'action',
        dataIndex: 'action',
        align: 'center',
        // width: '5%',
        render: (a, record) => {
          return (
            <div className={styles.btnAction}>
              <img
                src={DeleteIcon}
                alt="delete"
                onClick={() => {
                  setSelectedCustomer(record);
                  setIsDeleteCustomer(true);
                }}
              />
            </div>
          );
        },
      },
    ];

    if (!viewDeleteCustomer) {
      columns = columns.filter((column) => !['action'].includes(column.dataIndex));
    }
    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  // refresh list without losing filter, search
  const onRefresh = () => {
    dispatch({
      type: 'customerManagement/fetchCustomerList',
    });
  };

  return (
    <div className={styles.tableCustomers}>
      <CommonTable
        loading={loadingCustomer || loadingFilter}
        columns={generateColumns()}
        list={listCustomer}
        rowKey="_id"
      />
      <CommonModal
        visible={isDeleteCustomer}
        onClose={() => setIsDeleteCustomer(false)}
        firstText="Delete"
        cancelText="Cancel"
        title="Delete Project"
        loading={loadingDeleteProject}
        content={
          <DeleteCustomerModalContent
            onClose={() => setIsDeleteCustomer(false)}
            selectedCustomer={selectedCustomer}
            onRefresh={onRefresh}
          />
        }
        width={600}
      />
    </div>
  );
};

export default connect(({ loading, user: { permissions = {} } = {} }) => ({
  permissions,
  loadingDeleteProject: loading.effects['customerManagement/removeCustomerEffect'],
}))(TableCustomers);
