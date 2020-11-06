import React, { Component } from 'react';
import { EditFilled } from '@ant-design/icons';
import { Col, Row, Form, Input, Radio, Button, Spin } from 'antd';
import { formatMessage, connect } from 'umi';

import styles from './index.less';

@connect(({ loading, onboardingSettings }) => ({
  loadingFetchListInsurances: loading.effects['onboardingSettings/fetchListInsurances'],
  loadingFetchAddInsurance: loading.effects['onboardingSettings/addInsurance'],
  onboardingSettings,
}))
class NonExtempNoticeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboardingSettings/fetchListInsurances',
    }).then((listInsurances) => {
      const {
        carrierName = '',
        carrierAddress = '',
        phone = '',
        policyNumber = '',
      } = listInsurances;
      if (carrierName === '' && carrierAddress === '' && phone === '' && policyNumber === '')
        this.handleEdit(true);
    });
  };

  onFinish = (values) => {
    // eslint-disable-next-line no-console
    // console.log('Success:', values);
    const { dispatch } = this.props;
    dispatch({
      type: 'onboardingSettings/addInsurance',
      data: values,
    });
    this.handleEdit(false);
  };

  onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  handleEdit = (status) => {
    this.setState({
      isEditing: status,
    });
  };

  _renderForm = () => {
    const {
      onboardingSettings: { listInsurances = {} } = {},
      loadingFetchAddInsurance,
    } = this.props;

    const {
      selfInsured = '',
      carrierName = '',
      carrierAddress = '',
      phone = '',
      policyNumber = '',
    } = listInsurances;

    const { isEditing } = this.state;

    return (
      <Form
        className={styles.NonExtempNoticeForm_form}
        wrapperCol={{ span: 24 }}
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        initialValues={{ selfInsured, carrierName, carrierAddress, phone, policyNumber }}
      >
        <Row gutter={[24, 6]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              name="selfInsured"
              label={formatMessage({ id: 'component.nonExtempNotice.isSelfInsured' })}
            >
              <Radio.Group disabled={!isEditing}>
                <Radio value>{formatMessage({ id: 'component.nonExtempNotice.yes' })}</Radio>
                <Radio value={false}>{formatMessage({ id: 'component.nonExtempNotice.no' })}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.nonExtempNotice.carrierName' })}
              name="carrierName"
            >
              <Input disabled={!isEditing} className={styles.formInput} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.nonExtempNotice.carrierAddress' })}
              name="carrierAddress"
            >
              <Input disabled={!isEditing} className={styles.formInput} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.nonExtempNotice.phoneNumber' })}
              name="phone"
            >
              <Input disabled={!isEditing} className={styles.formInput} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              required={false}
              label={formatMessage({ id: 'component.nonExtempNotice.policyNumber' })}
              name="policyNumber"
            >
              <Input disabled={!isEditing} className={styles.formInput} />
            </Form.Item>
          </Col>
          <Col xs={4} sm={4} md={4} lg={4} xl={4} offset={20}>
            <Form.Item>
              <Button
                loading={loadingFetchAddInsurance}
                disabled={!isEditing}
                type="primary"
                htmlType="submit"
                style={
                  isEditing
                    ? { backgroundColor: '#ffa100', borderColor: '#ffa100' }
                    : { backgroundColor: '#666', borderColor: '#666' }
                }
              >
                {formatMessage({ id: 'component.nonExtempNotice.save' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={12}> */}

        {/* </Row> */}
      </Form>
    );
  };

  render() {
    const { loadingFetchListInsurances = false } = this.props;
    const { isEditing } = this.state;

    return (
      <Row>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={styles.NonExtempNoticeForm}>
            <div className={styles.NonExtempNoticeForm_title}>
              <span>{formatMessage({ id: 'component.nonExtempNotice.formTitle' })}</span>
              <div
                // style={isEditing ? { color: '#666' } : { color: '#2c6df9' }}
                className={styles.editButton}
                onClick={() => this.handleEdit(!isEditing)}
              >
                <EditFilled className={styles.icon} />
                <p className={styles.label}>{isEditing ? 'Cancel' : 'Edit'}</p>
              </div>
            </div>
            <hr />
            {loadingFetchListInsurances && (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            )}
            {!loadingFetchListInsurances && this._renderForm()}
          </div>
        </Col>
      </Row>
    );
  }
}

export default NonExtempNoticeForm;
