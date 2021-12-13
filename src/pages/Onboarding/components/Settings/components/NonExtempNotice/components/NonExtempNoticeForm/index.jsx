import React, { Component } from 'react';
import { EditFilled } from '@ant-design/icons';
import { Col, Row, Form, Input, Radio, Button, Spin } from 'antd';
import { formatMessage, connect } from 'umi';

import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

@connect(({ loading, onboardingSettings }) => ({
  loadingFetchAddInsurance: loading.effects['onboardingSettings/addInsurance'],
  onboardingSettings,
}))
class NonExtempNoticeForm extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
  }

  componentDidMount = () => {
    const { onboardingSettings: { listInsurances = {} } = {} } = this.props;

    const { carrierName = '', carrierAddress = '', phone = '', policyNumber = '' } = listInsurances;
    if (carrierName === '' && carrierAddress === '' && phone === '' && policyNumber === '')
      this.handleEdit(false, false);
  };

  onFinish = async (values) => {
    const { dispatch } = this.props;
    const tenantId = getCurrentTenant();
    const res = await dispatch({
      type: 'onboardingSettings/addInsurance',
      data: { ...values, tenantId },
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      this.handleEdit(false, true);
      dispatch({
        type: 'onboardingSettings/fetchListInsurances',
        payload: {
          tenantId,
        },
      });
    }
  };

  onFinishFailed = (errorInfo) => {

  };

  setValueForForm = (data) => {
    const {
      selfInsured = '',
      carrierName = '',
      carrierAddress = '',
      phone = '',
      policyNumber = '',
    } = data;
    this.formRef.current.setFieldsValue({
      selfInsured,
      carrierName,
      carrierAddress,
      phone,
      policyNumber,
    });
  };

  handleEdit = (status, isSubmitting) => {
    const { onboardingSettings: { listInsurances = {} } = {} } = this.props;
    this.setState({
      isEditing: status,
    });
    if (!isSubmitting) {
      this.setValueForForm(listInsurances);
    }
  };

  _renderForm = () => {
    const { onboardingSettings: { listInsurances = {} } = {}, loadingFetchAddInsurance } =
      this.props;

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
        ref={this.formRef}
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
              rules={[
                {
                  pattern: /^[+]*[\d]{0,10}$/,
                  message: 'Wrong phone number format!',
                },
              ]}
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
              rules={[
                { required: true, message: 'Please input policy number' },
                // {
                //   pattern: /^[+]*[\d]{0,10}$/,
                //   message: 'Only number!',
                // },
              ]}
            >
              <Input disabled={!isEditing} className={styles.formInput} />
            </Form.Item>
          </Col>
          <Col xs={4} sm={4} md={4} lg={4} xl={4} offset={20}>
            {isEditing && (
              <Form.Item>
                <Button
                  loading={loadingFetchAddInsurance}
                  // disabled={!isEditing}
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
            )}
          </Col>
        </Row>
        {/* <Row gutter={12}> */}

        {/* </Row> */}
      </Form>
    );
  };

  render() {
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
                onClick={() => this.handleEdit(!isEditing, false)}
              >
                <EditFilled className={styles.icon} />
                <p className={styles.label}>{isEditing ? 'Cancel' : 'Edit'}</p>
              </div>
            </div>
            <hr />

            {this._renderForm()}
          </div>
        </Col>
      </Row>
    );
  }
}

export default NonExtempNoticeForm;
