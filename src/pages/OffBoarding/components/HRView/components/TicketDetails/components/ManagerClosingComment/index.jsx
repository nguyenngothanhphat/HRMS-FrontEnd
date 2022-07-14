import { Card, Col, Form, Input, Row, Switch } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { dateFormat, getEmployeeName, OFFBOARDING } from '@/utils/offboarding';
import styles from './index.less';

const SmallNotice = ({ text }) => {
  return (
    <div className={styles.SmallNotice}>
      <span>{text}</span>
    </div>
  );
};

const ManagerClosingComment = (props) => {
  const [form] = Form.useForm();

  const {
    item: {
      hrStatus = '',
      meeting = {},
      assigned = {},
      managerNote: {
        closingComments = '',
        isRehired = false,
        isReplacement = false,
        isHrRequired = false,
        isRequestDifferent = false,
        notes = '',
        updatedAt = '',
      } = {},
      managerPickLWD = '',
    } = {},
    item = {},
  } = props;

  const { status: meetingStatus = '' } = meeting;

  useEffect(() => {
    if (!isEmpty(item)) {
      form.setFieldsValue({
        closingComments,
        isRehired,
        isReplacement,
        isHrRequired,
        isRequestDifferent,
        LWD: managerPickLWD ? moment(managerPickLWD) : null,
        notes,
      });
    }
  }, [JSON.stringify(item)]);

  // render UI
  const renderContent = () => {
    const disabled =
      hrStatus === OFFBOARDING.STATUS.REJECTED || meetingStatus === OFFBOARDING.MEETING_STATUS.DONE;
    return (
      <div gutter={[24, 16]} className={styles.content}>
        <Form layout="vertical" name="basic" form={form} id="managerClosingForm" preserve={false}>
          <Form.Item name="closingComments" rules={[{ required: true }]}>
            <Input.TextArea
              placeholder="Enter Closing Comments"
              autoSize={{ minRows: 4, maxRows: 7 }}
              maxLength={500}
              disabled
            />
          </Form.Item>
          <Row align="middle" gutter={[0, 16]}>
            <Col span={12}>
              <div className={styles.switchItem}>
                <Form.Item
                  name="isRehired"
                  valuePropName="checked"
                  style={{
                    display: 'inline',
                    marginBottom: 0,
                  }}
                >
                  <Switch defaultChecked={false} disabled={disabled} />
                </Form.Item>
                <span className={styles.titleText}>Can be rehired</span>
              </div>
            </Col>
            <Col span={10}>
              <SmallNotice text={`* This candidate can ${isRehired ? '' : 'not '}be rehired`} />
            </Col>
            <Col span={2} />
            <Col span={12}>
              <div className={styles.switchItem}>
                <Form.Item
                  name="isReplacement"
                  valuePropName="checked"
                  style={{
                    display: 'inline',
                    marginBottom: 0,
                  }}
                >
                  <Switch defaultChecked={false} disabled={disabled} />
                </Form.Item>
                <span className={styles.titleText}>Request placement</span>
              </div>
            </Col>
            <Col span={10}>
              <SmallNotice text="Choosing this option opens a ticket in the Recruitment module to hire a replacement." />
            </Col>
            <Col span={2} />
          </Row>
        </Form>
      </div>
    );
  };

  const renderTime = () => {
    const time = updatedAt ? moment(updatedAt) : moment();
    return (
      <div className={styles.currentTime}>
        <span>Last updated on {moment(time).format(`${dateFormat} | h:mm a`)}</span>
      </div>
    );
  };

  return (
    <Card
      title={`${getEmployeeName(
        assigned?.manager?.generalInfoInfo,
      )}’s Closing Comments from 1-on-1`}
      className={styles.ManagerClosingComment}
      extra={renderTime()}
    >
      {renderContent()}
    </Card>
  );
};

export default connect(({ offboarding }) => ({
  offboarding,
}))(ManagerClosingComment);
