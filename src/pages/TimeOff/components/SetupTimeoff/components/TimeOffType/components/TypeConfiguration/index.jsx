import React, { useEffect } from 'react';
import { Affix, Button, Col, Form, Row, Skeleton, Typography } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import styles from './index.less';
import { PageContainer } from '@/layouts/layout/src';
import LeaveTypeName from './components/LeaveTypeName';
import NoteComponent from './components/NoteComponent';
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
  {
    id: 8,
    component: <MaximumBalanceAllowed />,
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
    component: <CarryForwardPolicy />,
  },
];

const TypeConfiguration = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    match: { params: { action = '', typeId = '' } = {} } = {},
    location: { state: { isValid = false } = {}, state = {} } = {},
    timeOff: { viewingLeaveType = {} || {} } = {},
    loadingFetchTypeByID = false,
  } = props;

  const {
    timeoffTypeName: timeoffTypeNameProp = '',
    employeeType: employeeTypeProp = [],
    configs = {},
  } = viewingLeaveType || {};

  const fetchTypeById = () => {
    dispatch({
      type: 'timeOff/fetchLeaveTypeByIDEffect',
      payload: {
        timeoffType: typeId,
      },
    });
  };

  const fetchEmployeeTypeList = () => {
    dispatch({
      type: 'timeOff/fetchEmployeeTypeListEffect',
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

  const generatePayload = (values) => {
    const {
      carryForwardPolicy = [],
      employeeType = [],
      timeoffTypeName = '',
      newHireProrationPolicy = true,
      LOPLeaveAccrualPolicy = false,
      noticePeriodLeaveAccrualPolicy = false,
    } = values;

    let payload = {
      timeoffType: typeId,
      timeoffTypeName,
      employeeType,
      configs: {
        accrualPolicy: {
          accrualMethod: values['accrualPolicy.accrualMethod'],
          accrualRate: values['accrualPolicy.accrualRate']
            ? values['accrualPolicy.accrualRate'].map((x) => {
                return { from: x.from, to: x.to, value: x.value };
              })
            : [],
        },
        accrualStart: {
          value: values['accrualStart.value'],
          unit: 'd',
        },
        leaveApplicationStart: {
          value: values['leaveApplicationStart.value'],
          unit: 'd',
        },
        minimumLeaveAmount: {
          value: values['minimumLeaveAmount.value'],
          unit: 'd',
        },
        maximumBalanceAllowed: {
          value: values['maximumBalanceAllowed.value'],
          unit: values['maximumBalanceAllowed.unit'] || 'd',
        },
        newHireProrationPolicy,
        LOPLeaveAccrualPolicy,
        negativeLeaveBalance: {
          allowed: values['negativeLeaveBalance.allowed'],
          maximum: {
            value: values['negativeLeaveBalance.maximum.value'],
            unit: values['negativeLeaveBalance.maximum.unit'] || 'd',
          },
        },
        annualResetPolicy: {
          resetType: values['annualResetPolicy.resetType'],
          calendarDate: values['annualResetPolicy.calendarDate'],
        },
        noticePeriodLeaveAccrualPolicy,
        carryForwardPolicy: carryForwardPolicy.map((x) => {
          return {
            carryForwardCap: {
              from: x['carryForwardCap.from'],
              to: x['carryForwardCap.to'],
            },
            carryForwardAllowed: x.carryForwardAllowed,
            maximumCarryForwardValue: {
              value: x['maximumCarryForwardValue.value'],
              unit: x['maximumCarryForwardValue.unit'] || 'd',
            },
          };
        }),
      },
    };
    if (action === 'add') {
      delete payload.timeoffType;
      payload = {
        ...payload,
        type: state.type,
        typeName: state.typeName,
        country: state.country,
      };
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

  const getFormInitialValues = () => {
    if (action === 'configure')
      return {
        timeoffTypeName: timeoffTypeNameProp,
        employeeType: employeeTypeProp,
        'accrualPolicy.accrualMethod': configs.accrualPolicy?.accrualMethod,
        'accrualPolicy.accrualRate': configs.accrualPolicy?.accrualRate,
        'accrualStart.value': configs.accrualStart?.value || 0,
        'accrualStart.unit': configs.accrualStart?.unit,
        'minimumLeaveAmount.value': configs.minimumLeaveAmount?.value || 0,
        'leaveApplicationStart.value': configs.leaveApplicationStart?.value || 0,
        'negativeLeaveBalance.allowed': configs.negativeLeaveBalance?.allowed || false,
        'negativeLeaveBalance.maximum.unit': configs.negativeLeaveBalance?.maximum?.unit || 'd',
        'negativeLeaveBalance.maximum.value': configs.negativeLeaveBalance?.maximum?.value || 0,
        newHireProrationPolicy: configs.newHireProrationPolicy,
        LOPLeaveAccrualPolicy: configs.LOPLeaveAccrualPolicy || false,
        'maximumBalanceAllowed.unit': configs.maximumBalanceAllowed?.unit,
        'maximumBalanceAllowed.value': configs.maximumBalanceAllowed?.value || 0,
        'annualResetPolicy.resetType': configs.annualResetPolicy?.resetType || 0,
        'annualResetPolicy.calendarDate': configs.annualResetPolicy?.calendarDate
          ? moment(configs.annualResetPolicy?.calendarDate)
          : null,
        noticePeriodLeaveAccrualPolicy: configs.noticePeriodLeaveAccrualPolicy || false,
        carryForwardPolicy: configs.carryForwardPolicy
          ? configs.carryForwardPolicy.map((x) => {
              return {
                ...x,
                'carryForwardCap.from': x.carryForwardCap.from,
                'carryForwardCap.to': x.carryForwardCap.to,
                'maximumCarryForwardValue.value': x.maximumCarryForwardValue.value,
                'maximumCarryForwardValue.unit': x.maximumCarryForwardValue.unit,
              };
            })
          : [],
      };
    return {
      'accrualPolicy.accrualMethod': 'unlimited',
      'accrualStart.value': 0,
      'accrualStart.unit': 'd',
      'minimumLeaveAmount.value': 0,
      'leaveApplicationStart.value': 0,
      'negativeLeaveBalance.allowed': false,
      'negativeLeaveBalance.maximum.unit': 'd',
      'negativeLeaveBalance.maximum.value': 0,
      newHireProrationPolicy: true,
      'annualResetPolicy.type': 'calendarDate',
      LOPLeaveAccrualPolicy: false,
      'maximumBalanceAllowed.unit': 'd',
      'maximumBalanceAllowed.value': 0,
      noticePeriodLeaveAccrualPolicy: false,
    };
  };

  useEffect(() => {
    if (!isValid) {
      goBack();
    }
    goToTop();
    fetchTypeById();
    fetchEmployeeTypeList();
    return () => {
      dispatch({
        type: 'timeOff/save',
        payload: {
          viewingLeaveType: {},
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

    return (
      <div className={styles.content}>
        {renderHeader()}

        <Row gutter={[24, 24]}>
          <Col sm={24} xl={16}>
            {loadingFetchTypeByID ||
            (viewingLeaveType !== null && Object.keys(viewingLeaveType).length === 0) ? (
              <Skeleton />
            ) : (
              <Form
                name="timeOffType"
                form={form}
                initialValues={getFormInitialValues()}
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
          <Col sm={24} xl={8}>
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
