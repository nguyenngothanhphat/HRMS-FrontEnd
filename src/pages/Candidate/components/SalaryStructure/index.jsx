import React, { PureComponent } from 'react';
import { Row, Col, Typography, Button, Form } from 'antd';
import { connect, formatMessage } from 'umi';

import SalaryStructureHeader from './components/SalaryStructureHeader';
import SalaryStructureTemplate from './components/SalaryStructureTemplate';
import NoteComponent from '../NoteComponent';
import SalaryAcceptance from './components/SalaryAcceptance';

import styles from './index.less';

// const DRAFT = 'DRAFT';
// const SENT_PROVISIONAL_OFFER = 'SENT-PROVISIONAL-OFFER';
// const ACCEPT_PROVISIONAL_OFFER = 'ACCEPT-PROVISIONAL-OFFER';
// const RENEGOTIATE_PROVISIONAL_OFFER = 'RENEGOTIATE-PROVISIONAL-OFFER';
// const DISCARDED_PROVISIONAL_OFFER = 'DISCARDED-PROVISIONAL-OFFER';

@connect(
  ({
    candidateInfo: { data: { processStatus = '' }, salaryStructure = {}, checkMandatory = {} } = {},
  }) => ({
    processStatus,
    salaryStructure,
    checkMandatory,
  }),
)
class SalaryStructure extends PureComponent {
  componentDidMount() {
    window.scrollTo(0, 70); // Back to top of the page
  }

  _renderTable = () => {
    return (
      <div className={styles.tableWrapper}>
        <p>{formatMessage({ id: 'component.salaryStructure.tableWrapper' })}</p>
      </div>
    );
  };

  render() {
    const { processStatus } = this.props;
    const Note = {
      title: 'Note',
      data: (
        <Typography.Text>
          The Salary structure will be sent as a <span>provisional offer</span>. The candidate must
          accept the and acknowledge the salary structure as a part of final negotiation. <br />
          <br />
          <span className="bold-text">
            Post acceptance of salary structure, the final offer letter will be sent.
          </span>
        </Typography.Text>
      ),
    };
    return (
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={styles.salaryStructure}>
            <Form wrapperCol={{ span: 24 }} name="basic" onFinish={this.onFinish}>
              <div className={styles.salaryStructure__top}>
                <SalaryStructureHeader />
                {/* <hr /> */}
                <SalaryStructureTemplate />
              </div>
            </Form>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              <SalaryAcceptance />
            </Row>
            {/* <Row>{processStatus === 'DRAFT' ? '' : <SalaryAcceptance />}</Row> */}
          </div>
        </Col>
      </Row>
    );
  }
}

export default SalaryStructure;
