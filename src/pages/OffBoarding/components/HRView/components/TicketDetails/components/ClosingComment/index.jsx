import { Card, Col, DatePicker, Form, Input, Row, Switch } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, connect } from 'umi';
import { isEmpty } from 'lodash';
import SuccessIcon from '@/assets/offboarding/successIcon.png';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { dateFormat, OFFBOARDING } from '@/utils/offboarding';
import NotificationModal from '@/components/NotificationModal';
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

  const {
    dispatch,
    item: {
      _id = '',
      employee = {},
      status = '',
      meeting = {},
      assigned = {},
      managerNote: {
        closingComments = '',
        isRehired = false,
        isReplacement = false,
        isHrRequired = false,
        isRequestDifferent = false,
        notes = '',
      } = {},
      managerPickLWD = '',
    } = {},
    item = {},
  } = props;

  const { status: meetingStatus = '' } = meeting;

  const [action, setAction] = useState('');
  const [isCommentInputted, setIsCommentInputted] = useState(false);
  const [isNotesInputted, setIsNotesInputted] = useState(false);
  const [isLWDSelected, setIsLWDSelected] = useState(false);
  const [isRequestDifferentLWD, setIsRequestDifferentLWD] = useState(false);

  // functions
  const onValuesChange = (changedValues, allValues) => {
    setIsRequestDifferentLWD(!!allValues.isRequestDifferent);
    setIsCommentInputted(!!allValues.closingComments);
    setIsLWDSelected(!!allValues.LWD);
    setIsNotesInputted(!!allValues.notes);
  };

  const disabledLWD = (current) => {
    const customDate = moment().format(dateFormat);
    return current && current < moment(customDate, dateFormat);
  };

  useEffect(() => {
    if (!isEmpty(item)) {
      setIsRequestDifferentLWD(isRequestDifferent);
      setIsCommentInputted(!!closingComments);
      setIsLWDSelected(!!managerPickLWD);
      setIsNotesInputted(!!notes);

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
      status === OFFBOARDING.STATUS.REJECTED || meetingStatus === OFFBOARDING.MEETING_STATUS.DONE;
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
              <SmallNotice text="This will remain private to yourself and the HR" />
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
              <SmallNotice text="Please select Yes if you want the HR to discuss the resignation decision with the employee." />
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
                  name="LWD"
                  label="Last working date (Manager requested)"
                  rules={[{ required: true }]}
                >
                  <DatePicker format={dateFormat} disabled={disabled} disabledDate={disabledLWD} />
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
                    maxLength={500}
                    disabled={disabled}
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

  return (
    <Card
      title="Sandeep Gupta’s Closing Comments from 1-on-1"
      className={styles.ClosingComment}
      extra={renderCurrentTime()}
    >
      {renderContent()}
    </Card>
  );
};

export default connect(({ offboarding }) => ({
  offboarding,
}))(ClosingComment);
