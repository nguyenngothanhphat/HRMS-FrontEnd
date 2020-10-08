import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';

import PayrollSettingsHeader from './components/PayrollSettingsHeader';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';
import LolipopIcon from '../../../../../public/assets/images/lolipop.png';

import styles from './index.less';

class BasicInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    if ('basicInformation' in props) {
      return { basicInformation: props.basicInformation || {} };
    }
    return null;
  }

  _renderForm = () => {
    return (
      <div className={styles.payrollSettingContainer}>
        <div className={styles.lolipopIcon}>
          <img src={LolipopIcon} alt="lolipop" />
        </div>
        <p>
          You are using “Lollypop” Payroll system. Lando Norris payroll will be automatically linked
          once the onboarding is complete.
        </p>
      </div>
    );
  };

  render() {
    const Note = {
      title: 'Note',
      data: (
        <Typography.Text>
          The entire process of adding a team member will take you <span>around 20 minutes</span>.
          <br />
          <br />
          Once all the details are filled and approved by you, it has to be approved by the higher
          authority as well.{' '}
          <div style={{ display: 'inline', fontWeight: '500' }}>
            Only then, you will be able to mail the offer letter to the candidate.
          </div>
        </Typography.Text>
      ),
    };
    return (
      <Row gutter={[24, 0]}>
        <Col className={styles.payrollSetting} xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={styles.payrollSettingHeader}>
            <PayrollSettingsHeader />
          </div>
          <div>{this._renderForm()}</div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
            <Row style={{ width: '322px' }}>
              <StepsComponent />
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}

export default BasicInformation;
