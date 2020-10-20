import React, { PureComponent } from 'react';
import { Row, Col, Typography, Button, Form } from 'antd';
import { connect, formatMessage } from 'umi';

import SalaryStructureHeader from './components/SalaryStructureHeader';
import SalaryStructureTemplate from './components/SalaryStructureTemplate';
import NoteComponent from '../NoteComponent';
import SalaryAcceptance from './components/SalaryAcceptance';

import styles from './index.less';

const DRAFT = 'DRAFT';
const SENT_PROVISIONAL_OFFER = 'SENT-PROVISIONAL-OFFER';
const ACCEPT_PROVISIONAL_OFFER = 'ACCEPT-PROVISIONAL-OFFER';
const RENEGOTIATE_PROVISIONAL_OFFER = 'RENEGOTIATE-PROVISIONAL-OFFER';
const DISCARDED_PROVISIONAL_OFFER = 'DISCARDED-PROVISIONAL-OFFER';

@connect(({ info: { salaryStructure = {}, checkMandatory = {} } = {} }) => ({
  salaryStructure,
  checkMandatory,
}))
class SalaryStructure extends PureComponent {
  _renderTable = () => {
    return (
      <div className={styles.tableWrapper}>
        <p>{formatMessage({ id: 'component.salaryStructure.tableWrapper' })}</p>
      </div>
    );
  };

  _renderStatus = () => {
    return (
      <div className={styles.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  _renderBottomBar = () => {
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>{this._renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              {' '}
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary}`}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { checkMandatory } = this.props;
    const { salaryStatus } = checkMandatory;
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
              {salaryStatus === 1 ? this._renderBottomBar() : null}
            </Form>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
            <Row>
              <SalaryAcceptance salaryStatus={salaryStatus} />
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}

export default SalaryStructure;
