/* eslint-disable compat/compat */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Select, Modal } from 'antd';
import React, { PureComponent } from 'react';
import FormDefineTeam from '../FormDefineTeam';
import s from './index.less';

const { Option } = Select;
const { confirm } = Modal;

class FormDepartment extends PureComponent {
  showConfirm = (id) => {
    const { removeDepartment = () => {} } = this.props;
    confirm({
      title: 'Do you want to delete these department?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        removeDepartment(id);
      },
      onCancel() {},
    });
  };

  handleRemove = () => {
    const { onRemove = () => {}, listDepartment = [], field: { name } = {} } = this.props;
    const itemRemove = listDepartment[name] || {};
    const { _id: id } = itemRemove;
    if (id) {
      this.showConfirm(id);
    } else onRemove();
  };

  render() {
    const { field = {}, list = [] } = this.props;
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
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const checkUnique = getFieldValue('listDepartment').filter(
                      (item) => item?.name && item?.name === value,
                    );
                    if (checkUnique.length <= 1) {
                      return Promise.resolve();
                    }
                    return Promise.reject('This department has already been used!');
                  },
                }),
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
                {list.map((item) => (
                  <Option key={item}>{item}</Option>
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
