import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tabs, Form, Input } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import deleteIcon from '@/assets/delete.svg';
import editIcon from '@/assets/edit-template-icon.svg';
import plusIcon from '@/assets/add-adminstrator.svg';
import styles from './index.less';
import ModalDelete from './components/ModalDelete/index';
import ModalAdd from './components/ModalAdd/index';
import EmployeeId from './components/EmployeeId';

const { TabPane } = Tabs;

const JoiningFormalities = (props) => {
  const {
    listJoiningFormalities,
    generatedId,
    prefix,
    idItem,
    loadingAdd,
    loadingUpdate,
    loadingRemove,
    dispatch,
    loadingUpdateEmployeeId,
    loadingList,
  } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch({
      type: 'onboard/getSettingEmployeeId',
    });
  }, []);
  useEffect(() => {
    if (!loadingAdd && !loadingUpdate && !loadingRemove)
      dispatch({
        type: 'onboard/getListJoiningFormalities',
      });
  }, [loadingAdd, loadingUpdate, loadingRemove]);

  const [openModal, setOpenModal] = useState('');
  const [item, setItem] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const onClose = () => {
    setOpenModal('');
    setItem({});
  };
  const onClickBtn = (mode, record = {}) => {
    setOpenModal(mode);
    setItem(record);
  };

  const onFinish = async (value) => {
    const response = await dispatch({
      type: 'onboard/updateSettingEmployeeId',
      payload: {
        _id: idItem,
        ...value,
      },
    });
    const { statusCode = 0 } = response;
    if (statusCode === 200) setIsEdit(false);
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
      render: (createdAt) => moment(createdAt).format('DD.MM.YY'),
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
          <Space size={12} className={styles.groupBtn}>
            <Button
              type="link"
              shape="circle"
              size={24}
              className={styles.btn}
              onClick={() => onClickBtn('edit', record)}
            >
              <img src={editIcon} alt="editIcon" />
            </Button>
            <Button
              type="link"
              shape="circle"
              size={24}
              className={styles.btn}
              onClick={() => onClickBtn('delete', record)}
            >
              <img src={deleteIcon} alt="deleteIcon" />
            </Button>
          </Space>
        );
      },
    },
  ];

  form.setFieldsValue({ generatedId, prefix });

  return (
    <div className={styles.page}>
      <Tabs defaultActiveKey="1">
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
          {/* <div className={styles.employeeId}>
            <Form form={form} name="employeeId" layout="vertical" onFinish={onFinish}>
              <div className={styles.question}>
                From where would you like to start the Auto generated ID?
              </div>
              <Form.Item label="Auto generated ID" name="generatedId">
                <Input disabled={!isEdit} loading />
              </Form.Item>
              <div className={styles.question}>
                Would you like to include a string infront of the auto generated Employee ID?
              </div>
              <Form.Item label="Prefix" name="prefix">
                <Input disabled={!isEdit} />
              </Form.Item>
              {isEdit ? (
                <Form.Item>
                  <Space size={24}>
                    <Button
                      className={styles.btnCancel}
                      onClick={() => {
                        setIsEdit(false);
                        form.setFieldsValue({ prefix, generatedId });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      form="employeeId"
                      loading={loadingUpdateEmployeeId}
                      // onClick={form.submit}
                    >
                      Save Changes
                    </Button>
                  </Space>
                </Form.Item>
              ) : (
                <Form.Item>
                  <Button type="primary" onClick={() => setIsEdit(true)}>
                    Edit
                  </Button>
                </Form.Item>
              )}
            </Form>
          </div> */}
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
    loadingUpdateEmployeeId: loading.effects['onboard/updateSettingEmployeeId'],
    loadingGetEmployeeId: loading.effects['onboard/getSettingEmployeeId'],
    listJoiningFormalities,
    generatedId,
    prefix,
    idItem,
  }),
)(JoiningFormalities);
