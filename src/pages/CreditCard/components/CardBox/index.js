import React, { Component } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Col, Input, Button, Skeleton, Modal } from 'antd';
import { connect } from 'dva';
import valid from 'card-validator';
import UserRemoteSelect from '@/components/UserRemoteSelect';
import { formatCreditCardNumber } from '@/utils/utils';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ creditCard: { item }, loading }) => ({
  item,
  saving: loading.effects['creditCard/saveCard'],
  loading: loading.effects['creditCard/fetchItem'],
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
    const { dispatch, form, item, onCancel } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const number = values.seriCard.replace(/\s/g, '');
      const lastFourDigits = number.slice(-4);
      dispatch({
        type: 'creditCard/saveCard',
        payload: {
          method: item._id ? 'update' : 'add',
          number,
          status: 'ACTIVE',
          id: item._id,
          lastFourDigits,
          ...values,
        },
      }).then(response => {
        if (typeof onCancel === 'function' && response === true) onCancel();
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

  showModalReject = type => {
    const { dispatch, item, onCancel } = this.props;
    const action = {
      delete: {
        title: `Do you want to ${type} this credit card?`,
        onOk() {
          dispatch({
            type: 'creditCard/saveCard',
            payload: {
              method: 'update',
              ...item,
              status: type.toUpperCase(),
            },
          }).then(() => {
            if (typeof onCancel === 'function') onCancel();
          });
        },
      },
    };

    Modal.confirm({
      ...action.delete,
    });
  };

  renderTitleBtn = title => {
    const objTitle = [
      {
        name: 'PENDING',
        title: formatMessage({ id: 'common.approve' }),
      },
      {
        name: 'ACTIVE',
        title: formatMessage({ id: 'common.save' }),
      },
      {
        name: 'DISABLE',
        title: formatMessage({ id: 'common.active' }),
      },
    ];
    const result = objTitle.find(item => item.name === title) || {
      title: formatMessage({ id: 'common.save' }),
    };
    return result.title || '';
  };

  render() {
    const {
      form: { getFieldDecorator, saving, loading },
      item,
    } = this.props;
    const { number, firstName, lastName, name, assignEmail, status } = item || {};

    return (
      <Skeleton loading={loading} style={{ padding: '0 24px', height: '100%' }}>
        {item && (
          <Form className={styles.formAdd} layout="horizontal" style={{ height: '100%' }}>
            <FormItem label={formatMessage({ id: 'creditCard.form.number' })}>
              {getFieldDecorator('seriCard', {
                rules: [
                  { required: true, message: formatMessage({ id: 'creditCard.required.number' }) },
                  {
                    min: 15,
                    message: formatMessage({ id: 'creditCard.min.number' }, { min: 15 }),
                  },
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
                        message: formatMessage({
                          id: 'creditCard.required.firstName',
                        }),
                      },
                    ],
                  })(
                    <Input
                      className={styles.input}
                      placeholder={formatMessage({
                        id: 'creditCard.firstName',
                      })}
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
                        message: formatMessage({
                          id: 'creditCard.required.lastName',
                        }),
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
            <FormItem
              label={formatMessage({
                id: 'creditCard.type',
              })}
            >
              {getFieldDecorator('name', {
                initialValue: name,
              })(
                <Input
                  className={styles.input}
                  readOnly
                  placeholder={formatMessage({
                    id: 'creditCard.type',
                  })}
                />
              )}
            </FormItem>
            <FormItem
              label={formatMessage({
                id: 'creditCard.form.assign',
              })}
            >
              {getFieldDecorator('assignEmail', {
                initialValue: assignEmail,
              })(
                <UserRemoteSelect
                  placeholder={formatMessage({
                    id: 'creditCard.form.assign',
                  })}
                  styleName={styles.select}
                />
              )}
            </FormItem>
            <div className={styles.controlButton}>
              <Button
                className={styles.btn}
                onClick={() => this.handleCancel()}
                style={{ marginRight: 8 }}
              >
                <FormattedMessage id="common.cancel" />
              </Button>
              {status === 'PENDING' && (
                <Button
                  className={styles.btn}
                  onClick={() => this.showModalReject('reject')}
                  type="danger"
                  style={{ marginRight: 8 }}
                >
                  <FormattedMessage id="common.status.reject" />
                </Button>
              )}
              {status === 'ACTIVE' && (
                <Button
                  className={styles.btn}
                  onClick={() => this.showModalReject('disable')}
                  type="danger"
                  style={{ marginRight: 8 }}
                >
                  <FormattedMessage id="common.button.disable" />
                </Button>
              )}
              <Button
                className={styles.btn}
                onClick={e => this.handleSave(e)}
                type="primary"
                loading={saving}
              >
                {this.renderTitleBtn(status)}
              </Button>
            </div>
          </Form>
        )}
      </Skeleton>
    );
  }
}

export default CardBox;
