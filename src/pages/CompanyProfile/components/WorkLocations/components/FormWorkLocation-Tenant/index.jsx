/* eslint-disable compat/compat */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Form, Input, Select, Modal, Row, Col } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
// import { bool } from 'prop-types';
import s from './index.less';

const { Option } = Select;
const { confirm } = Modal;

class FormWorkLocationTenant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newCountry: '',
    };
  }

  componentDidMount() {
    const { defaultCountry } = this.props;
    this.setState({
      newCountry: defaultCountry,
    });
  }

  onChangeCountry = (newCountry) => {
    const { formRef = {} } = this.props;
    this.setState({
      newCountry,
    });
    // const workLocations = formRef.current.getFieldValue('workLocations');
    // const cloneWorkLocations = [...workLocations];
    // const check = cloneWorkLocations[name];
    // if (check) {
    //   cloneWorkLocations[name].state = undefined;
    // }
    formRef.current.setFieldsValue({
      state: undefined,
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
    const { newCountry = '' } = this.state;
    const {
      listCountry = [],
      listLocation = [],
      field = {},
      name = '',
      // isRequired = bool,
      // companyDetails = {},
      onChangeHeadquarterName = () => {},
    } = this.props;
    const listState = this.findListState(newCountry) || [];
    const itemLocation = listLocation[field.name] || {};
    return (
      <div className={s.content} style={field.name > 0 ? { marginTop: '24px' } : {}}>
        <div className={s.content__viewBottom}>
          <div className={s.content__viewBottom__viewTitle}>
            <p className={s.title}>{itemLocation?.name || name}</p>
          </div>
          <div className={s.content__viewBottom__row}>
            <Row>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <p className={s.content__viewBottom__row__textLabel}>Location Name</p>
              </Col>
              <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                <Form.Item name="name">
                  <Input placeholder="Location Name" onChange={(e) => onChangeHeadquarterName(e)} />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={s.content__viewBottom__row}>
            <Row>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <p className={s.content__viewBottom__row__textLabel}>Address Line 1</p>
              </Col>
              <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                <Form.Item
                  // {...field}
                  // label={false}
                  name="addressLine1"
                >
                  <Input disabled placeholder="Address Line 1" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={s.content__viewBottom__row}>
            <Row>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <p className={s.content__viewBottom__row__textLabel}>Address Line 2</p>
              </Col>
              <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                <Form.Item name="addressLine2">
                  <Input disabled placeholder="Address Line 2" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={s.content__viewBottom__row}>
            <Row>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <p className={s.content__viewBottom__row__textLabel}>City Name</p>
              </Col>
              <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                <Form.Item name="city">
                  <Input disabled placeholder="Location Name" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <div className={s.viewFormVertical}>
                  <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>
                    Country
                  </p>
                  <Form.Item name="country">
                    <Select
                      placeholder="Select Country"
                      showArrow
                      showSearch
                      disabled
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
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <div className={s.viewFormVertical}>
                  <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>
                    State
                  </p>

                  <Form.Item
                    // {...field}
                    // label={false}
                    name="state"
                  >
                    <Select
                      placeholder="Select State"
                      showArrow
                      showSearch
                      disabled={!newCountry}
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
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <div className={s.viewFormVertical}>
                  <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>
                    Zip/Postal Code
                  </p>
                  <Form.Item
                    // {...field}
                    // label={false}
                    name="zipCode"
                  >
                    <Input disabled placeholder="Zip/Postal Code" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        {/* <Divider className={s.divider} /> */}
      </div>
    );
  }
}
export default FormWorkLocationTenant;
