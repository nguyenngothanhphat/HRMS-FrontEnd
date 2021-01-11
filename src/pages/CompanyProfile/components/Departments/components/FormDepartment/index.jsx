/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import { DeleteOutlined } from '@ant-design/icons';
import { Form, Select } from 'antd';
import React, { PureComponent } from 'react';
import FormDefineTeam from '../FormDefineTeam';
import s from './index.less';

const dummyListDepartment = [
  { _id: '12345', name: 'Engineering' },
  { _id: '45678', name: 'User Experience Design & Research' },
  { _id: '99999', name: 'Visual Design' },
];

const { Option } = Select;

class FormDepartment extends PureComponent {
  handleRemove = () => {
    const { onRemove = () => {} } = this.props;
    onRemove();
  };

  render() {
    const { field = {} } = this.props;
    return (
      <div className={s.content}>
        <div className={s.viewTop}>
          <div className={s.viewSelect}>
            <Form.Item
              {...field}
              label={false}
              name={[field.name, 'name']}
              fieldKey={[field.fieldKey, 'name']}
              rules={[
                {
                  required: true,
                  message: 'Please enter name department!',
                },
              ]}
            >
              <Select
                placeholder="Select Department"
                showArrow
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {dummyListDepartment.map((item) => (
                  <Option key={item._id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className={s.viewRow__action}>
            <div className={s.action} onClick={this.handleRemove}>
              <DeleteOutlined className={s.viewRow__action__icon} />
              <span>Delete</span>
            </div>
          </div>
        </div>
        <Form.Item>
          <FormDefineTeam fieldKey={field.name} />
        </Form.Item>
      </div>
    );
  }
}

export default FormDepartment;
