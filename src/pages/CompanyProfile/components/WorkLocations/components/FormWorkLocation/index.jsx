/* eslint-disable compat/compat */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Form, Input, Select, Divider, Modal } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import s from './index.less';

const { Option } = Select;
const { confirm } = Modal;

class FormWorkLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: '',
    };
  }

  componentDidMount() {
    const { name = 0, listLocation = [] } = this.props;
    const itemLocation = listLocation[name] || {};
    this.setState({
      country: itemLocation?.country,
    });
  }

  onChangeCountry = (country, nameField) => {
    const { formRef = {}, isListField = false, name } = this.props;
    this.setState({
      country,
    });
    if (isListField) {
      const workLocations = formRef.current.getFieldValue('workLocations');
      const cloneWorkLocations = [...workLocations];
      cloneWorkLocations[name].state = undefined;
      formRef.current.setFieldsValue({
        workLocations: cloneWorkLocations,
      });
    } else {
      formRef.current.setFieldsValue({
        [nameField]: undefined,
      });
    }
  };

  findListState = (idCountry) => {
    const { listCountry = [] } = this.props;
    const itemCountry = listCountry.find((item) => item._id === idCountry) || {};
    const listState = itemCountry.states || [];
    return listState;
  };

  getName = (fieldName) => {
    const { isListField, fieldKey } = this.props;
    return isListField ? [fieldKey, fieldName] : fieldName;
  };

  showConfirm = (id) => {
    const { removeLocation = () => {} } = this.props;
    confirm({
      title: 'Do you want to delete these location?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        removeLocation(id);
      },
      onCancel() {},
    });
  };

  handleRemove = () => {
    const { onRemove = () => {}, listLocation = [], name = 0 } = this.props;
    const itemRemove = listLocation[name] || {};
    const { _id: id } = itemRemove;
    if (id) {
      this.showConfirm(id);
    } else onRemove();
  };

  render() {
    const { country = '' } = this.state;
    const { listCountry = [], isListField = false, name = 0, listLocation = [] } = this.props;
    const listState = this.findListState(country) || [];
    const itemLocation = listLocation[name] || {};
    return (
      <div className={s.content} style={name > 0 ? { marginTop: '24px' } : {}}>
        <div className={s.content__viewBottom}>
          <div className={s.content__viewBottom__viewTitle}>
            <p className={s.title}>{itemLocation?.name || 'New work location'}</p>
            <div className={s.action} onClick={this.handleRemove}>
              <DeleteOutlined className={s.action__icon} />
              <span>Delete</span>
            </div>
          </div>

          <div className={s.content__viewBottom__row}>
            <p className={s.content__viewBottom__row__textLabel}>Name</p>
            <Form.Item
              isListField={isListField}
              name={this.getName('name')}
              label={false}
              rules={[
                {
                  required: true,
                  message: 'Please enter name!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const checkUnique = getFieldValue('workLocations').filter(
                      (item) => item?.name && item?.name === value,
                    );
                    if (checkUnique.length <= 1) {
                      return Promise.resolve();
                    }
                    return Promise.reject('This name has already been used!');
                  },
                }),
              ]}
            >
              <Input placeholder="Name Location" />
            </Form.Item>
          </div>
          <div className={s.content__viewBottom__row}>
            <p className={s.content__viewBottom__row__textLabel}>Address</p>
            <Form.Item
              isListField={isListField}
              name={this.getName('address')}
              label={false}
              rules={[
                {
                  required: true,
                  message: 'Please enter Address!',
                },
              ]}
            >
              <Input placeholder="Address" />
            </Form.Item>
          </div>
          <div className={s.content__viewBottom__row}>
            <div className={s.viewFormVertical}>
              <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>Country</p>
              <Form.Item
                isListField
                name={this.getName('country')}
                label={false}
                rules={[
                  {
                    required: true,
                    message: 'Please enter Country!',
                  },
                ]}
              >
                <Select
                  placeholder="Select Country"
                  showArrow
                  showSearch
                  onChange={(value) => this.onChangeCountry(value, this.getName('state'))}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {listCountry.map((item) => (
                    <Option key={item._id}>{item.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className={s.viewFormVertical}>
              <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>State</p>
              <Form.Item
                isListField
                name={this.getName('state')}
                label={false}
                rules={[
                  {
                    required: true,
                    message: 'Please enter State!',
                  },
                ]}
              >
                <Select
                  placeholder="Select State"
                  showArrow
                  showSearch
                  disabled={!country}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {listState.map((item) => (
                    <Option key={item}>{item}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className={s.viewFormVertical}>
              <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>Zip</p>
              <Form.Item
                fdsf
                name={this.getName('zipCode')}
                label={false}
                rules={[
                  {
                    required: true,
                    message: 'Please enter Zip Code!',
                  },
                ]}
              >
                <Input placeholder="Zip Code" />
              </Form.Item>
            </div>
          </div>
        </div>
        <Divider className={s.divider} />
      </div>
    );
  }
}
export default FormWorkLocation;
