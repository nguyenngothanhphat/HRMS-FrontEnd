import { Col, Form, Input, Popover, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DebounceSelect from '@/components/DebounceSelect';
import warnIcon from '@/assets/warnIcon.svg';
import styles from './index.less';

const AddModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    isShown,
    customerID,
    listStatus,
    listTags,
    state,
    loadingTagList,
    loadingStateList,
    listCustomer = [],
    country = '',
    handleAddNew = () => {},
    user: { currentUser: { employee: { _id: accountOwnerId = '' } = {}, employee = {} } = {} },
  } = props;
  const [isCountryChosen, setIsCountryChosen] = useState(true);

  // change Country
  const handleChangeCountry = (id) => {
    dispatch({
      type: 'customerManagement/fetchStateByCountry',
      payload: id,
    });
    setIsCountryChosen(false);
  };

  const onEmployeeSearch = (val) => {
    if (!val) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return dispatch({
      type: 'customerManagement/fetchEmployeeList',
      payload: {
        name: val,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfoInfo?.legalName,
        value: user._id,
      }));
    });
  };

  useEffect(() => {
    dispatch({
      type: 'customerManagement/fetchTagList',
      payload: {
        name: 'Engineering',
      },
    });
    dispatch({
      type: 'customerManagement/fetchCountryList',
    });
  }, []);

  useEffect(() => {
    if (isShown) {
      handleChangeCountry();
    }
  }, [state]);

  useEffect(() => {
    if (isShown) {
      dispatch({
        type: 'customerManagement/genCustomerID',
      });
    }
  }, [isShown]);

  useEffect(() => {
    if (customerID) {
      form.setFieldsValue({ customerID });
    }
  }, [customerID]);

  const handleSubmit = (values) => {
    const nameCountry = country?.find((item) => item._id === values.country);
    handleAddNew(values, nameCountry);
    form.resetFields();
  };

  const content = <p style={{ marginBottom: '0', color: '#000' }}>Customer ID is auto-generated</p>;
  const contentStatus = (
    <p style={{ marginBottom: '0', color: '#000' }}>Status is auto-generated</p>
  );

  return (
    <div className={styles.AddModalContent}>
      <Form
        name="myForm"
        form={form}
        layout="vertical"
        initialValues={{ customerID, status: 'Engaging', accountOwner: accountOwnerId }}
        onFinish={(values) => {
          handleSubmit(values);
        }}
      >
        {/* Basic Customer Detail */}
        <div className={styles.basicInfoForm}>
          <div className={styles.basicInfoTitle}>
            <p>Basic Customer Detail</p>
          </div>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                // loading={loadingCustomerID}
                label={
                  <>
                    <p style={{ marginBottom: '0', marginRight: '10px' }}>Customer ID</p>
                    <Popover placement="right" content={content}>
                      <img src={warnIcon} alt="warning" className={styles.addNewPopover} />
                    </Popover>
                  </>
                }
                name="customerID"
              >
                <Input style={{ color: '#000' }} disabled placeholder="Enter Customer ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <>
                    <p style={{ marginBottom: '0', marginRight: '10px' }}>Status</p>
                    <Popover
                      className={styles.addNewPopover}
                      placement="right"
                      content={contentStatus}
                    >
                      <img src={warnIcon} alt="warning" />
                    </Popover>
                  </>
                }
                name="status"
              >
                <Select
                  className={styles.selectGroup}
                  disabled
                  loading={loadingTagList}
                  placeholder="Enter status"
                >
                  {listStatus}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Legal name"
            name="legalName"
            rules={[
              { required: true, message: 'Required field!' },
              () => ({
                validator(_, value) {
                  if (
                    listCustomer.filter(
                      (obj) =>
                        obj?.legalName?.toLowerCase().replace(/\s+/g, '') ===
                        value?.toLowerCase().replace(/\s+/g, ''),
                    ).length > 0
                  ) {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject(`Legal name is exist.`);
                  }
                  // eslint-disable-next-line compat/compat
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Enter Company legal name" />
          </Form.Item>
          <Form.Item
            label="Doing Business As (DBA)"
            name="dba"
            rules={[
              { required: true, message: 'Required field!' },
              () => ({
                validator(_, value) {
                  if (
                    listCustomer.filter(
                      (obj) =>
                        obj?.dba?.toLowerCase().replace(/\s+/g, '') ===
                        value?.toLowerCase().replace(/\s+/g, ''),
                    ).length > 0
                  ) {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject(`Doing Business As(DBA) is exist.`);
                  }
                  // eslint-disable-next-line compat/compat
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Enter the Company's DBA" />
          </Form.Item>
        </div>

        {/* Contact Detail */}
        <div className={styles.contactDetail}>
          <div className={styles.contactDetailTitle}>
            <p>Contact Detail</p>
          </div>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Contact Phone"
                name="phone"
                rules={[
                  { required: true, message: 'Required field!' },
                  {
                    pattern:
                      // eslint-disable-next-line no-useless-escape
                      /^(?=.{0,25}$)((?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?)$/gm,
                    message: 'Please enter a valid phone number!',
                  },
                ]}
              >
                <Input placeholder="Enter Phone Number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Contact Email"
                name="email"
                rules={[{ required: true, message: 'Required field!' }]}
              >
                <Input placeholder="Enter Email Address" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Address Line 1"
            name="addressLine1"
            rules={[{ required: true, message: 'Required field!' }]}
          >
            <Input placeholder="Enter Address Line 1" />
          </Form.Item>
          <Form.Item label="Address Line 2" name="addressLine2">
            <Input placeholder="Enter Address Line 2" />
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: 'Required field!' }]}
              >
                <Select
                  placeholder="Select Country"
                  onChange={(value) => handleChangeCountry(value)}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {country.map((countryItem) => {
                    return (
                      <Select.Option value={countryItem.id} key={countryItem._id}>
                        {countryItem.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: 'Required field!' }]}
              >
                <Select
                  disabled={isCountryChosen}
                  loading={loadingStateList}
                  placeholder="Select State"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {state.map((stateItem) => {
                    return <Select.Option key={stateItem}>{stateItem}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Required field!' }]}
              >
                <Input placeholder="Enter City name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Zip/Postal Code"
                name="zipCode"
                rules={[{ required: true, message: 'Required field!' }]}
              >
                <Input placeholder="Enter Postal Code" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Other Detail */}
        <div className={styles.otherDetail}>
          <div className={styles.otherDetailTitle}>
            <p>Other Detail</p>
          </div>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Account Owner"
                name="accountOwner"
                rules={[{ required: true, message: 'Required field!' }]}
              >
                <DebounceSelect
                  allowClear
                  showArrow
                  placeholder="Enter Account Owner"
                  fetchOptions={onEmployeeSearch}
                  showSearch
                  defaultValue={{
                    value: employee?._id,
                    label: employee?.generalInfo?.legalName,
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Website" name="website">
                <Input placeholder="Enter Website" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Tags" name="tags">
            <Select mode="multiple" placeholder="Select tags">
              {listTags.map((tagItem) => {
                return <Select.Option key={tagItem}>{tagItem}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Comments (Optional)" name="comments">
            <Input.TextArea
              autoSize={{
                minRows: 4,
                maxRows: 7,
              }}
              maxLength={500}
              placeholder="Enter Comments"
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default connect(
  ({
    loading,
    customerManagement: {
      state = [],
      country = [],
      listTags = [],
      temp: { customerID = '' } = {},
      employeeList = [],
    } = {},
    user,
  }) => ({
    customerID,
    listTags,
    country,
    state,
    employeeList,
    user,
    loadingCustomerID: loading.effects['customerManagement/getCustomerID'],
    loadingTagList: loading.effects['customerManagement/fetchTagList'],
    loadingStateList: loading.effects['customerManagement/fetchStateByCountry'],
  }),
)(AddModalContent);
