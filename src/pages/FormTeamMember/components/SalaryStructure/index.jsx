import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';
import { connect } from 'umi';

import SalaryStructureHeader from './components/SalaryStructureHeader';
import NoteComponent from '../NoteComponent';
import SalaryAcceptance from './components/SalaryAcceptance';

import styles from './index.less';

@connect(({ info: { salaryStructure = {}, checkMandatory = {} } = {} }) => ({
  salaryStructure,
  checkMandatory,
}))
class SalaryStructure extends PureComponent {
  _renderTable = () => {
    return (
      <div className={styles.tableWrapper}>
        <p>
          The table of salary structure should populate here. Need clarification here if this table
          or information is editable by the HR?
        </p>
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
            <div className={styles.salaryStructure__top}>
              <SalaryStructureHeader />
              {/* <hr /> */}
              {this._renderTable()}
            </div>
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
