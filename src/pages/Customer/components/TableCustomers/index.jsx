import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { formatMessage, history } from 'umi';
import UserProfilePopover from '../UserProfilePopover';
import DeleteCustomerModalContent from './components/DeleteCustomerModalContent';
import DeleteIcon from '@/assets/customerManagement/delete.svg';
import styles from './index.less';
import CommonModal from '@/components/CommonModal';

const TableCustomers = (props) => {
  const {
    data,
    listCustomer = [],
    loadingCustomer = false,
    loadingFilter = false,
    dispatch,
  } = props;

  const [pageSelected, setPageSelected] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [isDeleteCustomer, setIsDeleteCustomer] = useState(false);
  const [size, setSize] = useState(10);
  const setFirstPage = () => {
    setPageSelected(1);
  };

  const handleProfile = (account) => {
    history.push(`/customer-management/customers/customer-profile/${account}`);
  };

  const generateColumns = () => {
    const columns = [
      {
        title: formatMessage({ id: 'page.customermanagement.customerID' }),
        dataIndex: 'customerId',
        align: 'center',
        fixed: 'left',
        width: '10%',
        render: (customerId) => {
          return (
            <div
              style={{ fontWeight: '700', color: '#2C6DF9' }}
              onClick={() => handleProfile(customerId)}
            >
              {customerId}
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'page.customermanagement.companyAlias' }),
        dataIndex: 'dba',
        align: 'center',
        width: '10%',
        render: (dba) => <span className={styles.blueText}>{dba}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.openLeads' }),
        dataIndex: 'openLeads',
        width: '10%',
        align: 'center',
        render: (openLeads) => <span className={styles.blueText}>{openLeads}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.pendingTickets' }),
        dataIndex: 'pendingTickets',
        width: '10%',
        align: 'center',
        render: (pendingTickets) => <span className={styles.blueText}>{pendingTickets}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.pendingTasks' }),
        dataIndex: 'pendingTasks',
        width: '10%',
        align: 'center',
        render: (pendingTasks) => <span className={styles.blueText}>{pendingTasks}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.activeProjects' }),
        dataIndex: 'activeProjects',
        width: '10%',
        align: 'center',
        render: (activeProjects) => <span className={styles.blueText}>{activeProjects}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.status' }),
        dataIndex: 'status',
        align: 'center',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'page.customermanagement.accountOwner' }),
        dataIndex: 'accountOwner',
        align: 'center',
        key: 'legalName',
        width: '10%',
        render: (accountOwner = {}) => {
          return (
            <UserProfilePopover data={accountOwner || {}} placement="leftTop">
              <span className={styles.blueText}>
                {accountOwner?.generalInfo?.legalName ? accountOwner?.generalInfo?.legalName : ''}
              </span>
            </UserProfilePopover>
          );
        },
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        width: '5%',
        render: (record) => {
          return (
            <div className={styles.btnAction}>
              <Button
                type="link"
                shape="circle"
                onClick={() => {
                  setSelectedCustomer(record);
                  setIsDeleteCustomer(true);
                }}
              >
                <img src={DeleteIcon} alt="delete" />
              </Button>
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

  const onChangePagination = (pageNumber, pageSize) => {
    setPageSelected(pageNumber);
    setSize(pageSize);
  };

  // refresh list without losing filter, search
  const onRefresh = () => {
    dispatch({
      type: 'projectManagement/refreshProjectList',
    });
  };

  const scroll = {
    x: 'max-content',
    y: 'max-content',
  };

  const pagination = {
    position: ['bottomLeft'],
    total: listCustomer.length,
    showTotal: (total, range) => (
      <span>
        {' '}
        {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
      </span>
    ),
    defaultPageSize: size,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    pageSize: size,
    current: pageSelected,
    onChange: onChangePagination,
  };

  useEffect(() => {
    setFirstPage();
  }, [data]);

  return (
    <div className={styles.tableCustomers}>
      <Table
        size="middle"
        loading={loadingCustomer || loadingFilter}
        pagination={pagination}
        columns={generateColumns()}
        dataSource={listCustomer}
        scroll={scroll}
        rowKey={(record) => record._id}
      />
      <CommonModal
        visible={isDeleteCustomer}
        onClose={() => setIsDeleteCustomer(false)}
        firstText="Delete"
        secondText="Cancel"
        title="Delete Project"
        // loading={loadingDeleteProject}
        content={
          <DeleteCustomerModalContent
            onClose={() => setIsDeleteCustomer(false)}
            selectedProject={selectedCustomer}
            onRefresh={onRefresh}
          />
        }
        width={600}
      />
    </div>
  );
};

export default TableCustomers;
