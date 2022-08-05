import { Affix, Col, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import RightContent from './RightContent';
import TicketDetailsForm from './TicketDetailsForm';

const TicketDetails = (props) => {
  const {
    match: { params: { id: code = '' } = {} },
    loadingFetchTicketById = false,
    dispatch,
    ticketDetail = {},
  } = props;

  useEffect(() => {
    if (code) {
      dispatch({
        type: 'ticketManagement/fetchTicketByID',
        payload: {
          id: code,
        },
      });
    }
  }, [code]);

  return (
    <PageContainer>
      <div className={styles.TicketDetails}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>{`[Ticket ID: ${code}]`}</p>
          </div>
        </Affix>
        <Spin spinning={loadingFetchTicketById}>
          <Row className={styles.container} gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <TicketDetailsForm />
            </Col>
            <Col xs={24} lg={8}>
              <RightContent data={ticketDetail} />
            </Col>
          </Row>
        </Spin>
      </div>
    </PageContainer>
  );
};

export default connect(({ loading, ticketManagement: { ticketDetail = {} } = {} }) => ({
  ticketDetail,
  loadingFetchTicketById: loading.effects['ticketManagement/fetchTicketByID'],
}))(TicketDetails);
