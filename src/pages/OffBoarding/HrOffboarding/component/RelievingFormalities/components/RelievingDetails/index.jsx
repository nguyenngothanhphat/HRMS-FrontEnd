import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col, Button } from 'antd';
import { connect } from 'umi';
// import exclamationIcon from '@/assets/exclamation-custom-icon.svg';
import EmployeeDetail from './components/EmployeeDetail';
import ResignationOverview from './components/ResignationOverview';
import MailExit from './components/MailExit';
import ConductExit from './components/ConductExit';
import Feedback from './components/Feedback';
import ClosePackage from './components/ClosingPackage';
import styles from './index.less';

@connect(({ offboarding }) => ({ offboarding }))
class RelievingDetails extends PureComponent {
  componentDidMount() {
    this.fetchRelievingDetails();
  }

  fetchRelievingDetails = () => {
    const {
      match: { params: { ticketId: id = '' } = {} },
      dispatch,
    } = this.props;
    dispatch({
      type: 'offboarding/fetchRelievingDetailsById',
      payload: {
        id,
      },
    });
  };

  render() {
    const {
      offboarding: { relievingDetails = {} },
    } = this.props;
    return (
      <PageContainer>
        <div className={styles.relievingDetail}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship with Venkat Vamsi Kr ... [PSI: 1022]
              </p>
            </div>
          </Affix>
          <Row className={styles.relievingDetail__container} gutter={[30, 0]}>
            <Col md={24} lg={10}>
              <EmployeeDetail relievingDetails={relievingDetails} />
              <ResignationOverview relievingDetails={relievingDetails} />
            </Col>
            <Col md={24} lg={14}>
              <MailExit />
              <ConductExit />
              <Feedback />
              <ClosePackage />
              <Button className={styles.relievingDetail__btnClose}>Close employee record</Button>
              {/* <div className={styles.relievingDetail__closeRecord}>
                <img src={exclamationIcon} alt="exclamation-icon" />
                <span> The employee record for this employee has been closed </span>
              </div> */}
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default RelievingDetails;
