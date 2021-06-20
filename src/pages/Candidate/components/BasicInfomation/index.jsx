import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Typography, Button, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import BasicInformationHeader from './components/BasicInformationHeader';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';

import styles from './index.less';

@connect(({ candidateProfile: { data, checkMandatory, localStep, tempData } = {}, loading }) => ({
  data,
  checkMandatory,
  localStep,
  tempData,
  loading: loading.effects['candidateProfile/fetchCandidateById'],
}))
class BasicInformation extends PureComponent {
  static getDerivedStateFromProps(props) {
    if ('data' in props) {
      return {
        data: props.data,
        checkMandatory: props.checkMandatory,
        tempData: props.tempData || {},
      };
    }
    return null;
  }

  componentDidMount() {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
  }

  handleChange = (e) => {
    const name = Object.keys(e).find((x) => x);
    const value = Object.values(e).find((x) => x);
    const { dispatch } = this.props;

    const { tempData, checkMandatory, data } = this.state;
    tempData[name] = value;
    const { checkStatus = {} } = tempData;
    const { fullName = '', privateEmail = '', previousExperience = '' } = data;
    if (fullName !== '' && privateEmail !== '' && previousExperience !== '') {
      checkStatus.filledBasicInformation = true;
    } else {
      checkStatus.filledBasicInformation = false;
    }
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        tempData: {
          ...tempData,
        },
        checkMandatory: {
          ...checkMandatory,
          filledBasicInformation: checkStatus.filledBasicInformation,
        },
      },
    });
  };

  onFinish = (values) => {
    const { data } = this.state;
    const { dispatch, localStep } = this.props;
    const { _id } = data;
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: localStep + 1,
      },
    });
    dispatch({
      type: 'candidateProfile/updateByCandidateEffect',
      payload: {
        fullName: values.fullName,
        candidate: _id,
        tenantId: getCurrentTenant(),
      },
    });
    dispatch({
      type: 'candidateProfile/saveOrigin',
      payload: {
        fullName: values.fullName,
      },
    });
  };

  _renderForm = () => {
    return (
      <div className={styles.basicInformation__form}>
        <Row gutter={[48, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.fullName' })}
              name="fullName"
              rules={[{ required: true, message: `'Please input your full name!'` }]}
            >
              <Input
                // onChange={(e) => this.handleChange(e)}
                className={styles.formInput}
                name="fullName"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.privateEmail' })}
              name="privateEmail"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
                {
                  type: 'email',
                  message: 'Email invalid!',
                },
              ]}
            >
              <Input className={styles.formInput} name="privateEmail" disabled="true" />
            </Form.Item>
          </Col>
          {/* <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.workEmail' })}
              className={styles.formInput__email}
              name="workEmail"
            >
              <Input className={styles.formInput} name="workEmail" disabled="true" />
            </Form.Item>
          </Col> */}
        </Row>
        <Row gutter={[48, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.basicInformation.experienceYear' })}
              name="previousExperience"
              rules={[
                {
                  pattern: /^[0-9]*$/,
                  message: 'Year of experience invalid!',
                },
              ]}
            >
              <Input disabled="true" className={styles.formInput} name="previousExperience" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  };

  _renderStatus = () => {
    const { checkMandatory } = this.props;
    const { filledBasicInformation } = checkMandatory;
    return !filledBasicInformation ? (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={styles.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  _renderBottomBar = () => {
    const { checkMandatory } = this.props;
    const { filledBasicInformation } = checkMandatory;

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
                // onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary} ${
                  !filledBasicInformation ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={!filledBasicInformation}
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
    const { data = {} } = this.state;
    const { workEmail, fullName, privateEmail, previousExperience } = data;
    const { loading } = this.props;
    const Note = {
      title: 'Note',
      data: (
        <Typography.Text>
          Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
          working days for entire process to complete
        </Typography.Text>
      ),
    };
    if (loading) {
      return (
        <div className={styles.viewLoading}>
          <Spin />
        </div>
      );
    }
    return (
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={styles.basicInformation}>
            <Form
              wrapperCol={{ span: 24 }}
              name="basic"
              initialValues={
                fullName.length > 1 && { workEmail, fullName, privateEmail, previousExperience }
              }
              onFocus={this.onFocus}
              onValuesChange={this.handleChange}
              onFinish={this.onFinish}
              loading={loading}
            >
              <div className={styles.basicInformation__top}>
                <BasicInformationHeader />
                <hr />
                {this._renderForm()}
              </div>
              {this._renderBottomBar()}
            </Form>
          </div>
        </Col>
        <Col className={styles.RightComponents} xs={24} sm={24} md={24} lg={8} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
            <Row className={styles.stepRow}>
              <StepsComponent />
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}

export default BasicInformation;
