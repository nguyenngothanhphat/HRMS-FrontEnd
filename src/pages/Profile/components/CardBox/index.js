import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Col, Input, Button, Skeleton } from 'antd';
// import UserRemoteSelect from '@/components/UserRemoteSelect';
import { connect } from 'dva';
import valid from 'card-validator';
import { formatCreditCardNumber } from '@/utils/utils';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ creditCard: { item }, loading, user }) => ({
  item,
  saving: loading.effects['creditCard/saveCard'],
  loading: loading.effects['creditCard/fetchItem'],
  user,
}))
class CardBox extends Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'creditCard/save', payload: { item: undefined } });
  }

  handleCancel = e => {
    const { onCancel, form } = this.props;
    if (typeof onCancel === 'function') onCancel(e);
    form.resetFields();
  };

  handleSave = event => {
    event.preventDefault();
    const {
      dispatch,
      form,
      item,
      onCancel,
      user: {
        currentUser: { email },
      },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: 'creditCard/saveCard',
        payload: {
          method: item._id ? 'update' : 'add',
          number: values.seriCard.replace(/\s/g, ''),
          id: item._id,
          assignEmail: email,
          lastFourDigits: values.seriCard.slice(-4),
          ...values,
        },
      }).then(response => {
        if (typeof onCancel === 'function' && response === true) {
          onCancel();
          form.resetFields();
        }
      });
    });
  };

  onChange = e => {
    const { form } = this.props;
    e.target.value = formatCreditCardNumber(e.target.value);
    const numberValidation = valid.number(e.target.value);
    const type = numberValidation.card ? numberValidation.card.type : '';
    const number = e.target.value.replace(/\s/g, '');
    const formX = ' XXXX - XXXX - XXXX - ';
    const lastNumber = number.length > 12 ? formX.concat(number.slice(-4)) : '';
    const formatType = type.charAt(0).toUpperCase() + type.slice(1);
    const name = formatType.concat(lastNumber);
    form.setFieldsValue({ name });
  };

  render() {
    const {
      form: { getFieldDecorator, saving, loading },
      item,
    } = this.props;
    const { number, firstName, lastName, name } = item || {};

    return (
      <Skeleton loading={loading} style={{ padding: '0 24px', height: '100%' }}>
        <Form className={styles.formAdd} layout="horizontal" style={{ height: '100%' }}>
          <FormItem label={formatMessage({ id: 'creditCard.form.number' })}>
            {getFieldDecorator('seriCard', {
              rules: [
                { required: true, message: formatMessage({ id: 'creditCard.required.number' }) },
                { min: 15, message: formatMessage({ id: 'creditCard.min.number' }, { min: 15 }) },
              ],
              initialValue: formatCreditCardNumber(number),
            })(
              <Input
                className={styles.input}
                placeholder="XXXX - XXXX - XXXX - XXXX"
                onChange={this.onChange}
              />
            )}
          </FormItem>
          <Row gutter={48}>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'creditCard.form.firstName' })}>
                {getFieldDecorator('firstName', {
                  initialValue: firstName,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'creditCard.required.firstName' }),
                    },
                  ],
                })(
                  <Input
                    className={styles.input}
                    placeholder={formatMessage({ id: 'creditCard.firstName' })}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'creditCard.form.lastName' })}>
                {getFieldDecorator('lastName', {
                  initialValue: lastName,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'creditCard.required.firstName' }),
                    },
                  ],
                })(
                  <Input
                    className={styles.input}
                    placeholder={formatMessage({ id: 'creditCard.lastName' })}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem label={formatMessage({ id: 'creditCard.type' })}>
            {getFieldDecorator('name', {
              initialValue: name,
            })(
              <Input
                className={styles.input}
                readOnly
                placeholder={formatMessage({ id: 'creditCard.type' })}
              />
            )}
          </FormItem>
          <div className={styles.controlButton}>
            <Button onClick={() => this.handleCancel()} style={{ marginRight: 8 }}>
              {formatMessage({ id: 'common.cancel' })}
            </Button>
            <Button onClick={e => this.handleSave(e)} type="primary" loading={saving}>
              {formatMessage({ id: 'common.save' })}
            </Button>
          </div>
        </Form>
      </Skeleton>
    );
  }
}

export default CardBox;
