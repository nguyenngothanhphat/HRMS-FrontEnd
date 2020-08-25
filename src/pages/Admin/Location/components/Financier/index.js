import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Button } from 'antd';
import UserRemoteMultiSelect from '@/components/UserRemoteMultiSelect';

@connect()
@Form.create()
class Financier extends Component {
  save = () => {
    const {
      form,
      dispatch,
      item: { id },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'locations/updateFinancier',
          payload: { id, ...values },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      item,
    } = this.props;
    const { emailFinanciers } = item || { emailFinanciers: {} };
    const { dep, lead, work } = emailFinanciers || {};
    return (
      <Form>
        <Form.Item label={formatMessage({ id: 'location.department-finance' })}>
          {getFieldDecorator('dep', {
            initialValue: dep,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'location.required.user' }),
              },
            ],
          })(
            <UserRemoteMultiSelect
              placeholder={formatMessage({ id: 'location.department-finance' })}
            />
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'location.lead-finance' })}>
          {getFieldDecorator('lead', {
            initialValue: lead,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'location.required.user' }),
              },
            ],
          })(
            <UserRemoteMultiSelect placeholder={formatMessage({ id: 'location.lead-finance' })} />
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'location.worklist-finance' })}>
          {getFieldDecorator('work', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'location.required.user' }),
              },
            ],
            initialValue: work,
          })(
            <UserRemoteMultiSelect
              placeholder={formatMessage({ id: 'location.worklist-finance' })}
            />
          )}
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={() => this.save()}>
            {formatMessage({ id: 'common.save' })}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Financier;
