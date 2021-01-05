import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import { connect } from 'umi';
import RequestInformation from './RequestInformation';
import RightContent from './RightContent';
import styles from './index.less';

@connect(({ timeOff }) => ({
  timeOff,
}))
class ViewCompoffRequestForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // FETCH LEAVE REQUEST DETAIL
  componentDidMount = () => {
    const {
      dispatch,
      match: { params: { reId: id = '' } = {} },
    } = this.props;
    dispatch({
      type: 'timeOff/fetchCompoffRequestById',
      id,
    });
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  };

  // clear viewingCompoffRequest
  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/clearViewingCompoffRequest',
    });
  };

  getColorOfStatus = (status) => {
    switch (status) {
      case 'IN-PROGRESS':
        return `${styles.leaveStatus} ${styles.inProgressColor}`;
      case 'ACCEPTED':
        return `${styles.leaveStatus} ${styles.approvedColor}`;
      case 'REJECTED':
        return `${styles.leaveStatus} ${styles.rejectedColor}`;
      case 'DRAFTS':
        return `${styles.leaveStatus} ${styles.draftsColor}`;
      default:
        return `${styles.leaveStatus}`;
    }
  };

  getNameOfStatus = (status) => {
    switch (status) {
      case 'IN-PROGRESS':
        return 'In Progress';
      case 'ACCEPTED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'DRAFTS':
        return 'Drafts';
      default:
        return 'Unknown';
    }
  };

  render() {
    const {
      timeOff: { viewingCompoffRequest: { ticketID = '', status = '' } = {} } = {},
    } = this.props;

    const {
      match: { params: { reId: id = '' } = {} },
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.ViewCompoffRequestForm}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>[Ticket ID: {ticketID}]</p>
              <div className={this.getColorOfStatus(status)}>
                <span className={styles.dot} />
                <span className={styles.statusText}>{this.getNameOfStatus(status)}</span>
              </div>
            </div>
          </Affix>
          <Row className={styles.container} gutter={[20, 20]}>
            <Col xs={24} lg={16}>
              <RequestInformation id={id} />
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

export default ViewCompoffRequestForm;
