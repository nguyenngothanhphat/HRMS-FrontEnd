import React, { Component } from 'react';
import { Affix, Row, Col, Skeleton } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import TicketDetailsForm from './TicketDetailsForm';
import RightContent from './RightContent';

@connect(({ loading, ticketManagement: { ticketDetail = {} } = {} }) => ({
  ticketDetail,
  loadingFetchTicketById: loading.effects['ticketManagement/fetchTicketByID'],
}))
class TicketDetails extends Component {
  componentDidMount() {
    const {
      dispatch,
      match: { params: { id: code = '' } = {} },
    } = this.props;
    dispatch({
      type: 'ticketManagement/fetchTicketByID',
      payload: {
        id: code,
      },
    });
  }

  render() {
    const {
      match: { params: { id: code = '' } = {} },
      loadingFetchTicketById = false,
    } = this.props;
    const { ticketDetail = {} } = this.props;

    if (loadingFetchTicketById)
      return (
        <PageContainer>
          <div className={styles.TicketDetails}>
            <Skeleton />
          </div>
        </PageContainer>
      );
    return (
      <PageContainer>
        <div className={styles.TicketDetails}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>{`[Ticket ID: ${code}]`}</p>
            </div>
          </Affix>
          <Row className={styles.container} gutter={[20, 20]}>
            <Col xs={24} lg={16}>
              <TicketDetailsForm />
            </Col>
            <Col xs={24} lg={8}>
              <RightContent data={ticketDetail} />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default TicketDetails;
