import React, { Component } from 'react';
import { Button, Form, Input, Select, Divider, Row, Col } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import RemoveLocationModal from '../RemoveLocationModal';
// import { bool } from 'prop-types';
import s from './index.less';

const { Option } = Select;

@connect(({ adminApp, loading, user: { currentUser: { manageTenant = [] } = {} } = {} }) => ({
  adminApp,
  manageTenant,
  loadingUpdateLocation: loading.effects['adminApp/updateLocation'],
  loadingRemoveLocation: loading.effects['adminApp/removeLocation'],
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
      removeModalVisible: false,
      notification: 'This location is updated successfully.',
      notificationColor: '#00c598',
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
    const { isEditing, locationName } = this.state;
    this.setState({
      isEditing: !isEditing,
    });

    const {
      locationInfo: {
        name = '',
        addressLine1 = '',
        addressLine2 = '',
        city = '',
        country = '',
        state = '',
        zipCode = '',
      } = {},
    } = this.props;
    this.formRef.current.setFieldsValue({
      name: locationName || name,
      addressLine1,
      addressLine2,
      city,
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

  hideConfirm = () => {
    this.setState({
      removeModalVisible: false,
    });
  };

  showConfirm = () => {
    this.setState({
      removeModalVisible: true,
    });
  };

  onRemove = () => {
    const { removeLocation = () => {} } = this.props;
    const { locationInfo: { _id = '' } = {} } = this.props;
    removeLocation(_id);
  };

  handleRemove = (_id) => {
    if (_id) {
      this.showConfirm();
    }
  };

  compareValues = (beforeVals, afterVals) => {
    const {
      name,
      addressLine1 = '',
      addressLine2 = '',
      city = '',
      country = '',
      state = '',
      zipCode = '',
    } = beforeVals;
    const {
      name: newName,
      addressLine1: newAddressLine1 = '',
      addressLine2: newAddressLine2 = '',
      city: newCity = '',
      country: newCountry = '',
      state: newState = '',
      zipCode: newZipCode = '',
    } = afterVals;
    return (
      name === newName &&
      addressLine1 === newAddressLine1 &&
      addressLine2 === newAddressLine2 &&
      city === newCity &&
      country === newCountry &&
      state === newState &&
      zipCode === newZipCode
    );
  };

  saveLocationAPI = async (values, locationId) => {
    const { dispatch, manageTenant = [], locationInfo = {} } = this.props;
    const tenantId = getCurrentTenant();
    const companyId = getCurrentCompany();

    const {
      name,
      addressLine1 = '',
      addressLine2 = '',
      city = '',
      country = '',
      state = '',
      zipCode = '',
    } = values;

    const checkTheSame = this.compareValues(values, locationInfo);

    if (checkTheSame) {
      this.setState({
        notification: 'Nothing changed.',
        notificationColor: '#FD4546',
        isSaved: true,
      });
      setTimeout(() => {
        this.setState({
          isSaved: false,
        });
      }, 2500);
    } else {
      const payload = {
        tenantId,
        id: locationId,
        name,
        headQuarterAddress: {
          addressLine1,
          addressLine2,
          city,
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
        // refresh locations in dropdown menu (owner)
        dispatch({
          type: 'locationSelection/fetchLocationListByParentCompany',
          payload: {
            company: companyId,
            tenantIds: manageTenant,
          },
        });
        setTimeout(() => {
          this.setState({
            isSaved: false,
          });
        }, 2500);
      }
    }
  };

  render() {
    const {
      newCountry = '',
      notification,
      notificationColor,
      isEditing,
      isSaved,
      locationName,
      removeModalVisible,
    } = this.state;
    const {
      listCountry = [],
      field = {},
      locationInfo: {
        name = '',
        _id = '',
        addressLine1 = '',
        addressLine2 = '',
        city = '',
        country = '',
        state = '',
        zipCode = '',
        isHeadQuarter = false,
      } = {},
      listLength = 0,
      index = 0,
      loadingUpdateLocation = false,
      loadingRemoveLocation = false,
    } = this.props;

    const listState = this.findListState(newCountry) || [];
    const disableInput = !isEditing;

    return (
      <div className={s.content} style={field.name > 0 ? { marginTop: '24px' } : {}}>
        <div className={s.content__viewBottom}>
          <Form
            ref={this.formRef}
            onFinish={(values) => this.saveLocationAPI(values, _id)}
            autoComplete="off"
            initialValues={{
              name: name || locationName,
              addressLine1,
              addressLine2,
              city,
              country,
              state,
              zipCode,
            }}
          >
            {isSaved && (
              <div style={{ backgroundColor: `${notificationColor}` }} className={s.savedBanner}>
                <span>{notification}</span>
              </div>
            )}
            <Row className={s.content__viewBottom__viewTitle}>
              <p className={s.title}>{locationName}</p>

              <div className={s.actionBtn}>
                {!isEditing ? (
                  <Button type="link" className={s.actionEdit} onClick={this.handleEdit}>
                    <EditOutlined className={s.buttonIcon} />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <>
                    {loadingUpdateLocation && (
                      <Button type="link" className={s.actionUpdating}>
                        <LoadingOutlined className={s.buttonIcon} />
                        <span>Updating...</span>
                      </Button>
                    )}

                    {!loadingUpdateLocation && (
                      <>
                        <Button type="link" className={s.actionSave} htmlType="submit">
                          <SaveOutlined className={s.buttonIcon} />
                          <span>Save</span>
                        </Button>

                        <Button type="link" className={s.actionCancel} onClick={this.handleCancel}>
                          <CloseOutlined className={s.buttonIcon} />
                          <span>Cancel</span>
                        </Button>
                      </>
                    )}
                  </>
                )}
                {!isHeadQuarter && (
                  <Button
                    type="link"
                    className={s.actionDelete}
                    onClick={() => this.handleRemove(_id)}
                  >
                    <DeleteOutlined className={s.buttonIcon} />
                    <span>Delete</span>
                  </Button>
                )}
              </div>
            </Row>
            {/* {(isHeadQuarter || isEditing) && ( */}
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Location Name*</p>
              </Col>
              <Col span={16}>
                <Form.Item
                  rules={[{ required: true, message: 'Please input Location Name' }]}
                  name="name"
                >
                  <Input disabled={disableInput} placeholder="Location Name" />
                </Form.Item>
              </Col>
            </Row>
            {/* )} */}
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Address Line 1*</p>
              </Col>
              <Col span={16}>
                <Form.Item
                  rules={[{ required: true, message: 'Please input Address Line 1' }]}
                  name="addressLine1"
                >
                  <Input disabled={disableInput} placeholder="Address Line 1" />
                </Form.Item>
              </Col>
            </Row>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>Address Line 2</p>
              </Col>
              <Col span={16}>
                <Form.Item name="addressLine2">
                  <Input disabled={disableInput} placeholder="Address Line 2" />
                </Form.Item>
              </Col>
            </Row>
            <Row className={s.content__viewBottom__row}>
              <Col span={8}>
                <p className={s.content__viewBottom__row__textLabel}>City Name*</p>
              </Col>
              <Col span={16}>
                <Form.Item
                  rules={[{ required: true, message: 'Please input City Name' }]}
                  name="city"
                >
                  <Input disabled={disableInput} placeholder="City Name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]} className={s.content__viewBottom__row}>
              <Col span={8} className={s.viewFormVertical}>
                <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>
                  Country*
                </p>
                <Form.Item
                  rules={[{ required: true, message: 'Please select Country' }]}
                  name="country"
                >
                  <Select
                    placeholder="Select Country"
                    showArrow
                    showSearch
                    disabled={disableInput}
                    onChange={this.onChangeCountry}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {listCountry.map((item) => (
                      <Option key={item._id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={s.viewFormVertical}>
                <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>State*</p>
                <Form.Item
                  rules={[{ required: true, message: 'Please select State' }]}
                  name="state"
                >
                  <Select
                    placeholder="Select State"
                    showArrow
                    showSearch
                    disabled={disableInput || !newCountry}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {listState.map((item) => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className={s.viewFormVertical}>
                <p className={classnames(s.content__viewBottom__row__textLabel, s.mgb10)}>
                  Zip/Postal Code*
                </p>
                <Form.Item
                  rules={[{ required: true, message: 'Please input Zip/Postall Code' }]}
                  name="zipCode"
                >
                  <Input disabled={disableInput} placeholder="Zip/Postal Code" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        {listLength !== index + 1 && <Divider className={s.divider} />}
        <RemoveLocationModal
          onProceed={this.onRemove}
          onClose={this.hideConfirm}
          visible={removeModalVisible}
          loading={loadingRemoveLocation}
        />
      </div>
    );
  }
}
export default FormWorkLocationTenant;
