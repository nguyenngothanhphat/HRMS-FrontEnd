import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Input, Select, Checkbox } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

const { Option } = Select;
@connect(({ type: { list } }) => ({
  list,
}))
@Form.create()
class New extends Component {
  state = {
    display: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const status = 'ACTIVE';
    dispatch({ type: 'type/fetch', payload: { status } });
  }

  handleChange = text => {
    this.setState({
      display: text,
    });
  };

  createListTypeByLocation = list => {
    const { location } = this.props;
    const listTypeByLocation = list.filter(item => item.location._id === location);
    return listTypeByLocation;
  };

  cancelModal = () => {
    const { cancelModal } = this.props;
    cancelModal();
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, cancelModal } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'customField/add',
          payload: {
            name: values.name,
            placeholder: values.placeholder,
            type: values.type,
            mandatory: values.mandatory,
            expenseType: values.expenseType,
          },
        });
        setTimeout(() => {
          cancelModal();
        }, 700);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      list,
    } = this.props;

    const listTypeByLocation = this.createListTypeByLocation(list);
    let listType = listTypeByLocation.map(t => ({
      ...t,
      type: !t.parent ? t.type : `${t.parent.type} / ${t.type}`,
    }));
    listType = listType.sort((first, next) => first.type.localeCompare(next.type));

    const { display } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Form.Item label={formatMessage({ id: 'common.expense-type' })}>
            {getFieldDecorator('expenseType', {
              rules: [
                { required: true, message: formatMessage({ id: 'custom.expenseTypeRequired' }) },
              ],
            })(
              <Select
                placeholder={formatMessage({ id: 'custom.placeholderExpenseType' })}
                showSearch
                filterOption={(input, option) =>
                  typeof option.props.children === 'string' &&
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                }
              >
                {listType.map(({ id, type }) => (
                  <Option key={id} value={id}>
                    {type}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item label={formatMessage({ id: 'custom.NAME' })}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: formatMessage({ id: 'custom.nameRequired' }) }],
            })(<Input placeholder={formatMessage({ id: 'custom.placeholderName' })} />)}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item label={formatMessage({ id: 'custom.FIELDTYPE' })}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: formatMessage({ id: 'custom.typeRequired' }) }],
            })(
              <Select
                placeholder={formatMessage({ id: 'custom.placeholderType' })}
                onChange={value => this.handleChange(value)}
              >
                <Option value="text">Text</Option>
                <Option value="number">Number</Option>
                <Option value="checkbox">Yes/No</Option>
                <Option value="date">Date</Option>
              </Select>
            )}
          </Form.Item>
        </Row>
        {display !== 'checkbox' && (
          <Row>
            <Form.Item label={formatMessage({ id: 'custom.PLACEHOLDER' })}>
              {getFieldDecorator('placeholder')(
                <Input placeholder={formatMessage({ id: 'custom.placeholder' })} />
              )}
            </Form.Item>
          </Row>
        )}
        <Row>
          {display !== 'checkbox' && (
            <Form.Item>
              {getFieldDecorator('mandatory', {
                initialValue: false,
              })(<Checkbox>{formatMessage({ id: 'custom.MANDATORY' })}</Checkbox>)}
            </Form.Item>
          )}
        </Row>
        <Row style={{ marginTop: 10 }} type="flex" justify="center">
          <Row style={{ width: '40%' }} type="flex" justify="space-between">
            <Button onClick={this.cancelModal}>{formatMessage({ id: 'common.cancel' })}</Button>
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: 'common.save' })}
            </Button>
          </Row>
        </Row>
      </Form>
    );
  }
}

export default New;
