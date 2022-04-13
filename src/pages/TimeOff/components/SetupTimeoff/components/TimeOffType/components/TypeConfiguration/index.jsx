import React from 'react';
import { Affix, Col, Row, Typography } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import { PageContainer } from '@/layouts/layout/src';
import LeaveType from './components/LeaveType';
import NoteComponent from './components/NoteComponent';

const TypeConfiguration = (props) => {
  const {
    dispatch,
    match: { params: { reId = '', tabName = '' } = {} } = {},
    permissions = {},
  } = props;

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
      data: (
        <Typography.Text>
          Leave Accrual - the rate at which an employee accrues or earns paid time off.
          <br />
          Carry Forward - a concept where in an employee’s unutilized leaves from the current year
          can be carried forward to the next year. Carry forward is usually done at the end of a
          financial year.
        </Typography.Text>
      ),
    };

    return (
      <div className={styles.content}>
        {renderHeader()}
        <Row gutter={[24, 24]}>
          <Col sm={24} lg={16}>
            <LeaveType />
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
