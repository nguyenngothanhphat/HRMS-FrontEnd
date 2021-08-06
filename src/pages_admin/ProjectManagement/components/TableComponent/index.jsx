import React, { useState } from 'react';

import { formatMessage, history } from 'umi';
import { Table } from 'antd';
import CustomModal from '@/components/CustomModal';
import moment from 'moment';
import ModalContent from '../ModalContent';
import dropbox from '../assets/dropbox.png';

import s from './index.less';

import COLUMN_NAME from '../utils';

const {
  PROJECT_ID,
  PROJECT_NAME,
  CREATED_DATE,
  PROJECT_MANAGER,
  DURATION,
  START_DATE,
  MEMBERS,
  PROJECT_HEALTH,
  ACTION,
} = COLUMN_NAME;

// const rowSize = 10;

const TableComponent = (props) => {
  const {
    list = [],
    roleList = [],
    employeeList = [],
    dispatch,
    user,
    loading,
    listLocationsByCompany = [],
    // companiesOfUser = [],
    loadingFetchProject = false,
    getPageAndSize = () => {},
    pageSelected = '',
    size = '',
    totalActive = '',
    totalInactive = '',
  } = props;
  // const [pageSelected, setPageSelected] = useState(1);
  // const [currentRecord, setCurrentRecord] = useState(1);
  const [open, setOpen] = useState(false);
  const [projectInfo, setProjectInfo] = useState({});

  // const onChangePagination = (pageNumber) => {
  //   setPageSelected(pageNumber);
  // };

  const assignMember = (record) => {
    const { projectName = '', projectId = '', projectManager, company } = record;
    setOpen(true);
    setProjectInfo({ projectName, projectId, projectManager, company });

    const locationPayload = listLocationsByCompany.map(
      ({ headQuarterAddress: { country: countryItem1 = '' } = {} }) => {
        let stateList = [];
        listLocationsByCompany.forEach(
          ({ headQuarterAddress: { country: countryItem2 = '', state: stateItem2 = '' } = {} }) => {
            if (countryItem1 === countryItem2) {
              stateList = [...stateList, stateItem2];
            }
          },
        );
        return {
          country: countryItem1,
          state: stateList,
        };
      },
    );

    dispatch({
      type: 'projectManagement/getEmployees',
      payload: {
        company,
        location: locationPayload,
        status: ['ACTIVE'],
      },
    });
  };

  const columns = [
    {
      title: PROJECT_ID,
      dataIndex: 'projectId',
      key: 'projectId',
      align: 'left',
    },
    {
      title: PROJECT_NAME,
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: CREATED_DATE,
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (createdDate) => <span>{moment(createdDate).format('MM.DD.YY')}</span>,
    },
    {
      title: PROJECT_MANAGER,
      dataIndex: 'projectManager',
      key: 'projectManager',
      render: (projectManager) => {
        const {
          generalInfo: { firstName = '', middleName = '', lastName = '', userId = '' } = {},
        } = projectManager || {};
        let fullName = `${firstName} ${middleName} ${lastName}`;
        if (!middleName) fullName = `${firstName} ${lastName}`;
        return (
          <span
            className={s.manager}
            onClick={() => {
              history.push(`/employees/employee-profile/${userId}`);
            }}
          >
            {fullName}
          </span>
        );
      },
    },
    {
      title: DURATION,
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: START_DATE,
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'left',
    },
    {
      title: MEMBERS,
      dataIndex: 'members',
      key: 'members',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <img
              style={{ cursor: 'pointer' }}
              src={dropbox}
              alt="dropbox"
              onClick={() => {
                assignMember(record);
              }}
            />
          </>
        );
      },
    },
    {
      title: PROJECT_HEALTH,
      dataIndex: 'projectHealth',
      key: 'projectHealth',
    },
    {
      title: ACTION,
      dataIndex: 'action',
      key: 'action',

      render: () => {
        return (
          <>
            <span className={s.action}>view project</span>
          </>
        );
      },
    },
  ];

  const pagination = {
    position: ['bottomLeft'],
    total: totalActive || totalInactive,
    showTotal: (total, range) => (
      <span>
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
    onChange: (page, pageSize) => {
      getPageAndSize(page, pageSize);
    },
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <div className={s.table}>
      <Table
        dataSource={list}
        columns={columns}
        pagination={pagination}
        loading={loadingFetchProject}
        // onRow={(record) => {
        //   return {
        //     onClick: () => {
        //     },
        //   };
        // }}
      />
      <CustomModal
        open={open}
        closeModal={closeModal}
        content={
          <ModalContent
            dispatch={dispatch}
            projectInfo={projectInfo}
            roleList={roleList}
            employeeList={employeeList}
            user={user}
            loading={loading}
            closeModal={closeModal}
          />
        }
        // width={750}
      />
    </div>
  );
};

export default TableComponent;
