import React, { Component } from 'react';
import { Affix, Row, Col } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import TicketDetailsForm from './TicketDetailsForm';
import RightContent from './RightContent';

@connect(({ ticketManagement: { listOffAllTicket = [] } = {} }) => ({
  listOffAllTicket,
}))
class TicketDetails extends Component {
  componentDidMount() {
    const {
      dispatch,
      match: { params: { id: code = '' } = {} },
    } = this.props;
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload: {
        id: code,
      },
    });
  }

  render() {
    const {
      dispatch,
      match: { params: { id: code = '' } = {} },
    } = this.props;
    const { listOffAllTicket } = this.props;
    const data = listOffAllTicket.find((val) => val.id == code);
    dispatch({
      type: 'ticketManagement/fetchListAllTicketID',
      payload: data,
    });
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
              <RightContent />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default TicketDetails;
