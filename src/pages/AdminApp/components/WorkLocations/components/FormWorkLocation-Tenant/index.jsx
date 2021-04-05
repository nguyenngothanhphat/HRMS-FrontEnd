import React, { Component } from 'react';
import { Form, Input, Select, Divider, Modal, Row, Col } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { connect } from 'umi';
// import { bool } from 'prop-types';
import s from './index.less';

const { Option } = Select;
const { confirm } = Modal;

@connect(({ adminApp, loading }) => ({
  adminApp,
  loadingUpdateLocation: loading.effects['adminApp/updateLocation'],
}))
class FormWorkLocationTenant extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      newCountry: '',
      isEditing: false,
      isSaved: false,
      locationName: '',
    };
  }

  componentDidMount() {
    const { locationInfo: { name = '' } = {}, defaultCountry } = this.props;
    this.setState({
      locationName: name,
      newCountry: defaultCountry,
    });
  }

  handleEdit = () => {
    const { isEditing, locationName } = this.state;
    if (!isEditing) {
      this.formRef.current.setFieldsValue({
        name: locationName,
      });
    }
    this.setState({
      isEditing: !isEditing,
    });
  };

  handleCancel = () => {
    const { isEditing } = this.state;
    this.setState({
      isEditing: !isEditing,
    });

    const {
      locationInfo: {
        name = '',
        addressLine1 = '',
        addressLine2 = '',
        country = '',
        state = '',
        zipCode = '',
      } = {},
    } = this.props;
    this.formRef.current.setFieldsValue({
      name,
      addressLine1,
      addressLine2,
      country,
      state,
      zipCode,
    });
  };

  onChangeCountry = (newCountry) => {
    this.setState({
      newCountry,
    });

    this.formRef.current.setFieldsValue({
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
      title: 'Do you want to delete this location?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        removeLocation(id);
      },
      onCancel() {},
    });
  };

  handleRemove = (_id) => {
    if (_id) {
      this.showConfirm(_id);
    }
  };

  saveLocationAPI = async (values, locationId) => {
    const { dispatch } = this.props;
    const tenantId = localStorage.getItem('tenantId');

    const {
      name,
      addressLine1 = '',
      addressLine2 = '',
      country = '',
      state = '',
      zipCode = '',
    } = values;

    const payload = {
      tenantId,
      id: locationId,
      name,
      headQuarterAddress: {
        addressLine1,
        addressLine2,
        country,
        state,
        zipCode,
      },
      // legalAddress: {
      //   addressLine1,
      //   addressLine2,
      //   country,
      //   state,
      //   zipCode,
      // },
    };
    const res = await dispatch({
      type: 'adminApp/updateLocation',
      payload,
    });

    const { statusCode } = res;
    if (statusCode === 200) {
      this.setState({
        isSaved: true,
        isEditing: false,
        locationName: name,
      });
      setTimeout(() => {
        this.setState({
          isSaved: false,
        });
      }, 2500);
    }
  };

  render() {
    const { newCountry = '', isEditing, isSaved, locationName } = this.state;
    const {
      listCountry = [],
      field = {},
      locationInfo: {
        _id = '',
        name = '',
        addressLine1 = '',
        addressLine2 = '',
        country = '',
        state = '',
        zipCode = '',
        isHeadQuarter = false,
      } = {},
      listLength = 0,
      index = 0,
      loadingUpdateLocation = false,
    } = this.props;

    const listState = this.findListState(newCountry) || [];
    const disableInput = !isEditing;

    return (
      <div className={s.content} style={field.name > 0 ? { marginTop: '24px' } : {}}>
        <div className={s.content__viewBottom}>
          <Form
            ref={this.formRef}
            onFinish={this.onFinish}
            autoComplete="off"
            initialValues={{
              name,
              addressLine1,
              addressLine2,
              country,
              state,
              zipCode,
            }}
          >
            <Row className={s.content__viewBottom__viewTitle}>
              <p className={s.title}>{isHeadQuarter ? 'Headquater' : name}</p>

              <div className={s.actionBtn}>
                {!isEditing ? (
                  <div className={s.actionEdit} onClick={this.handleEdit}>
                    <span>Edit</span>
                  </div>
                ) : (
                  <div className={s.actionEdit} onClick={this.handleEdit}>
                    <span style={{ color: '#f00000' }}>Cancel</span>
                  </div>
                )}
                {!isHeadQuarter && (
                  <div className={s.actionDelete} onClick={() => this.handleRemove(_id)}>
                    <DeleteOutlined className={s.actionDelete__icon} />
                    <span>Delete</span>
                  </div>
                )}
              </div>
            </Row>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Address Line 1*</p>
              </Col>
              <Col span={16}>
                <Form.Item name="addressLine1">
                  <Input disabled={disableInput} placeholder="Location Name" />
                </Form.Item>
              </Col>
            </Row>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Address Line 2</p>
              </Col>
              <Col span={16}>
                <Form.Item name="addressLine2">
                  <Input disabled={disableInput} placeholder="Address" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]} className={s.content__viewBottom__row}>
              <Col span={8} className={s.viewFormVertical}>
                <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>
                  Country*
                </p>
                <Form.Item name="country">
                  <Select
                    placeholder="Select Country"
                    showArrow
                    showSearch
                    disabled={disableInput}
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
              </Col>
              <Col span={8} className={s.viewFormVertical}>
                <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>State*</p>
                <Form.Item name="state">
                  <Select
                    placeholder="Select State"
                    showArrow
                    showSearch
                    disabled={disableInput || !newCountry}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listState.map((item) => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={s.viewFormVertical}>
                <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>Zip*</p>
                <Form.Item name="zipCode">
                  <Input disabled={disableInput} placeholder="Zip Code" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        {listLength !== index + 1 && <Divider className={s.divider} />}
      </div>
    );
  }
}
export default FormWorkLocationTenant;
