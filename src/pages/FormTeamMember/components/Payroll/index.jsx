import React, { PureComponent } from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { connect } from 'umi';

import { getCurrentTenant } from '@/utils/authority';
import PayrollSettingsHeader from './components/PayrollSettingsHeader';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';
import LolipopIcon from '../../../../../public/assets/images/lolipop.png';

import styles from './index.less';

@connect(({ candidateInfo: { data = {}, currentStep = 0, checkMandatory = {} } = {} }) => ({
  data,
  currentStep,
  checkMandatory,
}))
class PayrollSetting extends PureComponent {
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

  componentDidMount() {
    const { data = {}, dispatch, currentStep } = this.props;
    const { candidate = '', processStatus } = data;

    if (processStatus === 'DRAFT') {
      if (dispatch && candidate) {
        dispatch({
          type: 'candidateInfo/updateByHR',
          payload: {
            candidate,
            currentStep,
            tenantId: getCurrentTenant(),
          },
        });
      }
    }
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

  onClickPrev = () => {
    const { currentStep = 0, dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep - 1,
      },
    });
  };

  onClickNext = () => {
    const {
      currentStep = 0,
      dispatch,
      data: { candidate = '' } = {},
      checkMandatory = {},
    } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep + 1,
        checkMandatory: {
          ...checkMandatory,
          payrollSettingCheck: true,
        },
      },
    });
    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate,
        currentStep: currentStep + 1,
        tenantId: getCurrentTenant(),
      },
    });
  };

  _renderBottomBar = () => {
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status} />
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              <Row gutter={12}>
                <Col span={12}>
                  <Button
                    type="secondary"
                    onClick={this.onClickPrev}
                    className={styles.bottomBar__button__secondary}
                  >
                    Previous
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={this.onClickNext}
                    className={`${styles.bottomBar__button__primary}`}
                  >
                    Next
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
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
          <div>{this._renderBottomBar()}</div>
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

export default PayrollSetting;
