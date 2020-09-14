import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';
import { connect } from 'umi';

import SalaryStructureHeader from './components/SalaryStructureHeader';

import styles from './index.less';

@connect(({ info: { basicInformation, checkMandatory } = {} }) => ({
  basicInformation,
  checkMandatory,
}))
class SalaryStructure extends PureComponent {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     isOpenReminder: false,
  //   };
  // }

  _renderTable = () => {
    return <div className={styles.tableWrapper}>hi</div>;
  };

  render() {
    // const Steps = {
    //   title: 'Complete onboarding process at a glance',
    //   keyPage: [{ key: 1, data: `Prepare the new candidate's offer letter` }],
    // };
    // const Note = {
    //   title: 'Note',
    //   data: (
    //     <Typography.Text>
    //       Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
    //       working days for entire process to complete
    //     </Typography.Text>
    //   ),
    // };
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
          {/* <div className={styles.rightWrapper}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
            <hr />
            <Row>
              <StepsComponent Steps={Steps} />
            </Row>
          </div> */}
        </Col>
      </Row>
    );
  }
}

export default SalaryStructure;
