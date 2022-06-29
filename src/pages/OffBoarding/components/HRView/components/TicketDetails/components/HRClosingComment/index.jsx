import { Card, Col, DatePicker, Form, Input, Row, Switch } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, connect } from 'umi';
import { isEmpty } from 'lodash';
import SuccessIcon from '@/assets/offboarding/successIcon.png';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { dateFormat, OFFBOARDING } from '@/utils/offboarding';
import LikeIcon from '@/assets/offboarding/like.svg';
import styles from './index.less';
import EditButton from '@/components/EditButton';

const HRClosingComment = (props) => {
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
    setIsEnterClosingComment = () => {},
  } = props;

  const { status: meetingStatus = '' } = meeting;
  const { manager = {} } = assigned;

  const type = 2;

  // render UI
  const renderContent = () => {
    return (
      <div gutter={[24, 16]} className={styles.content}>
        <Form layout="vertical" name="basic" form={form} id="myForm" preserve={false}>
          <Form.Item name="closingComments" rules={[{ required: true }]}>
            <Input.TextArea
              placeholder="Enter Closing Comments"
              autoSize={{ minRows: 4, maxRows: 7 }}
              maxLength={500}
            />
          </Form.Item>
        </Form>
        <div className={styles.notice}>
          <img src={LikeIcon} alt="like" />
          <span>
            Your comment for the 1-on-1 with Venkat has been recorded. Venkat and the HR manager
            will be able to view this comment.
          </span>
        </div>
      </div>
    );
  };

  const renderOptions = () => {
    return (
      <div className={styles.options}>
        <EditButton />
        <div className={styles.currentTime}>
          <span>{moment().format(`${dateFormat} | h:mm a`)}</span>
        </div>
      </div>
    );
  };

  const renderButtons = () => {
    return (
      <Row className={styles.actions} align="middle">
        <Col span={12} />
        <Col span={12}>
          <div className={styles.actions__buttons}>
            <CustomSecondaryButton onClick={() => setIsEnterClosingComment(false)}>
              Cancel
            </CustomSecondaryButton>
            <CustomPrimaryButton>Submit</CustomPrimaryButton>
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
