import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Button, Input, Select } from 'antd';
import { connect } from 'dva';
import ImagesUpload from './components/ImagesUpload';

const { Option } = Select;

@Form.create()
@connect(({ loading, type, locations }) => ({
  saving: loading.effects['type/saveItem'],
  type,
  defaultLocation: locations.defaultLocation,
}))
class TypeBox extends PureComponent {
  componentDidUpdate({ item: oldItem }) {
    const { item: { id, type, thumbnailUrl } = { type: '', thumbnailUrl: '' }, form } = this.props;
    if (oldItem.id !== id) form.setFieldsValue({ type, thumbnailUrl });
  }

  onClose = () => {
    const { onClose } = this.props;
    if (typeof onClose === 'function') onClose();
  };

  handleSave = () => {
    const {
      form,
      dispatch,
      item: { id },
      defaultLocation,
      pathname,
    } = this.props;
    const method = id ? 'update' : 'add';
    form.validateFieldsAndScroll((err, values) => {
      const { location, status, type, thumbnailUrl, parent } = values;
      if (!err) {
        const data = {
          method,
          ...(method === 'add' ? {} : { id }),
          ...(method === 'add' ? { parent } : {}),
          location,
          status,
          type,
          thumbnailUrl:
            thumbnailUrl ||
            'https://stgexpenso.paxanimi.ai/images/5df0bd20c00cc6e170ce3963/bill_type_miscellaneous.png',
        };
        dispatch({
          type: 'type/saveItem',
          payload: data,
          defaultLocation,
          pathname,
        }).then(response => {
          if (response) {
            form.resetFields();
            this.onClose();
          }
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      saving,
      item: { type, parent, thumbnailUrl, status, id },
      type: { list: listType = [] } = {},
      defaultLocation,
    } = this.props;
    const listMainType = listType.filter(
      item => !item.parent && item.location._id === defaultLocation
    );
    return (
      <Form>
        <Form.Item label={formatMessage({ id: 'type.name' })}>
          {getFieldDecorator('type', {
            initialValue: type,
            rules: [{ required: true, message: formatMessage({ id: 'type.required.type' }) }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'currency.nativeIcon' })}>
          {getFieldDecorator('thumbnailUrl', {
            initialValue: thumbnailUrl,
          })(<ImagesUpload />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'type.parent-type' })}>
          {getFieldDecorator('parent', {
            initialValue: parent ? parent.id : '',
          })(
            <Select style={{ width: '100%' }} disabled={id}>
              <Option value="">None</Option>
              {listMainType.map(item => {
                return (
                  <Option key={`listMainType_${item.id}`} value={item.id}>
                    {item.type}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'common.status' })}>
          {getFieldDecorator('status', {
            initialValue: status || 'ACTIVE',
          })(
            <Select>
              <Option value="ACTIVE">{formatMessage({ id: 'active' })}</Option>
              <Option value="INACTIVE">{formatMessage({ id: 'disabled' })}</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button loading={saving} className="m-1 btn-info" onClick={this.handleSave}>
            {formatMessage({ id: 'common.save' })}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default TypeBox;
