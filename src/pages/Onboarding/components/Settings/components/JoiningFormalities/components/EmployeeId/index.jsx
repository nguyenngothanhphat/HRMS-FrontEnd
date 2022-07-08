import { Button, Card, Col, Form, Input, Row, Space, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import TooltipIcon from '@/assets/tooltip.svg';
import RegionsTable from './components/RegionsTable';
import styles from './index.less';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';

const JoiningFormalities = (props) => {
  const { dispatch, loadingUpdateEmployeeId = false, location = '', settingId = {} } = props;
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);

  const getEmployeeIdFormatByLocation = (locationId) => {
    dispatch({
      type: 'onboard/getEmployeeIdFormatByLocation',
      payload: {
        location: locationId,
      },
    });
  };

  useEffect(() => {
    getEmployeeIdFormatByLocation(location._id);
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      generatedId: settingId?.idGenerate?.start,
      prefix: settingId?.idGenerate?.prefix,
    });
  }, [JSON.stringify(settingId)]);

  const onFinish = async (value) => {
    const { prefix, generatedId: start } = value;

    const response = await dispatch({
      type: 'onboard/updateEmployeeFormatByGlobal',
      payload: {
        prefix,
        start,
      },
    });
    const { statusCode = 0 } = response;
    if (statusCode === 200) {
      setIsEdit(false);
      dispatch({
        type: 'onboard/getEmployeeIdFormatList',
        payload: {
          page: 1,
          limit: 10,
        },
      });
    }
  };

  return (
    <div className={styles.employeeId}>
      <Card className={styles.content}>
        <Form form={form} name="employeeId" layout="vertical" onFinish={onFinish}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={
                  <div>
                    <>Prefix (Optional) </>{' '}
                    <Tooltip
                      title={
                        <div className={styles.contentTooltip}>
                          Would you like to include a string in front of the auto generated ID?
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
            <Col xs={24} lg={12}>
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
        </Form>
        {isEdit ? (
          <Space size={12}>
            <Button
              className={styles.btnCancel}
              onClick={() => {
                setIsEdit(false);
              }}
            >
              Cancel
            </Button>
            <CustomPrimaryButton
              htmlType="submit"
              form="employeeId"
              loading={loadingUpdateEmployeeId}
            >
              Save Changes
            </CustomPrimaryButton>
          </Space>
        ) : (
          <CustomPrimaryButton onClick={() => setIsEdit(true)}>Edit</CustomPrimaryButton>
        )}
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
      joiningFormalities: { listJoiningFormalities = [], idItem = '', settingId = {} } = {},
    },
  }) => ({
    loadingAdd: loading.effects['onboard/addJoiningFormalities'],
    loadingUpdate: loading.effects['onboard/updateJoiningFormalities'],
    loadingRemove: loading.effects['onboard/removeJoiningFormalities'],
    loadingUpdateEmployeeId: loading.effects['onboard/updateEmployeeFormatByLocation'],
    loadingGetEmployeeId: loading.effects['onboard/getSettingEmployeeId'],
    listJoiningFormalities,
    idItem,
    location,
    settingId,
  }),
)(JoiningFormalities);
