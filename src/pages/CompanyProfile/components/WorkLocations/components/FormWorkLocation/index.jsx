/* eslint-disable compat/compat */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Form, Input, Select, Divider, Modal } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { bool } from 'prop-types';
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
    const { field: { name = 0 } = {}, listLocation = [] } = this.props;
    const itemLocation = listLocation[name] || {};
    this.setState({
      country: itemLocation?.country,
    });
  }

  onChangeCountry = (country) => {
    const { formRef = {}, field: { name = 0 } = {} } = this.props;
    this.setState({
      country,
    });
    const workLocations = formRef.current.getFieldValue('workLocations');
    const cloneWorkLocations = [...workLocations];
    const check = cloneWorkLocations[name];
    if (check) {
      cloneWorkLocations[name].state = undefined;
    }
    formRef.current.setFieldsValue({
      workLocations: cloneWorkLocations,
    });
  };

  findListState = (idCountry) => {
    const { listCountry = [] } = this.props;
    const itemCountry = listCountry.find((item) => item._id === idCountry) || {};
    const listState = itemCountry.states || [];
    return listState;
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
    const { onRemove = () => {}, listLocation = [], field = {} } = this.props;
    const itemRemove = listLocation[field.name] || {};
    const { _id: id } = itemRemove;
    if (id) {
      this.showConfirm(id);
    } else onRemove();
  };

  render() {
    const { country = '' } = this.state;
    const {
      listCountry = [],
      listLocation = [],
      isHidden = bool,
      field = {},
      name = '',
    } = this.props;

    const listState = this.findListState(country) || [];
    const itemLocation = listLocation[field.name] || {};
    return (
      <div className={s.content} style={field.name > 0 ? { marginTop: '24px' } : {}}>
        <div className={s.content__viewBottom}>
          <div className={s.content__viewBottom__viewTitle}>
            <p className={s.title}>{itemLocation?.name || name}</p>
            <div
              className={isHidden ? `${s.action} ${s.hide}` : `${s.action}`}
              onClick={this.handleRemove}
            >
              <DeleteOutlined className={s.action__icon} />
              <span>Delete</span>
            </div>
          </div>

          <div className={s.content__viewBottom__row}>
            <p className={s.content__viewBottom__row__textLabel}>Location Name*</p>
            <Form.Item
              {...field}
              label={false}
              name={[field.name, 'name']}
              fieldKey={[field.fieldKey, 'name']}
              rules={[
                {
                  required: true,
                  message: 'Please enter location name',
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
              <Input placeholder="Location Name" />
            </Form.Item>
          </div>

          <div className={s.content__viewBottom__row}>
            <p className={s.content__viewBottom__row__textLabel}>Address Line 1*</p>
            <Form.Item
              {...field}
              label={false}
              name={[field.name, 'addressLine1']}
              fieldKey={[field.fieldKey, 'addressLine1']}
              rules={[
                {
                  required: true,
                  message: 'Please enter address line 1',
                },
              ]}
            >
              <Input placeholder="Address Line 1" />
            </Form.Item>
          </div>

          <div className={s.content__viewBottom__row}>
            <p className={s.content__viewBottom__row__textLabel}>Address Line 2</p>
            <Form.Item
              {...field}
              label={false}
              name={[field.name, 'addressLine2']}
              fieldKey={[field.fieldKey, 'addressLine2']}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Please enter Address!',
              //   },
              // ]}
            >
              <Input placeholder="Address Line 2" />
            </Form.Item>
          </div>
          <div className={s.content__viewBottom__row}>
            <div className={s.viewFormVertical}>
              <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>Country</p>
              <Form.Item
                {...field}
                label={false}
                name={[field.name, 'country']}
                fieldKey={[field.fieldKey, 'country']}
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
                  onChange={this.onChangeCountry}
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
                {...field}
                label={false}
                name={[field.name, 'state']}
                fieldKey={[field.fieldKey, 'state']}
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
                {...field}
                label={false}
                name={[field.name, 'zipCode']}
                fieldKey={[field.fieldKey, 'zipCode']}
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
