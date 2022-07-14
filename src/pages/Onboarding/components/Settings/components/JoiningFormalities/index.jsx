import { Form, Space, Table, Tabs } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import editIcon from '@/assets/onboarding/editIcon.svg';
import deleteIcon from '@/assets/onboarding/delete.svg';
import plusIcon from '@/assets/add-adminstrator.svg';
import EmployeeId from './components/EmployeeId';
import ModalAdd from './components/ModalAdd/index';
import ModalDelete from './components/ModalDelete/index';
import styles from './index.less';

const { TabPane } = Tabs;

const JoiningFormalities = (props) => {
  const {
    listJoiningFormalities,
    generatedId,
    prefix,
    loadingAdd,
    loadingUpdate,
    loadingRemove,
    dispatch,
    loadingList,
  } = props;
  const [form] = Form.useForm();

  const fetchCheckListEffect = () => {
    dispatch({
      type: 'onboard/getListJoiningFormalities',
    });
  };

  useEffect(() => {
    if (!loadingAdd && !loadingUpdate && !loadingRemove) {
      fetchCheckListEffect();
    }
  }, [loadingAdd, loadingUpdate, loadingRemove]);

  const [openModal, setOpenModal] = useState('');
  const [item, setItem] = useState({});
  const [activeKey, setActiveKey] = useState('1');

  const onClose = () => {
    setOpenModal('');
    setItem({});
  };
  const onClickBtn = (mode, record = {}) => {
    setOpenModal(mode);
    setItem(record);
  };

  const columns = [
    {
      title: <div style={{ marginLeft: '10px' }}>Name</div>,
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name) => <div style={{ marginLeft: '10px' }}>{name}</div>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'Description',
      width: 250,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt) => moment(createdAt).format('MM/DD/YYYY'),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
      render: (createdBy) => (
        <div className={styles.blueText}>{createdBy?.generalInfoInfo?.legalName || ''}</div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => {
        return (
          <Space size={4} className={styles.groupBtn}>
            <img src={editIcon} alt="editIcon" onClick={() => onClickBtn('edit', record)} />
            <img src={deleteIcon} alt="deleteIcon" onClick={() => onClickBtn('delete', record)} />
          </Space>
        );
      },
    },
  ];

  form.setFieldsValue({ generatedId, prefix });

  return (
    <div className={styles.page}>
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)} destroyInactiveTabPane>
        <TabPane tab="Checklist" key="1">
          <div className={styles.checkList}>
            <Table
              size="small"
              dataSource={listJoiningFormalities}
              columns={columns}
              pagination={false}
              loading={loadingList}
            />
            <div className={styles.footer}>
              <div className={styles.footer__btn} onClick={() => setOpenModal('add')}>
                <img src={plusIcon} alt="plusIcon" />
                <span className={styles.text}>Add New Checklist</span>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Employee ID" key="2">
          <EmployeeId />
        </TabPane>
      </Tabs>

      <ModalDelete openModal={openModal === 'delete'} onCancel={onClose} item={item} />
      <ModalAdd
        openModal={openModal === 'add' || openModal === 'edit'}
        onCancel={onClose}
        mode={openModal}
        item={item}
      />
    </div>
  );
};
export default connect(
  ({
    loading,
    onboard: {
      joiningFormalities: {
        listJoiningFormalities = [],
        generatedId = '',
        prefix = '',
        idItem = '',
      } = {},
    },
  }) => ({
    loadingList: loading.effects['onboard/getListJoiningFormalities'],
    loadingAdd: loading.effects['onboard/addJoiningFormalities'],
    loadingUpdate: loading.effects['onboard/updateJoiningFormalities'],
    loadingRemove: loading.effects['onboard/removeJoiningFormalities'],
    listJoiningFormalities,
    generatedId,
    prefix,
    idItem,
  }),
)(JoiningFormalities);
