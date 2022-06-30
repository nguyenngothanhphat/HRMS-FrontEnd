import { Card, Col, DatePicker, Form, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import CheckIcon from '@/assets/offboarding/check.svg';
import FailedIcon from '@/assets/offboarding/fail.svg';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { dateFormat, OFFBOARDING } from '@/utils/offboarding';
import styles from './index.less';

const RequestDifferentLWD = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    item: {
      _id = '',
      employee = {},
      assigned = {},
      managerNote: { notes = '' } = {},
      hrNote = {},
      hrNote: { closingComments: hrClosingComments = '', isAcceptLWD = false } = {},
      managerPickLWD = '',
    } = {},
    loadingButton = false,
  } = props;

  const [action, setAction] = useState('');

  useEffect(() => {
    if (managerPickLWD) {
      form.setFieldsValue({
        LWD: moment(managerPickLWD),
      });
    }
  }, [managerPickLWD]);

  const onActionLWD = (actionProp = '') => {
    setAction(actionProp);
    const payload = {
      id: _id,
      employeeId: employee?._id,
      action:
        actionProp === 'accept'
          ? OFFBOARDING.UPDATE_ACTION.ACCEPT_MANAGER_LWD
          : OFFBOARDING.UPDATE_ACTION.REJECT_MANAGER_LWD,
    };

    dispatch({
      type: 'offboarding/updateRequestEffect',
      payload,
    });
  };

  // render UI
  const renderResult = () => {
    if (hrNote.isAcceptLWD === undefined) {
      return null;
    }
    if (isAcceptLWD) {
      return (
        <div className={styles.lwdApproved}>
          <img src={CheckIcon} alt="" />
          <span>
            LWD Approved by{' '}
            <Link to={`/directory/employee-profile/${assigned.hr?.generalInfoInfo?.userId}`}>
              {assigned.hr?.generalInfoInfo?.legalName}
            </Link>
          </span>
        </div>
      );
    }
    return (
      <div className={styles.lwdApproved}>
        <img src={FailedIcon} alt="" />
        <span>
          LWD Rejected by{' '}
          <Link to={`/directory/employee-profile/${assigned.hr?.generalInfoInfo?.userId}`}>
            {assigned.hr?.generalInfoInfo?.legalName}
          </Link>
        </span>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div gutter={[24, 16]} className={styles.content}>
        <Form layout="vertical" name="basic" form={form} id="lwdForm" preserve={false}>
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
        {renderResult()}
      </div>
    );
  };

  const renderButtons = () => {
    const disabled = !hrClosingComments;

    if (hrNote.isAcceptLWD !== undefined) {
      return null;
    }
    return (
      <Row className={styles.actions} align="middle">
        <Col span={12} />
        <Col span={12}>
          <div className={styles.actions__buttons}>
            <CustomSecondaryButton
              disabled={disabled}
              onClick={() => onActionLWD('reject')}
              loading={loadingButton && action === 'reject'}
            >
              Reject
            </CustomSecondaryButton>
            <CustomPrimaryButton
              disabled={disabled}
              onClick={() => onActionLWD('accept')}
              loading={loadingButton && action === 'accept'}
            >
              Accept
            </CustomPrimaryButton>
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

export default connect(({ offboarding, loading }) => ({
  offboarding,
  loadingButton: loading.effects['offboarding/updateRequestEffect'],
}))(RequestDifferentLWD);
