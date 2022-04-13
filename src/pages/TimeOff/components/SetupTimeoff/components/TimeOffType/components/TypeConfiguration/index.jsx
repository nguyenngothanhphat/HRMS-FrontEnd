import React, { useEffect } from 'react';
import { Affix, Button, Col, Form, Row, Skeleton, Typography } from 'antd';
import { connect, history } from 'umi';
import styles from './index.less';
import { PageContainer } from '@/layouts/layout/src';
import LeaveType from './components/LeaveType';
import NoteComponent from './components/NoteComponent';
import Icon1 from '@/assets/timeOff/icon1.svg';
import EmploymentType from './components/EmploymentType';
import AccrualPolicy from './components/AccrualPolicy';
import AccrualStart from './components/AccrualStart';
import LeaveApplicationStart from './components/LeaveApplicationStart';
import MinimumLeaveAmount from './components/MinimumLeaveAmount';
import NegativeLeaveBalance from './components/NegativeLeaveBalance';

const TypeConfiguration = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    match: { params: { typeId = '' } = {} } = {},
    timeOff: { itemTimeOffType = {} } = {},
    loadingFetchTypeByID = false,
  } = props;

  const {
    name = '',
    accrualSetting: { accrualMethod = '', accuralRate = 0 } = {} || {},
    noOfDays = 0,
  } = itemTimeOffType || {};

  const fetchTypeById = () => {
    dispatch({
      type: 'timeOff/fetchTimeOffTypeById',
      payload: {
        _id: typeId,
      },
    });
  };

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const goBack = () => {
    history.push('/time-off/setup/types-rules');
  };

  const onFinish = (values) => {
    console.log('🚀  ~ values', values);
  };

  useEffect(() => {
    goToTop();
    fetchTypeById();
    return () => {
      dispatch({
        type: 'timeOff/save',
        payload: {
          itemTimeOffType: {},
        },
      });
    };
  }, []);

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.title}>Configure Leave Type</p>
        <p className={styles.description}>
          Please configure all the properties for the leave type below.
        </p>
      </div>
    );
  };

  const renderBottomBar = () => {
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={24}>
            <div className={styles.bottomBar__button}>
              <Button
                type="secondary"
                className={styles.bottomBar__button__secondary}
                onClick={goBack}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                className={styles.bottomBar__button__primary}
                form="timeOffType"
                htmlType="submit"
                key="submit"
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const renderContent = () => {
    const Note = {
      title: 'Note',
      icon: Icon1,
      data: (
        <Typography.Text>
          <span style={{ fontWeight: 500, color: '#000' }}>Leave Accrual</span> - the rate at which
          an employee accrues or earns paid time off.
          <br />
          <br />
          <span style={{ fontWeight: 500, color: '#000' }}>Carry Forward</span> - a concept where in
          an employee’s unutilized leaves from the current year can be carried forward to the next
          year. Carry forward is usually done at the end of a financial year.
        </Typography.Text>
      ),
    };

    const components = [
      {
        id: 1,
        component: <LeaveType />,
      },
      {
        id: 2,
        component: <EmploymentType />,
      },
      {
        id: 3,
        component: <AccrualPolicy />,
      },
      {
        id: 4,
        component: <AccrualStart />,
      },
      {
        id: 5,
        component: <LeaveApplicationStart />,
      },
      {
        id: 6,
        component: <MinimumLeaveAmount />,
      },
      {
        id: 7,
        component: <NegativeLeaveBalance />,
      },
    ];
    return (
      <div className={styles.content}>
        {renderHeader()}

        <Row gutter={[24, 24]}>
          <Col sm={24} lg={16}>
            {loadingFetchTypeByID || Object.keys(itemTimeOffType).length === 0 ? (
              <Skeleton />
            ) : (
              <Form
                name="timeOffType"
                form={form}
                initialValues={{ name, accrualMethod, accuralRate, noOfDays }}
                onFinish={onFinish}
              >
                <Row gutter={[24, 24]}>
                  {components.map((x) => (
                    <Col span={24}>{x.component}</Col>
                  ))}
                  <Col span={24}>{renderBottomBar()}</Col>
                </Row>
              </Form>
            )}
          </Col>
          <Col sm={24} lg={8}>
            <NoteComponent note={Note} />
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <PageContainer>
      <div className={styles.TypeConfiguration}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>Setup Timeoff policy</p>
          </div>
        </Affix>
        {renderContent()}
      </div>
    </PageContainer>
  );
};

export default connect(({ user: { permissions = {} }, timeOff, loading }) => ({
  permissions,
  timeOff,
  loadingFetchTypeByID: loading.effects['timeOff/fetchTimeOffTypeById'],
}))(TypeConfiguration);
