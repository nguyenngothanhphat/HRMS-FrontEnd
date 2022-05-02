import React, { useEffect, useState } from 'react';
import { Affix, Button, Col, Form, message, Row, Skeleton, Typography } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import styles from './index.less';
import { PageContainer } from '@/layouts/layout/src';
import LeaveTypeName from './components/LeaveTypeName';
import NoteComponent from '@/components/NoteComponent';
import Icon1 from '@/assets/timeOff/icon1.svg';
import EmploymentType from './components/EmploymentType';
import AccrualPolicy from './components/AccrualPolicy';
import AccrualStart from './components/AccrualStart';
import LeaveApplicationStart from './components/LeaveApplicationStart';
import MinimumLeaveAmount from './components/MinimumLeaveAmount';
import NegativeLeaveBalance from './components/NegativeLeaveBalance';
import NewHireProrationPolicy from './components/NewHireProrationPolicy';
import AnnualResetPolicy from './components/AnnualResetPolicy';
import CarryForwardPolicy from './components/CarryForwardPolicy';
import LOP from './components/LOP';
import MaximumBalanceAllowed from './components/MaximumBalanceAllowed';
import NoticePeriodLeaveAccrualPolicy from './components/NoticePeriodLeaveAccrualPolicy';

import { FORM_ITEM_NAME } from '@/utils/timeOff';
import { goToTop } from '@/utils/utils';
import { getCurrentLocation, getCurrentTenant } from '@/utils/authority';

const {
  TIMEOFF_TYPE_NAME,

  EMPLOYEE_TYPE,

  ACCRUAL_POLICY,
  ACCRUAL_METHOD,
  ACCRUAL_RATE,
  ACCRUAL_POLICY_ACCRUAL_METHOD,
  ACCRUAL_POLICY_ACCRUAL_RATE,

  ACCRUAL_START,
  ACCRUAL_START_VALUE,
  ACCRUAL_START_UNIT,

  MINIMUM_LEAVE_AMOUNT,
  MINIMUM_LEAVE_AMOUNT_VALUE,

  LEAVE_APPLICATION_START,
  LEAVE_APPLICATION_START_VALUE,

  NEGATIVE_LEAVE_BALANCE,
  NEGATIVE_LEAVE_BALANCE_ALLOWED,
  NEGATIVE_LEAVE_BALANCE_MAXIMUM_UNIT,
  NEGATIVE_LEAVE_BALANCE_MAXIMUM_VALUE,

  NEW_HIRE_PRORATION_POLICY,

  LOP_LEAVE_ACCRUAL_POLICY,

  MAXIMUM_BALANCE_ALLOWED,
  MAXIMUM_BALANCE_ALLOWED_UNIT,
  MAXIMUM_BALANCE_ALLOWED_VALUE,

  ANNUAL_RESET_POLICY,
  ANNUAL_RESET_POLICY_RESET_TYPE,
  ANNUAL_RESET_POLICY_CALENDAR_DATE,

  NOTICE_PERIOD_LEAVE_ACCRUAL_POLICY,

  CARRY_FORWARD_POLICY,
  CARRY_FORWARD_CAP,
  MAXIMUM_CARRY_FORWARD_VALUE,

  VALUE,
  UNIT,
  ALLOWED,
  FROM,
  TO,
  MAXIMUM,
  RESET_TYPE,
  CALENDAR_DATE,
} = FORM_ITEM_NAME;

const TypeConfiguration = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    match: { params: { action = '', typeId = '' } = {} } = {},
    location: { state: { isValid = false } = {}, state = {} } = {},
    timeOff: { viewingLeaveType = {} || {}, employeeSchedule = {} } = {},
    loadingFetchTypeByID = false,
    loadingUpsertLeaveType = false,
  } = props;

  const { configs = {} } = viewingLeaveType || {};
  const { totalHour: workHourPerDay = 0 } = employeeSchedule;

  const [initialValues, setInitialValues] = useState({});

  useEffect(() => form.resetFields(), [initialValues]);

  const renderErrorMessage = () => {
    message.error('Please setup work schedule before adding/updating time off types');
  };

  const fetchTypeById = () => {
    if (typeId) {
      dispatch({
        type: 'timeOff/fetchLeaveTypeByIDEffect',
        payload: {
          timeoffType: typeId,
        },
      });
    }
  };

  const fetchEmployeeTypeList = () => {
    dispatch({
      type: 'timeOff/fetchEmployeeTypeListEffect',
    });
  };

  const fetchEmployeeSchedule = () => {
    dispatch({
      type: 'timeOff/getEmployeeScheduleByLocation',
      payload: { location: getCurrentLocation(), tenantId: getCurrentTenant() },
    });
  };

  const goBack = () => {
    history.push('/time-off/setup/types-rules');
  };

  const generatePayload = (values) => {
    const payload = {
      timeoffType: typeId,
      [TIMEOFF_TYPE_NAME]: values[TIMEOFF_TYPE_NAME],
      [EMPLOYEE_TYPE]: values[EMPLOYEE_TYPE],
      type: state.type,
      typeName: state.typeName,
      country: state.country,
      configs: {
        [ACCRUAL_POLICY]: {
          [ACCRUAL_METHOD]: values[ACCRUAL_POLICY_ACCRUAL_METHOD],
          [ACCRUAL_RATE]: values[ACCRUAL_POLICY_ACCRUAL_RATE]
            ? values[ACCRUAL_POLICY_ACCRUAL_RATE].map((x) => {
                return {
                  [FROM]: x[FROM],
                  [TO]: x[TO],
                  [VALUE]: x[VALUE],
                };
              })
            : [],
        },
        [ACCRUAL_START]: {
          [VALUE]: values[ACCRUAL_START_VALUE] || 0,
          [UNIT]: 'd',
        },
        [LEAVE_APPLICATION_START]: {
          [VALUE]: values[LEAVE_APPLICATION_START_VALUE] || 0,
          [UNIT]: 'd',
        },
        [MINIMUM_LEAVE_AMOUNT]: {
          [VALUE]: values[MINIMUM_LEAVE_AMOUNT_VALUE] || 0,
          [UNIT]: 'd',
        },
        [MAXIMUM_BALANCE_ALLOWED]: {
          [VALUE]: values[MAXIMUM_BALANCE_ALLOWED_VALUE] || 0,
          [UNIT]: values[MAXIMUM_BALANCE_ALLOWED_UNIT] || 'd',
        },
        [NEW_HIRE_PRORATION_POLICY]: values[NEW_HIRE_PRORATION_POLICY],
        [LOP_LEAVE_ACCRUAL_POLICY]: values[LOP_LEAVE_ACCRUAL_POLICY],
        [NEGATIVE_LEAVE_BALANCE]: {
          [ALLOWED]: values[NEGATIVE_LEAVE_BALANCE_ALLOWED] || false,
          [MAXIMUM]: {
            [VALUE]: values[NEGATIVE_LEAVE_BALANCE_MAXIMUM_VALUE] || 0,
            [UNIT]: values[NEGATIVE_LEAVE_BALANCE_MAXIMUM_UNIT] || 'd',
          },
        },
        [ANNUAL_RESET_POLICY]: {
          [RESET_TYPE]: values[ANNUAL_RESET_POLICY_RESET_TYPE],
          [CALENDAR_DATE]: values[ANNUAL_RESET_POLICY_CALENDAR_DATE],
        },
        [NOTICE_PERIOD_LEAVE_ACCRUAL_POLICY]: values[NOTICE_PERIOD_LEAVE_ACCRUAL_POLICY],
        [CARRY_FORWARD_POLICY]: values[CARRY_FORWARD_POLICY].map((x) => {
          return {
            [CARRY_FORWARD_CAP]: {
              [FROM]: x[FROM],
              [TO]: x[TO],
            },
            [ALLOWED]: x[ALLOWED],
            [MAXIMUM_CARRY_FORWARD_VALUE]: {
              [VALUE]: x[VALUE] || 0,
              [UNIT]: x[UNIT] || 'd',
            },
          };
        }),
      },
    };

    if (action === 'add') {
      delete payload.timeoffType;
    }
    return payload;
  };

  const onFinish = (values) => {
    const payload = generatePayload(values);

    dispatch({
      type: 'timeOff/upsertLeaveTypeEffect',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        goBack();
      }
    });
  };

  const onFinishFailed = () => {
    message.error('Please complete required fields!');
  };

  const getFormInitialValues = () => {
    if (action === 'configure' && viewingLeaveType)
      return {
        [TIMEOFF_TYPE_NAME]: viewingLeaveType?.[TIMEOFF_TYPE_NAME],
        [EMPLOYEE_TYPE]: viewingLeaveType?.[EMPLOYEE_TYPE],
        [ACCRUAL_POLICY_ACCRUAL_METHOD]: configs?.[ACCRUAL_POLICY]?.[ACCRUAL_METHOD],
        [ACCRUAL_POLICY_ACCRUAL_RATE]: configs?.[ACCRUAL_POLICY]?.[ACCRUAL_RATE],
        [ACCRUAL_START_VALUE]: configs?.[ACCRUAL_START]?.[VALUE] || 0,
        [ACCRUAL_START_UNIT]: configs?.[ACCRUAL_START]?.[UNIT],
        [MINIMUM_LEAVE_AMOUNT_VALUE]: configs?.[MINIMUM_LEAVE_AMOUNT]?.[VALUE] || 0,
        [LEAVE_APPLICATION_START_VALUE]: configs?.[LEAVE_APPLICATION_START]?.[VALUE] || 0,
        [NEGATIVE_LEAVE_BALANCE_ALLOWED]: configs?.[NEGATIVE_LEAVE_BALANCE]?.[ALLOWED] || false,
        [NEGATIVE_LEAVE_BALANCE_MAXIMUM_UNIT]:
          configs?.[NEGATIVE_LEAVE_BALANCE]?.[MAXIMUM]?.[UNIT] || 'd',
        [NEGATIVE_LEAVE_BALANCE_MAXIMUM_VALUE]:
          configs?.[NEGATIVE_LEAVE_BALANCE]?.[MAXIMUM]?.[VALUE] || 0,
        [NEW_HIRE_PRORATION_POLICY]: configs?.[NEW_HIRE_PRORATION_POLICY],
        [LOP_LEAVE_ACCRUAL_POLICY]: configs?.[LOP_LEAVE_ACCRUAL_POLICY] || false,
        [MAXIMUM_BALANCE_ALLOWED_UNIT]: configs?.[MAXIMUM_BALANCE_ALLOWED]?.[UNIT],
        [MAXIMUM_BALANCE_ALLOWED_VALUE]: configs?.[MAXIMUM_BALANCE_ALLOWED]?.[VALUE] || 0,
        [ANNUAL_RESET_POLICY_RESET_TYPE]: configs?.[ANNUAL_RESET_POLICY]?.[RESET_TYPE] || 0,
        [ANNUAL_RESET_POLICY_CALENDAR_DATE]: configs?.[ANNUAL_RESET_POLICY]?.[CALENDAR_DATE]
          ? moment(configs?.[ANNUAL_RESET_POLICY]?.[CALENDAR_DATE])
          : null,
        [NOTICE_PERIOD_LEAVE_ACCRUAL_POLICY]:
          configs?.[NOTICE_PERIOD_LEAVE_ACCRUAL_POLICY] || false,
        [CARRY_FORWARD_POLICY]: configs?.[CARRY_FORWARD_POLICY]
          ? configs?.[CARRY_FORWARD_POLICY].map((x) => {
              return {
                ...x,
                [FROM]: x[CARRY_FORWARD_CAP]?.[FROM],
                [TO]: x[CARRY_FORWARD_CAP]?.[TO],
                [ALLOWED]: x[ALLOWED],
                [VALUE]: x[MAXIMUM_CARRY_FORWARD_VALUE]?.[VALUE],
                [UNIT]: x[MAXIMUM_CARRY_FORWARD_VALUE]?.[UNIT],
              };
            })
          : [],
      };
    return {
      [ACCRUAL_METHOD]: 'unlimited',
      [ACCRUAL_RATE]: [],
      [ACCRUAL_START_VALUE]: 0,
      [ACCRUAL_START_UNIT]: 'd',
      [MINIMUM_LEAVE_AMOUNT_VALUE]: 0,
      [LEAVE_APPLICATION_START_VALUE]: 0,
      [NEGATIVE_LEAVE_BALANCE_ALLOWED]: false,
      [NEGATIVE_LEAVE_BALANCE_MAXIMUM_UNIT]: 'd',
      [NEGATIVE_LEAVE_BALANCE_MAXIMUM_VALUE]: 0,
      [NEW_HIRE_PRORATION_POLICY]: true,
      [ANNUAL_RESET_POLICY_RESET_TYPE]: 'calendarDate',
      [ANNUAL_RESET_POLICY_CALENDAR_DATE]: moment().endOf('year'),
      [LOP_LEAVE_ACCRUAL_POLICY]: false,
      [MAXIMUM_BALANCE_ALLOWED_UNIT]: 'd',
      [MAXIMUM_BALANCE_ALLOWED_VALUE]: 0,
      [NOTICE_PERIOD_LEAVE_ACCRUAL_POLICY]: false,
      [CARRY_FORWARD_POLICY]: [],
    };
  };

  useEffect(() => {
    const initialValuesTemp = getFormInitialValues();
    setInitialValues(initialValuesTemp);
  }, [JSON.stringify(viewingLeaveType)]);

  useEffect(() => {
    if (!isValid) {
      goBack();
    }
    goToTop();
    fetchTypeById();
    fetchEmployeeTypeList();
    fetchEmployeeSchedule();
    return () => {
      dispatch({
        type: 'timeOff/save',
        payload: {
          viewingLeaveType: {},
        },
      });
    };
  }, []);

  // useEffect(() => {
  //   const values = getFormInitialValues();
  //   form.setFieldsValue(values);
  // }, [JSON.stringify(viewingLeaveType)]);

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
                loading={loadingUpsertLeaveType}
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const renderForm = () => {
    const components = [
      {
        id: 1,
        component: <LeaveTypeName />,
      },
      {
        id: 2,
        component: <EmploymentType />,
      },
      {
        id: 3,
        component: <AccrualPolicy configs={configs} />,
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
        component: (
          <NegativeLeaveBalance
            configs={configs}
            form={form}
            workHourPerDay={workHourPerDay}
            renderErrorMessage={renderErrorMessage}
          />
        ),
      },
      {
        id: 8,
        component: (
          <MaximumBalanceAllowed
            configs={configs}
            form={form}
            workHourPerDay={workHourPerDay}
            renderErrorMessage={renderErrorMessage}
          />
        ),
      },
      {
        id: 9,
        component: <NewHireProrationPolicy />,
      },
      {
        id: 10,
        component: <LOP />,
      },
      {
        id: 11,
        component: <NoticePeriodLeaveAccrualPolicy />,
      },
      {
        id: 12,
        component: <AnnualResetPolicy />,
      },
      {
        id: 13,
        component: (
          <CarryForwardPolicy
            configs={configs}
            form={form}
            workHourPerDay={workHourPerDay}
            renderErrorMessage={renderErrorMessage}
          />
        ),
      },
    ];

    if (loadingFetchTypeByID) {
      return <Skeleton />;
    }
    return (
      <Form
        name="timeOffType"
        form={form}
        initialValues={getFormInitialValues()}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[24, 24]}>
          {components.map((x) => (
            <Col span={24}>{x.component}</Col>
          ))}
          <Col span={24}>{renderBottomBar()}</Col>
        </Row>
      </Form>
    );
  };

  const Note = {
    title: 'Note',
    icon: Icon1,
    data: (
      <Typography.Text>
        <span style={{ fontWeight: 500, color: '#000' }}>Leave Accrual</span> - the rate at which an
        employee accrues or earns paid time off.
        <br />
        <br />
        <span style={{ fontWeight: 500, color: '#000' }}>Carry Forward</span> - a concept where in
        an employee’s unutilized leaves from the current year can be carried forward to the next
        year. Carry forward is usually done at the end of a financial year.
      </Typography.Text>
    ),
  };

  return (
    <PageContainer>
      <div className={styles.TypeConfiguration}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>Setup Timeoff policy</p>
          </div>
        </Affix>
        <div className={styles.content}>
          {renderHeader()}
          <Row gutter={[24, 24]}>
            <Col sm={24} xl={18}>
              {renderForm()}
            </Col>
            <Col sm={24} xl={6}>
              <NoteComponent note={Note} />
            </Col>
          </Row>
        </div>
      </div>
    </PageContainer>
  );
};

export default connect(({ user: { permissions = {} }, timeOff, loading }) => ({
  permissions,
  timeOff,
  loadingFetchTypeByID: loading.effects['timeOff/fetchTimeOffTypeById'],
  loadingUpsertLeaveType: loading.effects['timeOff/upsertLeaveTypeEffect'],
}))(TypeConfiguration);
