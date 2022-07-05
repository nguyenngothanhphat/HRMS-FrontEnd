import { Button, Card, Col, Form, Input, Row, Space, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import TooltipIcon from '@/assets/tooltip.svg';
import RegionsTable from './components/RegionsTable';
import styles from './index.less';

const JoiningFormalities = (props) => {
  const {
    // generatedId,
    // prefix,
    dispatch,
    loadingUpdateEmployeeId,
    location,
    settingId = {},
    // locationTotal: total,
  } = props;
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);

  const fetchTable = (p, l) => {
    dispatch({
      type: 'onboard/fetchIdGenerate',
      payload: {
        page: p,
        limit: l,
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
    fetchSettingEmpolyeeId(location._id);
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      generatedId: settingId?.idGenerate?.start,
      prefix: settingId?.idGenerate?.prefix,
    });
  }, [JSON.stringify(settingId)]);

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

  return (
    <div className={styles.employeeId}>
      <Card className={styles.content}>
        <Form form={form} name="employeeId" layout="vertical" onFinish={onFinish}>
          <Row gutter={[100, 24]}>
            <Col xs={24} lg={8} span={12}>
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
      <RegionsTable />
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
