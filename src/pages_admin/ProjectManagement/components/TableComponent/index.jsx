import React, { useState } from 'react';

import { formatMessage } from 'umi';
import { Table, Select } from 'antd';
import CustomModal from '@/components/CustomModal';
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

const dataSource = [
  {
    key: '1',
    projectId: '8097',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
  {
    key: '2',
    projectId: '8098',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
  {
    key: '3',
    projectId: '8099',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
  {
    key: '4',
    projectId: '8100',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
];

const columns = [
  {
    title: PROJECT_ID,
    dataIndex: 'projectId',
    key: 'projectId',
    align: 'center',
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
  },
  {
    title: PROJECT_MANAGER,
    dataIndex: 'projectManager',
    key: 'projectManager',
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
    align: 'center',
  },
  {
    title: MEMBERS,
    dataIndex: 'members',
    key: 'members',
    align: 'center',
    render() {
      return (
        <>
          <img style={{ cursor: 'pointer' }} src={dropbox} alt="dropbox" />
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

    render() {
      return (
        <>
          <span className={s.action}>view project</span>
        </>
      );
    },
  },
];

const rowSize = 10;

const TableComponent = (props) => {
  const { list = [] } = props;
  const [pageSelected, setPageSelected] = useState(1);
  const [currentRecord, setCurrentRecord] = useState(1);
  const [open, setOpen] = useState(true);

  const onChangePagination = (pageNumber) => {
    setPageSelected(pageNumber);
  };

  const pagination = {
    position: ['bottomLeft'],
    total: list.length,
    showTotal: (total, range) => (
      <span>
        {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
      </span>
    ),
    pageSize: rowSize,
    current: pageSelected,
    onChange: onChangePagination,
  };

  const closeModal = () => {
    setOpen(false);
  };

  const renderModalContent = () => {
    return <div>asdsad</div>;
  };

  return (
    <div className={s.table}>
      <Table
        dataSource={list}
        columns={columns}
        pagination={{ ...pagination, total: list.length }}
      />
      <CustomModal open={open} closeModal={closeModal} content={<ModalContent />} />
    </div>
  );
};

export default TableComponent;
