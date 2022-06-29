import { Card, Col, DatePicker, Form, Input, Row, Switch } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, connect } from 'umi';
import { isEmpty } from 'lodash';
import CheckIcon from '@/assets/offboarding/check.svg';
import FailedIcon from '@/assets/offboarding/failedIcon.svg';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { dateFormat, OFFBOARDING } from '@/utils/offboarding';
import NotificationModal from '@/components/NotificationModal';
import styles from './index.less';

const RequestDifferentLWD = (props) => {
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

  useEffect(() => {
    if (managerPickLWD) {
      form.setFieldsValue({
        LWD: moment(managerPickLWD),
      });
    }
  }, [managerPickLWD]);

  // render UI
  const renderContent = () => {
    return (
      <div gutter={[24, 16]} className={styles.content}>
        <Form layout="vertical" name="basic" form={form} id="myForm" preserve={false}>
          <Row align="middle" gutter={[0, 0]}>
            <Col span={12}>
              <Form.Item name="LWD" label="Last working date">
                <DatePicker format={dateFormat} disabled />
              </Form.Item>
            </Col>
            <Col span={12} />
          </Row>
        </Form>
        <div className={styles.item}>
          <span className={styles.title}>Reason for requesting a different LWD</span>
          <p>{notes || 'None'}</p>
        </div>
        <div className={styles.lwdApproved}>
          <img src={CheckIcon} alt="" />
          <span>
            LWD Approved by{' '}
            <Link to={`/directory/employee-profile/${assigned.hr?.generalInfoInfo?.userId}`}>
              {assigned.hr?.generalInfoInfo?.legalName}
            </Link>
          </span>
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
            <CustomSecondaryButton>Reject</CustomSecondaryButton>
            <CustomPrimaryButton>Accept</CustomPrimaryButton>
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <Card title="Manager Requested a different LWD" className={styles.RequestDifferentLWD}>
      {renderContent()}
      {renderButtons()}
    </Card>
  );
};

export default connect(({ offboarding }) => ({
  offboarding,
}))(RequestDifferentLWD);
