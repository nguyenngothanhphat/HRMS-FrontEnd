import React from 'react';
import { Affix, Col, Row, Typography } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import { PageContainer } from '@/layouts/layout/src';
import LeaveType from './components/LeaveType';
import NoteComponent from './components/NoteComponent';
import Icon1 from '@/assets/timeOff/icon1.svg';
import EmploymentType from './components/EmploymentType';
import AccrualPolicy from './components/AccrualPolicy';

const TypeConfiguration = (props) => {
  const { dispatch, match: { params: { reId = '', tabName = '' } = {} } = {} } = props;

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.title}>Configure Casual leave policy</p>
        <p className={styles.description}>
          Casual Leave or CL is granted to an eligible employee if they cannot report to work due to
          an unforeseen situation. Casual leave can also be utilised if an eligible employee wants
          to take leave for a couple of days for personal reasons.
        </p>
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
    ];
    return (
      <div className={styles.content}>
        {renderHeader()}
        <Row gutter={[24, 24]}>
          <Col sm={24} lg={16}>
            <Row gutter={[24, 24]}>
              {components.map((x) => (
                <Col span={24}>{x.component} </Col>
              ))}
            </Row>
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

export default connect(({ user: { permissions = {} } }) => ({
  permissions,
}))(TypeConfiguration);
