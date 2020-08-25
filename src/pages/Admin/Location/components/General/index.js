import React, { Component } from 'react';
import { Form, Button, Radio, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import EmojiPicker from '@/components/EmojiPicker';
import CurrencySelect from '@/components/CurrencySelect';

@connect()
@Form.create()
class General extends Component {
  statuses = [{ label: 'Active', value: 'ACTIVE' }, { label: 'Disable', value: 'INACTIVE' }];

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      item: { id },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'locations/updateGeneral',
          payload: { id, ...values },
        });
      }
    });
  };

  render() {
    const {
      item: { name, nativeName, code, currency, alpha3Code, flagIcon, status },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <Row type="flex" gutter={8}>
          <Col span={24} md={4}>
            <Form.Item label={formatMessage({ id: 'location.flagIcon' })}>
              {getFieldDecorator('flagIcon', {
                initialValue: flagIcon,
                rules: [
                  { required: true, message: formatMessage({ id: 'location.required.flagIcon' }) },
                ],
              })(<EmojiPicker placeholder={formatMessage({ id: 'location.flagIcon' })} />)}
            </Form.Item>
          </Col>
          <Col span={24} md={4}>
            <Form.Item label={formatMessage({ id: 'location.code' })}>
              {getFieldDecorator('code', {
                initialValue: code,
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
                    message: formatMessage({ id: 'location.required.code' }),
                  },
                  {
                    pattern: 2,
                    message: formatMessage({ id: 'location.len.code' }, { len: 2 }),
                  },
                ],
              })(<Input placeholder="XX" />)}
            </Form.Item>
          </Col>
          <Col span={24} md={4}>
            <Form.Item label={formatMessage({ id: 'location.alpha3Code' })}>
              {getFieldDecorator('alpha3Code', {
                initialValue: alpha3Code,
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
                    message: formatMessage({ id: 'location.required.alpha3Code' }),
                  },
                  {
                    len: 3,
                    message: formatMessage({ id: 'location.len.alpha3Code' }, { len: 3 }),
                  },
                ],
              })(<Input placeholder="XXX" />)}
            </Form.Item>
          </Col>
          <Col span={24} md={20}>
            <Form.Item label={formatMessage({ id: 'location.name' })}>
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'location.required.name',
                    }),
                  },
                  {
                    min: 2,
                    message: formatMessage(
                      {
                        id: 'location.min.name',
                      },
                      { min: 2 }
                    ),
                  },
                  {
                    max: 60,
                    message: formatMessage(
                      {
                        id: 'location.max.name',
                      },
                      { max: 60 }
                    ),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'location.name' })} />)}
            </Form.Item>
          </Col>
          <Col span={24} md={20}>
            <Form.Item label={formatMessage({ id: 'location.nativeName' })}>
              {getFieldDecorator('nativeName', {
                initialValue: nativeName,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'location.required.nativeName',
                    }),
                  },
                  {
                    min: 2,
                    message: formatMessage(
                      {
                        id: 'location.min.nativeName',
                      },
                      { min: 2 }
                    ),
                  },
                  {
                    max: 125,
                    message: formatMessage(
                      {
                        id: 'location.max.nativeName',
                      },
                      { max: 125 }
                    ),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'location.nativeName' })} />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={formatMessage({ id: 'location.currency' })}>
              {getFieldDecorator('currency', {
                initialValue: currency,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'location.required.currency' }),
                  },
                ],
              })(<CurrencySelect />)}
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item label={formatMessage({ id: 'common.status' })}>
              {getFieldDecorator('status', {
                initialValue: status || 'ACTIVE',
              })(<Radio.Group options={this.statuses} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'common.save' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default General;
