import { Button, Card, Col, Form, Input, Row, Space, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CommonTable from '@/components/CommonTable';
import editIcon from '@/assets/projectManagement/edit2.svg';
import styles from './index.less';
import TooltipIcon from '@/assets/tooltip.svg';
import checkIcon from '@/assets/projectManagement/approveCheck.svg';
import cancelIcon from '@/assets/projectManagement/cancelX.svg';

const { TabPane } = Tabs;

const JoiningFormalities = (props) => {
  const {
    // listJoiningFormalities,
    // generatedId,
    // prefix,
    // idItem,
    // loadingAdd,
    // loadingUpdate,
    // loadingRemove,
    dispatch,
    loadingUpdateEmployeeId,
    loadingList,
    idGenerate,
    location,
    settingId = {},
  } = props;
  const [form] = Form.useForm();

  const fetchTable = (page = 1, limit = 10) => {
    dispatch({
      type: 'onboard/fetchIdGenerate',
      payload: {
        page,
        limit,
      },
    });
  };

  const fetchSettingEmpolyeeId = (locationId) => {
    dispatch({
      type: 'onboard/fetchIdbyLocation',
      payload: {
        location: locationId,
      },
    });
  };

  useEffect(() => {
    // dispatch({
    //   type: 'onboard/getSettingEmployeeId',
    // });
    fetchTable();
    fetchSettingEmpolyeeId(location._id);
    form.setFieldsValue({
      generatedId: settingId?.idGenerate?.start,
      prefix: settingId?.idGenerate?.prefix,
    });
  }, []);
  // useEffect(() => {
  //   if (!loadingAdd && !loadingUpdate && !loadingRemove)
  //     dispatch({
  //       type: 'onboard/getListJoiningFormalities',
  //     });
  // }, [loadingAdd, loadingUpdate, loadingRemove]);

  const [isEdit, setIsEdit] = useState(false);
  const [editAction, setEditAction] = useState(false);
  const [pageSelected, setPageSelected] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const onFinish = async (value) => {
    // const response = await dispatch({
    //   type: 'onboard/updateSettingEmployeeId',
    //   payload: {
    //     _id: idItem,
    //     ...value,
    //   },
    // });
    // const { statusCode = 0 } = response;
    // if (statusCode === 200) setIsEdit(false);
    const { prefix, generatedId: start } = value;
    const response = await dispatch({
      type: 'onboard/updateIdGenerate',
      payload: {
        location: {
          _id: location._id,
          prefix,
          start,
        },
      },
    });
    const { statusCode = 0 } = response;
    if (statusCode === 200) {
      setIsEdit(false);
      fetchTable();
    }
  };

  const Action = (record) => {
    return (
      <Space size={12} className={styles.groupBtn}>
        {editAction ? (
          <div>
            <Button type="link" shape="circle" onClick={console.log('hihi')}>
              <img src={checkIcon} alt="checkIcon" />
            </Button>
            <Button
              type="link"
              shape="circle"
              onClick={() => setEditAction(false)}
              icon={<img src={cancelIcon} alt="cancelIcon" />}
            />
          </div>
        ) : (
          <Button type="link" shape="circle" onClick={() => setEditAction(true)}>
            <img src={editIcon} alt="editIcon" />
          </Button>
        )}
      </Space>
    );
  };

  const columns = [
    {
      title: <div style={{ marginLeft: '10px' }}>Location</div>,
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (lo) => <div style={{ marginLeft: '10px' }}>{lo}</div>,
    },
    {
      title: 'Prefix (Optional)',
      dataIndex: 'prefix',
      key: 'prefix',
      width: 150,
      render: (_, row) => row?.idGenerate?.prefix,
    },
    {
      title: 'User ID Sequence Start',
      dataIndex: 'start',
      key: 'start',
      width: 150,
      render: (_, row) => row?.idGenerate?.start,
    },
    {
      title: <div style={{ marginRight: '10px' }}>Action</div>,
      key: 'action',
      width: 150,
      align: 'right',
      render: (_, row) => {
        return Action(row);
      },
    },
  ];

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
          setPageSize={setPageSize}
          setPageSelected={setPageSelected}
          list={idGenerate}
          columns={columns}
          //   pagination={false}
          loading={loadingList}
          isBackendPaging
        />
      </Card>
    </div>
  );
};
export default connect(
  ({
    loading,
    user: { currentUser: { location = '' } } = {},
    onboard: {
      joiningFormalities: {
        listJoiningFormalities = [],
        generatedId = '',
        prefix = '',
        idItem = '',
        idGenerate = [],
        settingId = {},
      } = {},
    },
  }) => ({
    loadingList: loading.effects['onboard/fetchIdGenerate'],
    loadingAdd: loading.effects['onboard/addJoiningFormalities'],
    loadingUpdate: loading.effects['onboard/updateJoiningFormalities'],
    loadingRemove: loading.effects['onboard/removeJoiningFormalities'],
    loadingUpdateEmployeeId: loading.effects['onboard/updateIdGenerate'],
    loadingGetEmployeeId: loading.effects['onboard/getSettingEmployeeId'],
    listJoiningFormalities,
    generatedId,
    prefix,
    idItem,
    idGenerate,
    location,
    settingId,
  }),
)(JoiningFormalities);
