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
      closingComments = '',
      isRehired = false,
      isReplacement = false,
      isHrRequired = false,
      isRequestDifferent = false,
      LWD = '',
      notes = '',
    } = {},
    item = {},
  } = props;

  const { status: meetingStatus = '' } = meeting;
  const { manager = {} } = assigned;

  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [action, setAction] = useState('');

  // functionalities
  const onDoneMeeting = async (action = '') => {
    setAction(action);
    const values = form.getFieldsValue();

    let payload = {
      id: _id,
      employeeId: employee?._id,
      closingComments: values.closingComments,
      isRehired: values.isRehired,
      isReplacement: values.isReplacement,
      isHrRequired: values.isHrRequired,
      isRequestDifferent: values.isRequestDifferent,
      action:
        action === 'reject'
          ? OFFBOARDING.UPDATE_ACTION.MANAGER_REJECT
          : OFFBOARDING.UPDATE_ACTION.MEETING_DONE,
    };

    if (values.isRequestDifferent) {
      payload = {
        ...payload,
        LWD: values.LWD,
        notes: values.notes,
      };
    }

    const res = await dispatch({
      type: 'offboarding/updateRequestEffect',
      payload,
    });
    if (res.statusCode === 200) {
      setNotificationModalVisible(true);
    }
  };

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

  useEffect(() => {
    if (!isEmpty(item)) {
      setIsRequestDifferentLWD(isRequestDifferent);
      setIsCommentInputted(!!closingComments);
      setIsLWDSelected(!!LWD);
      setIsNotesInputted(!!notes);

      form.setFieldsValue({
        closingComments,
        isRehired,
        isReplacement,
        isHrRequired,
        isRequestDifferent,
        LWD: LWD ? moment(LWD) : null,
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
              disabled={disabled}
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
            <Col span={12}>
              <div className={styles.switchItem}>
                <Form.Item
                  name="isHrRequired"
                  valuePropName="checked"
                  style={{
                    display: 'inline',
                    marginBottom: 0,
                  }}
                >
                  <Switch defaultChecked={false} disabled={disabled} />
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
                  name="isRequestDifferent"
                  valuePropName="checked"
                  style={{
                    display: 'inline',
                    marginBottom: 0,
                  }}
                >
                  <Switch defaultChecked={false} disabled={disabled} />
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
                  name="LWD"
                  label="Last working date (Manager requested)"
                  rules={[{ required: true }]}
                >
                  <DatePicker format={dateFormat} disabled={disabled} />
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

  const renderButtons = () => {
    if (
      meetingStatus === OFFBOARDING.MEETING_STATUS.DONE ||
      status === OFFBOARDING.STATUS.REJECTED
    ) {
      return null;
    }
    const disabled =
      !isCommentInputted || ((!isLWDSelected || !isNotesInputted) && isRequestDifferentLWD);

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
            <CustomSecondaryButton disabled={disabled} onClick={() => onDoneMeeting('reject')}>
              Reject
            </CustomSecondaryButton>
            <CustomPrimaryButton disabled={disabled} onClick={() => onDoneMeeting('accept')}>
              Accept Resignation
            </CustomPrimaryButton>
          </div>
        </Col>
      </Row>
    );
  };

  const renderResult = () => {
    if (status === OFFBOARDING.STATUS.REJECTED) {
      return (
        <div className={styles.result}>
          <img src={SuccessIcon} alt="" />
          <span>
            The employee resignation request has been Rejected by{' '}
            <Link to={`/directory/employee-profile/${manager?.generalInfoInfo?.userId}`}>
              {manager?.generalInfoInfo?.legalName}
            </Link>
          </span>
        </div>
      );
    }
    if (meetingStatus === OFFBOARDING.MEETING_STATUS.DONE) {
      return (
        <div className={styles.result}>
          <img src={SuccessIcon} alt="" />
          <span>
            The employee resignation request has been Accepted by{' '}
            <Link to={`/directory/employee-profile/${manager?.generalInfoInfo?.userId}`}>
              {manager?.generalInfoInfo?.legalName}
            </Link>
          </span>
        </div>
      );
    }

    return null;
  };

  const renderModals = () => {
    return (
      <div>
        <NotificationModal
          visible={notificationModalVisible}
          onClose={() => setNotificationModalVisible(false)}
          description={
            action === 'accept'
              ? 'Your acceptance of the request has been recorded and all the concerned parties will be notified'
              : 'Your rejection of the request has been recorded and all the concerned parties will be notified'
          }
          buttonText="Ok"
        />
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
      {renderModals()}
    </Card>
  );
};

export default connect(({ offboarding }) => ({
  offboarding,
}))(ClosingComment);
