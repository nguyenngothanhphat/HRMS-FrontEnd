import React, { PureComponent } from 'react';
import { Row, Col, Button, Card, Form, Input } from 'antd';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import s from './index.less';

@Form.create()
@connect(({ setting: { item }, loading }) => ({
  item,
  fetching: loading.effects['setting/fetch'],
  saving: loading.effects['setting/save'],
}))
class General extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'setting/fetch' });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: 'setting/update',
        payload: {
          method: 'setting',
          id: 'expense-app',
          ...values,
        },
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      item,
      fetching,
      saving,
    } = this.props;
    const { name, description } = item;
    return (
      <Form className={s.content} onSubmit={this.handleSubmit}>
        <Card
          loading={fetching}
          extra={
            <Button loading={saving} type="primary" htmlType="submit">
              <FormattedMessage id="setting.submit.button" defaultMessage="Save" />
            </Button>
          }
        >
          {item && (
            <Row gutter={16}>
              <Col xs={6} lg={4}>
                <strong className={s.title}>
                  <FormattedMessage
                    id="setting.general.info"
                    defaultMessage="General information"
                  />
                </strong>
              </Col>
              <Col xs={18} lg={20}>
                <Form.Item
                  label={formatMessage({ id: 'setting.name', defaultMessage: 'Company name' })}
                >
                  {getFieldDecorator('name', {
                    initialValue: name,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'setting.required.name',
                          defaultMessage: 'Please enter the name of company.',
                        }),
                      },
                      {
                        min: 2,
                        message: formatMessage(
                          {
                            id: 'setting.min.name',
                            defaultMessage:
                              'Company name must be contained at least {min, number} {min, plural, one {character} other {characters}}',
                          },
                          { min: 2 }
                        ),
                      },
                      {
                        max: 125,
                        message: formatMessage(
                          {
                            id: 'setting.max.name',
                            defaultMessage:
                              'Company name must be contained at least {max, number} {max, plural, one {character} other {characters}}',
                          },
                          { max: 125 }
                        ),
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  label={formatMessage({
                    id: 'setting.description',
                    defaultMessage: 'Description',
                  })}
                >
                  {getFieldDecorator('description', {
                    initialValue: description,
                    rules: [
                      {
                        min: 60,
                        message: formatMessage(
                          {
                            id: 'setting.min.description',
                            defaultMessage:
                              'Company description must be contained at least {min, number} {min, plural, one {character} other {characters}}',
                          },
                          { min: 60 }
                        ),
                      },
                      {
                        max: 500,
                        message: formatMessage(
                          {
                            id: 'setting.max.description',
                            defaultMessage:
                              'Company description must be contained at most {max, number} {max, plural, one {character} other {characters}}',
                          },
                          { max: 500 }
                        ),
                      },
                    ],
                  })(<Input.TextArea autosize={{ maxRows: 6 }} />)}
                </Form.Item>
              </Col>
            </Row>
          )}
        </Card>
      </Form>
    );
  }
}

export default General;
