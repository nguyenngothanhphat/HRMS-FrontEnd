import { Card, Col, Form, Input, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import LikeIcon from '@/assets/offboarding/like.svg';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import EditButton from '@/components/EditButton';
import { dateFormat, getEmployeeName, OFFBOARDING } from '@/utils/offboarding';
import styles from './index.less';

const HRClosingComment = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    item: { _id = '', employee = {}, hrNote: { closingComments = '' } = {} } = {},
    isEnterClosingComment = false,
    setIsEnterClosingComment = () => {},
  } = props;

  // functionalities
  const onEnterComment = async (values) => {
    const payload = {
      id: _id,
      employeeId: employee?._id,
      closingComments: values.closingComments,
      action: OFFBOARDING.UPDATE_ACTION.HR_COMMENT,
    };

    const res = await dispatch({
      type: 'offboarding/updateRequestEffect',
      payload,
    });
    if (res.statusCode === 200) {
      setIsEnterClosingComment(false);
    }
  };

  // render UI
  const renderContent = () => {
    const employeeName = getEmployeeName(employee.generalInfoInfo);
    return (
      <div gutter={[24, 16]} className={styles.content}>
        <Form
          layout="vertical"
          name="basic"
          form={form}
          id="closingForm"
          preserve={false}
          onFinish={onEnterComment}
          initialValues={{
            closingComments,
          }}
        >
          <Form.Item name="closingComments" rules={[{ required: true }]}>
            <Input.TextArea
              placeholder="Enter Closing Comments"
              autoSize={{ minRows: 4, maxRows: 7 }}
              maxLength={500}
              disabled={!isEnterClosingComment}
            />
          </Form.Item>
        </Form>
        {closingComments && (
          <div className={styles.notice}>
            <img src={LikeIcon} alt="like" />
            <span>
              Your comment for the 1-on-1 with {employeeName} has been recorded. {employeeName} and
              the HR manager will be able to view this comment.
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderOptions = () => {
    return (
      <div className={styles.options}>
        {!isEnterClosingComment && <EditButton onClick={() => setIsEnterClosingComment(true)} />}
        <div className={styles.currentTime}>
          <span>{moment().format(`${dateFormat} | h:mm a`)}</span>
        </div>
      </div>
    );
  };

  const renderButtons = () => {
    if (!isEnterClosingComment) return null;
    return (
      <Row className={styles.actions} align="middle">
        <Col span={12} />
        <Col span={12}>
          <div className={styles.actions__buttons}>
            <CustomSecondaryButton onClick={() => setIsEnterClosingComment(false)}>
              Cancel
            </CustomSecondaryButton>
            <CustomPrimaryButton form="closingForm" htmlType="submit">
              Submit
            </CustomPrimaryButton>
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <Card
      title="Your Closing Comments from 1-on-1"
      className={styles.HRClosingComment}
      extra={renderOptions()}
    >
      {renderContent()}
      {renderButtons()}
    </Card>
  );
};

export default connect(({ offboarding }) => ({
  offboarding,
}))(HRClosingComment);
