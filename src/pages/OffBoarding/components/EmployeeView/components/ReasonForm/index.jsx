import { Button, Col, DatePicker, Divider, Input, Row, Tabs, Form } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import { PageContainer } from '@/layouts/layout/src';
import CommonModal from '@/components/CommonModal';
import ModalImage from './assets/modalImage1.png';
import ViewRightNote from '../ViewRightNote';
import styles from './index.less';

const { TextArea } = Input;
const { TabPane } = Tabs;

const ReasonForm = (props) => {
  const { dispatch } = props;
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [statusState, setStatusState] = useState('');
  const [value, setValue] = useState('');

  const onFinish = ({ reason = '', LWD = '' }) => {
    const formatLWD = LWD.format('MM/DD/YYYY') || '';
    const payload = {
      reason,
      LWD: formatLWD,
    };
    if (statusState === 'DRAFT') {
      payload.status = 'DRAFT';
    }
    dispatch({
      type: 'offboarding/offboardingRequest',
      payload,
    });
  };
  const renderContent = () => {
    return (
      <Row gutter={[24, 24]}>
        <Col span={17}>
          <div className={styles.containerReasonForm}>
            <Form
              name="myForm"
              onFinish={onFinish}
              className={styles.container}
              initialValues={{
                LWD: moment.utc().add(90, 'days'),
              }}
            >
              <div className={styles.title}>What is the reason for leaving us ?</div>
              <Form.Item name="reason" rules={[{ required: true }]}>
                <TextArea
                  onChange={(e) => setValue(e.target.value)}
                  className={styles.boxReason}
                  placeholder="The reason I have decided to end my journey with Terralogic here is because…"
                />
              </Form.Item>

              <div className={styles.titleTentactive}>
                Tentative Last Working Date (System generated)
              </div>
              <div className={styles.lastWorkingDay}>
                <Form.Item name="LWD">
                  <DatePicker disabled />
                </Form.Item>

                <div className={styles.textTentacive}>
                  <p>
                    The LWD is auto generated as per our{' '}
                    <span style={{ textDecoration: 'underline', fontWeight: 500 }}>
                      Standard Offboarding Policy
                    </span>
                  </p>
                </div>
              </div>
              <Divider />
              <div className={styles.containerBtn}>
                <div className={styles.titleBtn}>
                  By default notifications will be sent to the HR, your manager and recursively loop
                  to your department head.
                </div>
                <div>
                  <Button
                    className={styles.btnDraft}
                    htmlType="submit"
                    onClick={() => setStatusState('DRAFT')}
                    disabled={!value}
                  >
                    Save to Draft
                  </Button>
                  <Button
                    className={styles.btnSubmit}
                    htmlType="submit"
                    onClick={() => setStatusState('Submit')}
                    disabled={!value}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Col>
        <Col span={7}>
          <ViewRightNote />
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
      <CommonModal
        firstText="Ok"
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        // onFinish={handleCloseModal}
        buttonText="Close"
        width={400}
        hasCancelButton={false}
        hasHeader={false}
        content={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 24,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={ModalImage} alt="" />
            <span style={{ textAlign: 'center' }}>
              Your request has been submitted. Please set a 1-1 with your manager
            </span>
          </div>
        }
      />
    </PageContainer>
  );
};

export default ReasonForm;
