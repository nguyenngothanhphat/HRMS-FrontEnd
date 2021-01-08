/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import classnames from 'classnames';
import s from './index.less';

const { Option } = Select;

class FormWorkLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: '',
    };
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

  render() {
    const { country = '' } = this.state;
    const { title = '', listCountry = [], isListField = false, name = 0 } = this.props;
    const listState = this.findListState(country) || [];

    return (
      <div className={s.content} style={isListField ? { marginTop: '24px' } : {}}>
        <div className={s.content__viewBottom}>
          <p className={classnames(s.title, s.mgb16)}>{title || `Work Location ${name + 1}`}</p>
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
      </div>
    );
  }
}
export default FormWorkLocation;
