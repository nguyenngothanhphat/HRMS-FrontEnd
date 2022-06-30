import { Button, Card, Col, Form, Input, Row, Space, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CommonTable from '@/components/CommonTable';
import editIcon from '@/assets/edit-template-icon.svg';
import styles from './index.less';
import TooltipIcon from '@/assets/tooltip.svg';

const { TabPane } = Tabs;

const JoiningFormalities = (props) => {
  const {
    // listJoiningFormalities,
    // generatedId,
    // prefix,
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
      title: <div style={{ marginLeft: '10px' }}>Location</div>,
      dataIndex: 'location',
      key: 'location',
      width: 200,
      render: (location) => <div style={{ marginLeft: '10px' }}>{location}</div>,
    },
    {
      title: 'Prefix (Optional)',
      dataIndex: 'prefix',
      key: 'prefix',
      width: 150,
      render: (prefix) => prefix,
    },
    {
      title: 'User ID Sequence Start',
      dataIndex: 'generatedId',
      key: 'generatedId',
      width: 150,
      render: (generatedId) => generatedId?.generalInfoInfo?.legalName || '',
    },
    {
      title: <div style={{ marginRight: '10px' }}>Action</div>,
      key: 'action',
      width: 150,
      align: 'right',
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
          </Space>
        );
      },
    },
  ];

  //   form.setFieldsValue({ generatedId, prefix });

  return (
    <div className={styles.employeeId}>
      <Card className={styles.content}>
        <Form form={form} name="employeeId" layout="vertical" onFinish={onFinish}>
          <Row gutter={[100, 24]}>
            <Col xs={24} lg={8} span={12}>
              {/* Would you like to include a string infront of the auto generated Employee ID? */}
              <Form.Item
                label={
                  <div>
                    <>Prefix (Optional) </>{' '}
                    <Tooltip
                      title={
                        <div className={styles.contentTooltip}>
                          Would you like to include a string infront of the auto generated ID?
                        </div>
                      }
                      color="#fff"
                      placement="right"
                      overlayClassName={styles.tooltipOverlay}
                    >
                      <img className={styles.tooltip} alt="tool-tip" src={TooltipIcon} />
                    </Tooltip>
                  </div>
                }
                name="prefix"
              >
                <Input disabled={!isEdit} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8} span={12}>
              {/* From where would you like to start the Auto generated ID? */}
              <Form.Item
                label={
                  <div>
                    <> User ID Sequence Start</>{' '}
                    <Tooltip
                      title={
                        <div className={styles.contentTooltip}>
                          From where would you like to start the Auto generated ID?
                        </div>
                      }
                      color="#fff"
                      placement="right"
                      overlayClassName={styles.tooltipOverlay}
                    >
                      <img className={styles.tooltip} alt="tool-tip" src={TooltipIcon} />
                    </Tooltip>
                  </div>
                }
                name="generatedId"
              >
                <Input disabled={!isEdit} loading />
              </Form.Item>
            </Col>
          </Row>

          {isEdit ? (
            <Form.Item>
              <Space size={24}>
                <Button
                  className={styles.btnCancel}
                  onClick={() => {
                    setIsEdit(false);
                    // form.setFieldsValue({ prefix, generatedId });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  form="employeeId"
                  loading={loadingUpdateEmployeeId}
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
      </Card>

      <Card className={styles.checkList} title="Regions">
        <CommonTable
          //   size="small"
          //   dataSource={listJoiningFormalities}
          columns={columns}
          //   pagination={false}
          loading={loadingList}
        />
      </Card>
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
