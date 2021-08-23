import { Col, Form, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
// import NoteComponent from '../NoteComponent';
import SalaryAcceptance from './components/SalaryAcceptance';
import SalaryStructureHeader from './components/SalaryStructureHeader';
import SalaryStructureInfoBoxes from './components/SalaryStructureInfoBoxes';
import SalaryStructureTemplate from './components/SalaryStructureTemplate';
import styles from './index.less';

// const DRAFT = 'DRAFT';
// const SENT_PROVISIONAL_OFFER = 'SENT-PROVISIONAL-OFFER';
// const ACCEPT_PROVISIONAL_OFFER = 'ACCEPT-PROVISIONAL-OFFER';
// const RENEGOTIATE_PROVISIONAL_OFFER = 'RENEGOTIATE-PROVISIONAL-OFFER';
// const DISCARDED_PROVISIONAL_OFFER = 'DISCARDED-PROVISIONAL-OFFER';

@connect(
  ({
    candidateInfo: {
      data: { processStatus = '' }, // tempData = {},
      salaryStructure = {},
      checkMandatory = {},
      salaryNote = '',
    } = {},
    candidatePortal: { title: { name: titleName = '' } = {} } = {},
  }) => ({
    titleName,
    processStatus,
    salaryStructure,
    checkMandatory,
    salaryNote,
    // tempData,
  }),
)
class SalaryStructure extends PureComponent {
  componentDidMount() {
    // window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
  }

  _renderTable = () => {
    return (
      <div className={styles.tableWrapper}>
        <p>{formatMessage({ id: 'component.salaryStructure.tableWrapper' })}</p>
      </div>
    );
  };

  render() {
    const { titleName = '' } = this.props;
    return (
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={styles.salaryStructure}>
            <Form wrapperCol={{ span: 24 }} name="basic" onFinish={this.onFinish}>
              <div className={styles.salaryStructure__top}>
                <SalaryStructureHeader titleName={titleName} />
                <SalaryStructureInfoBoxes />
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
