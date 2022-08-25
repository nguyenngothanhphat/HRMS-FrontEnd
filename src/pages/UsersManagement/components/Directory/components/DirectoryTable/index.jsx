/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
import { Tag } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, formatMessage, Link } from 'umi';
import DeleteUserIcon from '@/assets/admin_icondelete.svg';
import EditUserIcon from '@/assets/admin_iconedit.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import { isOwner } from '@/utils/authority';
import ConfirmRemoveModal from '../ConfirmRemoveModal';
import EditUserModalContent from '../EditUserModalContent';
import ResetPasswordModal from '../ResetPasswordModal';
import TerminateModalContent from '../TerminateModalContent';
import styles from './index.less';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';

const roleTags = [
  { name: 'REGION-HEAD', color: 'magenta' },
  { name: 'CANDIDATE', color: 'gold' },
  { name: 'CUSTOMER', color: 'orange' },
  { name: 'EMPLOYEE', color: 'blue' },
  { name: 'HR', color: 'green' },
  { name: 'ADMIN-CDA', color: 'lime' },
  { name: 'LEADER', color: 'red' },
  { name: 'HR-MANAGER', color: 'volcano' },
  { name: 'HR-GLOBAL', color: 'cyan' },
  { name: 'MANAGER', color: 'geekblue' },
];

const ACTION = {
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  RESET: 'RESET',
  TERMINATE: 'TERMINATE',
};

const DirectoryTable = (props) => {
  const {
    dispatch,
    list = [],
    loading,
    pageSelected,
    rowSize,
    total = 0,
    keyTab = '',
    refreshData = () => {},
    loadingEdit = false,
    loadingTerminate = false,
  } = props;

  const [modalVisibleType, setModalVisibleType] = useState('');
  const [handlingUser, setHandlingUser] = useState();
  const [terminatingEmployeeId, setTerminatingEmployeeId] = useState('');

  const handleProfileEmployee = (userId) => {
    const pathname = isOwner()
      ? `/employees/employee-profile/${userId}`
      : `/directory/employee-profile/${userId}`;
    return pathname;
  };

  const renderUser = (generalInfoProp = {}) => {
    const { userId = '', legalName = '' } = generalInfoProp;

    return (
      <div className={styles.directoryTableName}>
        <Link className={styles.directoryTableName__name} to={() => handleProfileEmployee(userId)}>
          {legalName}
        </Link>
      </div>
    );
  };

  const saveSelectedUserState = async (id, tenant) => {
    await dispatch({
      type: 'usersManagement/save',
      payload: {
        selectedUserId: id,
        selectedUserTenant: tenant,
      },
    });
  };

  const clearSelectedUserState = () => {
    dispatch({
      type: 'usersManagement/save',
      payload: {
        selectedUserId: '',
        selectedUserTenant: '',
      },
    });
  };

  const generateColumns = () => {
    let columns = [
      {
        title: <div className={styles.directoryTable_fullName}>Full name</div>,
        dataIndex: 'generalInfo',
        key: 'legalName',
        render: (generalInfo = {}) => (generalInfo ? renderUser(generalInfo) : ''),
        align: 'left',
        sorter: (a, b) => {
          return a.generalInfo && a.generalInfo?.legalName
            ? a.generalInfo?.legalName.localeCompare(`${b.generalInfo?.legalName}`)
            : null;
        },
        // sortOrder: sortedName.columnKey === 'employeePack' && sortedName.order,
        fixed: 'left',
        width: '14%',
        defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend', 'ascend'],
        // className: `${styles.col} `,
      },
      {
        title: 'User ID',
        dataIndex: 'generalInfo',
        key: '_id',
        render: (generalInfo) => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {generalInfo?.userId}
          </span>
        ),

        align: 'left',
        // sortOrder: sortedName.columnKey === 'userName' && sortedName.order,
        sorter: (a, b) => {
          return a.generalInfo && a.generalInfo?.userId
            ? a.generalInfo?.userId.localeCompare(`${b.generalInfo?.userId}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.employeeID' }),
        dataIndex: 'generalInfo',
        key: 'employeeId',
        className: `${styles.employeeId} `,
        render: (generalInfo) => <span>{generalInfo ? generalInfo.employeeId : ''}</span>,
        align: 'left',
        // sortOrder: sortedName.columnKey === 'employeeId' && sortedName.order,
        sorter: (a, b) => {
          return a.generalInfo && a.generalInfo?.employeeId
            ? a.generalInfo?.employeeId.localeCompare(`${b.generalInfo?.employeeId}`)
            : null;
        },
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Created date',
        dataIndex: 'joinDate',
        align: 'left',
        render: (joinDate) =>
          joinDate ? <span>{moment(joinDate).locale('en').format(DATE_FORMAT_MDY)}</span> : '',
        sortDirections: ['ascend', 'descend', 'ascend'],
        sorter: {
          compare: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
        },
      },
      {
        title: 'Email',
        dataIndex: 'generalInfo',
        align: 'left',
        width: '18%',
        render: (generalInfo) => <span>{generalInfo ? generalInfo.workEmail : ''}</span>,
        // sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        // compare: (a, b) => a.workEmail && b.workEmail && a.workEmail.localeCompare(b.workEmail),
        // },
      },
      {
        title: formatMessage({ id: 'component.directory.table.department' }),
        dataIndex: 'department',
        key: 'department',
        render: (department) => (
          <span className={styles.directoryTable_deparmentText}>
            {department ? department.name : ''}
          </span>
        ),
        // align: 'left',
      },
      {
        title: 'Role',
        dataIndex: 'managePermission',
        align: 'left',
        width: '10%',
        render: (managePermission = {}) => {
          return (managePermission?.roles || []).map((role) => {
            const tag = roleTags.find((d) => d.name === role) || {};
            return (
              <Tag
                style={{
                  marginBlock: 2,
                }}
                color={tag.color || 'purple'}
              >
                {role.toUpperCase()}
              </Tag>
            );
          });
        },
      },
      {
        title: 'Location',
        dataIndex: 'location',
        align: 'left',
        render: (location) => <span>{location ? location.name : ''}</span>,
      },
      {
        title: 'Company',
        dataIndex: 'company',
        align: 'left',
        render: (company) => <span>{company ? company.name : ''}</span>,
      },

      {
        title: 'Last Working Date',
        dataIndex: 'leftDate',
        align: 'left',
        render: (leftDate) =>
          leftDate ? <span>{moment(leftDate).locale('en').format(DATE_FORMAT_MDY)}</span> : '-',
      },
      {
        title: 'Reason for Termination',
        dataIndex: 'reasonForLeaving',
        align: 'left',
        render: (reasonForLeaving) => (reasonForLeaving ? <span>{reasonForLeaving}</span> : '-'),
      },
      {
        title: 'Password',
        key: 'password',
        dataIndex: '_id',
        align: 'left',
        render: (_, row) => (
          <div className={styles.userPasswordReset}>
            {/* <span className={styles.userPassword}>*******</span> */}
            <div
              onClick={() => {
                setModalVisibleType(ACTION.RESET);
                setHandlingUser(row);
              }}
            >
              <span>RESET</span>
            </div>
          </div>
        ),
      },

      {
        title: 'Action',
        dataIndex: '_id',
        align: 'center',
        key: 'action',
        fixed: 'right',
        render: (_, row) => (
          <div className={styles.userAction}>
            <img
              src={EditUserIcon}
              alt="edit-user"
              onClick={() => {
                setModalVisibleType(ACTION.EDIT);
                saveSelectedUserState(row._id, row.tenant);
              }}
              className={styles.editUserBtn}
            />
            <img
              src={DeleteUserIcon}
              alt="delete-user"
              onClick={() => {
                setModalVisibleType(ACTION.DELETE);
                saveSelectedUserState(row._id, row.tenant);
              }}
              className={styles.editUserBtn}
            />
          </div>
        ),
      },
    ];

    if (keyTab === 'active') {
      columns = columns.filter(
        (column) => !['reasonForLeaving', 'leftDate'].includes(column.dataIndex),
      );
    }
    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  const onChangePage = (page, limit) => {
    const { getPageSelected, getSize } = props;
    getPageSelected(page);
    getSize(limit);
  };

  const onCloseEditModal = (refresh = true) => {
    setModalVisibleType('');

    if (refresh) {
      clearSelectedUserState();
      refreshData();
    }
  };

  const onCloseTerminateModal = () => {
    setModalVisibleType('');
    setTerminatingEmployeeId('');
    clearSelectedUserState();
    refreshData();
  };

  return (
    <>
      <div className={styles.directoryTable}>
        <CommonTable
          // size="small"
          columns={generateColumns()}
          list={list}
          rowKey="_id"
          loading={loading}
          page={pageSelected}
          limit={rowSize}
          total={total}
          onChangePage={onChangePage}
          isBackendPaging
          // scroll={scroll}
          scrollable
          width={keyTab === 'active' ? '120vw' : '140vw'}
          height={500}
        />
      </div>

      <CommonModal
        visible={modalVisibleType === ACTION.EDIT}
        content={
          <EditUserModalContent
            onClose={onCloseEditModal}
            keyTab={keyTab}
            visible={modalVisibleType === ACTION.EDIT}
            setOpenTerminateModal={(_id) => {
              setTerminatingEmployeeId(_id);
              if (keyTab.toLowerCase() === 'active') {
                setModalVisibleType(ACTION.TERMINATE);
              }
            }}
          />
        }
        onClose={onCloseEditModal}
        title="Edit User Profile"
        loading={loadingEdit}
        width={550}
      />

      <CommonModal
        visible={modalVisibleType === ACTION.TERMINATE}
        content={
          <TerminateModalContent
            visible={modalVisibleType === ACTION.TERMINATE}
            onClose={onCloseTerminateModal}
            employee={terminatingEmployeeId}
          />
        }
        onClose={onCloseTerminateModal}
        title="Terminate employee"
        loading={loadingTerminate}
        width={550}
      />

      <ConfirmRemoveModal
        titleModal="Remove User Confirm"
        visible={modalVisibleType === ACTION.DELETE}
        handleCancel={() => {
          setModalVisibleType('');
          setHandlingUser(null);
          clearSelectedUserState();
          refreshData();
        }}
      />

      <ResetPasswordModal
        workEmail={handlingUser?.generalInfo?.workEmail}
        titleModal="Reset Password"
        visible={modalVisibleType === ACTION.RESET}
        handleCancel={() => {
          setModalVisibleType('');
          setHandlingUser(null);
          clearSelectedUserState();
        }}
      />
    </>
  );
};

export default connect(
  ({
    loading,
    offboarding: { approvalflow = [] } = {},
    user: { permissions = {} },
    location: { companyLocationList = [] },
  }) => ({
    loadingEdit:
      loading.effects['usersManagement/updateEmployee'] ||
      loading.effects['usersManagement/updateGeneralInfo'] ||
      loading.effects['usersManagement/updateRolesByEmployee'],
    loadingTerminate: loading.effects['offboarding/terminateReason'],
    approvalflow,
    permissions,
    companyLocationList,
  }),
)(DirectoryTable);
