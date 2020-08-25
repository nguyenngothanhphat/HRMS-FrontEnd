import React, { PureComponent } from 'react';
import { Form, Input, Radio, Row, Col, Skeleton, Button } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import EmojiPicker from '@/components/EmojiPicker';

@connect(({ currency: { item }, loading }) => ({
  item,
  loading: loading.effects['currency/fetchItem'],
  saving: loading.effects['currency/saveItem'],
}))
@Form.create()
class CurrencyForm extends PureComponent {
  statuses = [
    { label: formatMessage({ id: 'active', defaultMessage: 'ACTIVE' }), value: 'ACTIVE' },
    { label: formatMessage({ id: 'disabled', defaultMessage: 'Disable' }), value: 'INACTIVE' },
  ];

  componentDidMount() {
    const { dispatch, id } = this.props;
    dispatch({ type: 'currency/fetchItem', payload: id });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'currency/save', payload: { item: undefined } });
  }

  onSubmit = e => {
    e.preventDefault();
    const { form, dispatch, onSuccess, item } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'currency/saveItem',
          payload: { item: values, method: item ? 'update' : 'add' },
        }).then(result => {
          if (result && typeof onSuccess === 'function') onSuccess();
        });
      }
    });
  };

  render() {
    const {
      item,
      form: { getFieldDecorator },
      loading,
      saving,
    } = this.props;
    const { _id, name, symbol, nativeIcon, status } = item || {};
    return (
      <Form onSubmit={this.onSubmit}>
        <Skeleton loading={loading}>
          <Row type="flex" gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item label={formatMessage({ id: 'currency.code', defaultMessage: 'Code' })}>
                {getFieldDecorator('_id', {
                  initialValue: _id,
                  normalize(value) {
                    let newValue = value;
                    if (typeof newValue === 'string')
                      newValue = value
                        .replace(/[\d\s]+/gi, '')
                        .trim()
                        .toUpperCase();
                    return newValue;
                  },
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'currency.required.code',
                        defaultMessage: 'Please enter code of currency',
                      }),
                    },
                    {
                      len: 3,
                      message: formatMessage(
                        {
                          id: 'currency.len.code',
                          defaultMessage: 'Code of currency is had only {len} characters.',
                        },
                        { len: 3 }
                      ),
                    },
                  ],
                })(<Input readOnly={typeof _id === 'string'} />)}
              </Form.Item>
            </Col>
            <Col xs={24} sm={18}>
              <Form.Item label={formatMessage({ id: 'currency.name', defaultMessage: 'Name' })}>
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'currency.required.name',
                        defaultMessage: 'Please enter name of currency.',
                      }),
                    },
                    {
                      min: 2,
                      message: formatMessage(
                        {
                          id: 'currency.min.name',
                          defaultMessage:
                            'Name of currency must be contained at least {min} character(s)',
                        },
                        { min: 2 }
                      ),
                    },
                    {
                      max: 120,
                      message: formatMessage(
                        {
                          id: 'currency.max.name',
                          defaultMessage:
                            'Name of currency must be contained at most {max} character(s)',
                        },
                        { max: 120 }
                      ),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item label={formatMessage({ id: 'currency.symbol', defaultMessage: 'Sign' })}>
                {getFieldDecorator('symbol', {
                  initialValue: symbol,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'currency.required.symbol',
                        defaultMessage: 'Please enter symbol of currency.',
                      }),
                    },
                    {
                      max: 4,
                      message: formatMessage(
                        {
                          id: 'currency.len.symbol',
                          defaultMessage: 'Code of symbol is had only {max} characters.',
                        },
                        { max: 4 }
                      ),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item
                label={formatMessage({ id: 'currency.nativeIcon', defaultMessage: 'Icon' })}
              >
                {getFieldDecorator('nativeIcon', {
                  initialValue: nativeIcon,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'currency.required.nativeIcon',
                        defaultMessage: 'Please provide a native icon',
                      }),
                    },
                  ],
                })(<EmojiPicker />)}
              </Form.Item>
            </Col>
            <Col xs={12} sm={12}>
              <Form.Item label={formatMessage({ id: 'currency.status', defaultMessage: 'Status' })}>
                {getFieldDecorator('status', {
                  initialValue: status || 'ACTIVE',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'currency.required.status',
                        defaultMessage: 'Please provide status of currency',
                      }),
                    },
                  ],
                })(<Radio.Group options={this.statuses} />)}
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button loading={saving} type="primary" htmlType="submit">
                <FormattedMessage id="currency.submit.button" defaultMessage="Save" />
              </Button>
            </Col>
          </Row>
        </Skeleton>
      </Form>
    );
  }
}

export default CurrencyForm;
