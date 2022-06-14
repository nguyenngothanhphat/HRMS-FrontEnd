import { Card, Col, DatePicker, Form, Input, Row, Switch } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { Link } from 'umi';
import SuccessIcon from '@/assets/offboarding/successIcon.png';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { dateFormat } from '@/utils/offboarding';
import styles from './index.less';

const SmallNotice = ({ text }) => {
  return (
    <div className={styles.SmallNotice}>
      <span>{text}</span>
    </div>
  );
};

const ClosingComment = (props) => {
  const [form] = Form.useForm();

  const { item = {} } = props;

  const [isCommentInputted, setIsCommentInputted] = useState(false);
  const [isLWDSelected, setIsLWDSelected] = useState(false);
  const [isRequestDifferentLWD, setIsRequestDifferentLWD] = useState(false);

  // functions
  const onValuesChange = (changedValues, allValues) => {
    setIsRequestDifferentLWD(allValues.requestDifferentLWD);
    setIsCommentInputted(!!allValues.comment);
    setIsLWDSelected(!!allValues.lastWorkingDate);
  };

  // render UI
  const renderContent = () => {
    return (
      <div gutter={[24, 16]} className={styles.content}>
        <Form
          layout="vertical"
          name="basic"
          form={form}
          id="myForm"
          preserve={false}
          onValuesChange={onValuesChange}
        >
          <Form.Item name="comment" rules={[{ required: true }]}>
            <Input.TextArea
              placeholder="Enter Closing Comments"
              autoSize={{ minRows: 4, maxRows: 7 }}
            />
          </Form.Item>
          <Row align="middle" gutter={[0, 16]}>
            <Col span={12}>
              <div className={styles.switchItem}>
                <Form.Item
                  name="canBeRehired"
                  valuePropName="checked"
                  style={{
                    display: 'inline',
                    marginBottom: 0,
                  }}
                >
                  <Switch defaultChecked={false} />
                </Form.Item>
                <span className={styles.titleText}>Can be rehired</span>
              </div>
            </Col>
            <Col span={10}>
              <SmallNotice text="This will remain private to yourself and the HR" />
            </Col>
            <Col span={2} />
            <Col span={12}>
              <div className={styles.switchItem}>
                <Form.Item
                  name="requestPlacement"
                  valuePropName="checked"
                  style={{
                    display: 'inline',
                    marginBottom: 0,
                  }}
                >
                  <Switch defaultChecked={false} />
                </Form.Item>
                <span className={styles.titleText}>Request placement</span>
              </div>
            </Col>
            <Col span={10}>
              <SmallNotice text="Please select Yes if you want the HR to discuss the resignation decision with the employee." />
            </Col>
            <Col span={2} />
            <Col span={12}>
              <div className={styles.switchItem}>
                <Form.Item
                  name="hr1On1Required"
                  valuePropName="checked"
                  style={{
                    display: 'inline',
                    marginBottom: 0,
                  }}
                >
                  <Switch defaultChecked={false} />
                </Form.Item>
                <span className={styles.titleText}>HR 1 on 1 required</span>
              </div>
            </Col>
            <Col span={10}>
              <SmallNotice text="Please select Yes if you want the HR to discuss the resignation decision with the employee." />
            </Col>
            <Col span={2} />

            <Col span={12}>
              <div className={styles.switchItem}>
                <Form.Item
                  name="requestDifferentLWD"
                  valuePropName="checked"
                  style={{
                    display: 'inline',
                    marginBottom: 0,
                  }}
                >
                  <Switch defaultChecked={false} />
                </Form.Item>
                <span className={styles.titleText}>Request a different LWD</span>
              </div>
            </Col>
            <Col span={10}>
              <SmallNotice text="Preferred LWD must be vetted by your reporting manager & approved by the HR manager to come into effective." />
            </Col>
            <Col span={2} />
          </Row>
          {isRequestDifferentLWD && (
            <Row
              align="middle"
              gutter={[0, 0]}
              style={{
                marginTop: 24,
              }}
            >
              <Col span={12}>
                <Form.Item
                  name="lastWorkingDate"
                  label="Last working date (Manager requested)"
                  rules={[{ required: true }]}
                >
                  <DatePicker format={dateFormat} />
                </Form.Item>
              </Col>
              <Col span={12} />
              <Col span={24}>
                <Form.Item name="notes" label="Notes" rules={[{ required: true }]}>
                  <Input.TextArea
                    placeholder="Reason for requesting a different LWD"
                    autoSize={{
                      minRows: 4,
                      maxRows: 7,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </div>
    );
  };

  const renderCurrentTime = () => {
    return (
      <div className={styles.currentTime}>
        <span>{moment().format(`${dateFormat} | h:mm a`)}</span>
      </div>
    );
  };

  const renderButtons = () => {
    const disabled = !isCommentInputted || (!isLWDSelected && isRequestDifferentLWD);
    return (
      <Row className={styles.actions} align="middle">
        <Col span={12}>
          <span className={styles.description}>
            By default notifications will be sent to HR, your manager and recursively loop to your
            department head.
          </span>
        </Col>
        <Col span={12}>
          <div className={styles.actions__buttons}>
            <CustomSecondaryButton title="Reject" disabled={disabled} />
            <CustomPrimaryButton title="Accept Resignation" disabled={disabled} />
          </div>
        </Col>
      </Row>
    );
  };

  const renderResult = () => {
    return (
      <div className={styles.result}>
        <img src={SuccessIcon} alt="" />
        <span>
          The employee resignation request has been Accepted by <Link to="">Lewis Nguyen</Link>
        </span>
      </div>
    );
  };
  return (
    <Card
      title="Add Closing comments from your 1 on 1 with the employee"
      className={styles.ClosingComment}
      extra={renderCurrentTime()}
    >
      {renderContent()}
      {renderButtons()}
      {renderResult()}
    </Card>
  );
};

export default ClosingComment;
