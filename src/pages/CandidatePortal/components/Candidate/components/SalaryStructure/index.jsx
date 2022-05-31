import { Col, Form, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import SalaryAcceptance from './components/SalaryAcceptance';
import SalaryStructureHeader from './components/SalaryStructureHeader';
import SalaryStructureInfoBoxes from './components/SalaryStructureInfoBoxes';
import SalaryStructureTemplate from './components/SalaryStructureTemplate';
import styles from './index.less';

@connect(({ candidatePortal: { title: { name: titleName = '' } = {} } = {} }) => ({
  titleName,
}))
class SalaryStructure extends PureComponent {
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
        <Col span={24} xl={16}>
          <div className={styles.salaryStructure}>
            <Form wrapperCol={{ span: 24 }} name="basic" onFinish={this.onFinish}>
              <div className={styles.salaryStructure__top}>
                <SalaryStructureHeader titleName={titleName} />
                <SalaryStructureInfoBoxes />
                <SalaryStructureTemplate />
              </div>
            </Form>
          </div>
        </Col>
        <Col span={24} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              <SalaryAcceptance />
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}

export default SalaryStructure;
