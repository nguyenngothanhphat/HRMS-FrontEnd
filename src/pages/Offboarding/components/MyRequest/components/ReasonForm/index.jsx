import { Col, DatePicker, Divider, Form, Input, notification, Row, Tabs } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import NotificationModal from '@/components/NotificationModal';
import { DATE_FORMAT, OFFBOARDING } from '@/constants/offboarding';
import { PageContainer } from '@/layouts/layout/src';
import { goToTop, getCompanyName } from '@/utils/utils';
import Notes from '../Notes';
import styles from './index.less';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { STATUS } = OFFBOARDING;

const ReasonForm = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    viewingRequest: { reason: reasonProps = '', status = '' } = {},
    match: { params: { reId = '', action = '' } = {} },
    loading = false,
    employee: { managerInfo: { legalName: name = '' } = {} } = {},
  } = props;
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [statusState, setStatusState] = useState('');
  const [value, setValue] = useState('');

  const onFinish = ({ reason = '', LWD = '' }) => {
    const formatLWD = LWD.format(DATE_FORMAT_MDY) || '';
    const payload = {
      reason,
      LWD: formatLWD,
    };
    if (statusState === STATUS.DRAFT) {
      payload.status = STATUS.DRAFT;
    }
    dispatch({
      type: 'offboarding/createRequestEffect',
      payload,
    }).then((res) => {
      const { statusCode = '' } = res;
      if (statusCode === 200 && statusState !== STATUS.DRAFT) {
        setSuccessModalVisible(true);
      } else if (statusCode === 200) {
        notification.success({ message: `Save to Draft` });
        history.push('/offboarding');
      }
    });
  };

  const handleOk = () => {
    setSuccessModalVisible(false);
    history.push('/offboarding');
  };

  const setFormValuesDebounce = debounce((values) => {
    setValue(values);
  }, 500);

  const onValuesChange = (values) => {
    setFormValuesDebounce(values);
  };

  useEffect(() => {
    if (reId) {
      dispatch({
        type: 'offboarding/getRequestByIdEffect',
        payload: {
          offBoardingId: reId,
        },
      });
    }
    goToTop();
  }, [reId]);

  useEffect(() => {
    form.resetFields();
  }, [reasonProps]);

  const renderContent = () => {
    return (
      <Row gutter={[24, 24]}>
        <Col span={24} lg={16}>
          <div className={styles.containerReasonForm}>
            <Form
              name="myForm"
              form={form}
              onFinish={onFinish}
              className={styles.container}
              initialValues={{
                LWD: moment.utc().add(90, 'days'),
                reason: action === 'edit' ? reasonProps : '',
              }}
            >
              <div style={{ padding: '24px' }}>
                <div className={styles.title}>
                  What is the reason for leaving {getCompanyName()} ?
                </div>
                <Form.Item name="reason" rules={[{ required: true }]}>
                  <TextArea
                    onChange={(e) => onValuesChange(e.target.value)}
                    className={styles.boxReason}
                    placeholder="The reason I have decided to end my journey with Terralogic here is because…"
                  />
                </Form.Item>

                <div className={styles.titleTentative}>
                  Tentative Last Working Date (System generated)
                </div>
                <div className={styles.lastWorkingDay}>
                  <Form.Item name="LWD">
                    <DatePicker disabled format={DATE_FORMAT} />
                  </Form.Item>

                  <div className={styles.textTentative}>
                    <span>
                      The LWD is generated as per a 90 days period according to our{' '}
                      <span style={{ textDecoration: 'underline', fontWeight: 500 }}>
                        Standard Offboarding Policy
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <Divider />
              <div className={styles.footer}>
                <div className={styles.titleFooter}>
                  By default notifications will be sent to the HR, your manager and recursively loop
                  to your department head.
                </div>
                <div className={styles.containerBtn}>
                  <CustomSecondaryButton
                    htmlType="submit"
                    onClick={() => setStatusState('DRAFT')}
                    disabled={status !== STATUS.DRAFT ? !value : !reasonProps}
                    loading={loading && statusState === 'DRAFT'}
                  >
                    Save to Draft
                  </CustomSecondaryButton>
                  <CustomPrimaryButton
                    htmlType="submit"
                    onClick={() => setStatusState('Submit')}
                    disabled={status !== STATUS.DRAFT ? !value : !reasonProps}
                    loading={loading && statusState === 'Submit'}
                  >
                    Submit
                  </CustomPrimaryButton>
                </div>
              </div>
            </Form>
          </div>
        </Col>
        <Col span={24} lg={8}>
          <Notes />
        </Col>
      </Row>
    );
  };
  return (
    <PageContainer>
      <div className={styles.ReasonForm}>
        <div className={styles.tabs}>
          <Tabs activeKey="list">
            <TabPane tab="Terminate work relationship" key="list">
              <div className={styles.paddingContainer}>
                <div className={styles.root}>{renderContent()}</div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <NotificationModal
        visible={successModalVisible}
        onClose={handleOk}
        buttonText="Ok"
        secondDescription="Your request has been submitted."
        description={`To continue please setup a 1-on-1 with your Manager ${name}`}
      />
    </PageContainer>
  );
};

export default connect(
  ({
    offboarding: { viewingRequest = {} } = {},
    loading,
    user: { currentUser: { employee = {} } = {} } = {},
  }) => ({
    viewingRequest,
    employee,
    loadingStatus: loading.effects['offboarding/getMyRequestEffect'],
    loading: loading.effects['offboarding/createRequestEffect'],
  }),
)(ReasonForm);
