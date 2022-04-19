import { Col, Form, Row, Input, Select, Divider, Popover } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import warnIcon from '@/assets/warning-filled.svg';
import { getCurrentTenant } from '@/utils/authority';

@connect(
  ({
    loading,
    customerManagement: {
      state = [],
      country = [],
      listTags = [],
      temp: { customerID = '' } = {},
      employeeList = [],
    } = {},
    user: {
      currentUser: {
        employee: {
          _id: accountOwnerId = '',
          generalInfo: { _id = '', firstName = '', middleName = '', lastName = '' } = {},
        } = {},
      } = {},
    } = {},
  }) => ({
    customerID,
    listTags,
    country,
    state,
    _id,
    firstName,
    middleName,
    lastName,
    employeeList,
    accountOwnerId,
    loadingCustomerID: loading.effects['customerManagement/getCustomerID'],
    loadingTagList: loading.effects['customerManagement/fetchTagList'],
    loadingStateList: loading.effects['customerManagement/fetchStateByCountry'],
    loadingEmployeeList: loading.effects['customerManagement/fetchEmployeeList'],
    loadingAdd: loading.effects['customerManagement/addNewCustomer'],
  }),
)
class EditCustomerModalContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCountryChosen: true,
    };
    this.refForm = React.createRef();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagement/fetchTagList',
      payload: {
        name: 'Engineering',
      },
    });
    dispatch({
      type: 'customerManagement/fetchCountryList',
    });
    dispatch({
      type: 'customerManagement/fetchEmployeeList',
    });
  }

  componentDidUpdate(props) {
    const { state, isShown, customerID = '' } = this.props;
    if (props.state !== state) {
      this.handleChangeCountry();
    }
    if (props.isShown !== isShown && isShown) {
      const { dispatch } = this.props;
      dispatch({
        type: 'customerManagement/genCustomerID',
      });
    }
    if (props.customerID !== customerID) {
      this.refForm?.current?.setFieldsValue({ customerID });
    }
  }

  // change Country
  handleChangeCountry = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagement/fetchStateByCountry',
      payload: id,
    });
    this.setState({
      isCountryChosen: false,
    });
  };

  handleSubmit = async (values) => {
    const {
      customerID,
      status,
      legalName,
      dba,
      phone,
      email,
      addressLine1,
      addressLine2,
      state,
      city,
      zipCode,
      website,
      tags,
      comments,
      accountOwner,
    } = values;
    const { country, onRefresh = () => {}, onClose = () => {}, dispatch } = this.props;
    const countryName = country?.find((item) => item._id === values.country);
    const res = await dispatch({
      type: 'customerManagement/editCustomer',
      payload: {
        tenantId: getCurrentTenant(),
        customerId: customerID,
        status,
        legalName: legalName || '',
        dba: dba || '',
        contactPhone: phone || '',
        contactEmail: email,
        addressLine1: addressLine1 || '',
        addressLine2: addressLine2 || '',
        city: city || '',
        state: state || "''",
        country: countryName.name || '',
        postalCode: zipCode || '',
        accountOwner: accountOwner || '',
        tags: tags || [],
        comment: comments || '',
        website: website || '',
      },
    });
    if (res.statusCode === 200) {
      onRefresh();
      onClose();
      this.refForm.current.resetFields();
    }
  };

  render() {
    const content = (
      <p style={{ marginBottom: '0', color: '#fff' }}>Customer ID is auto-generated</p>
    );
    const contentStatus = (
      <p style={{ marginBottom: '0', color: '#fff' }}>Status is auto-generated</p>
    );
    const { isCountryChosen } = this.state;
    const {
      listStatus,
      listTags,
      country,
      state,
      loadingTagList,
      loadingStateList,
      employeeList = [],
      listCustomer = [],
      selectedProject: {
        legalName = '',
        customerId = '',
        status: statusProps = '',
        dba = '',
        contactPhone = '',
        contactEmail = '',
        addressLine1 = ' ',
        addressLine2 = ' ',
        country: countryProps = '',
        state: stateProps = '',
        city = ' ',
        postalCode = ' ',
        accountOwnerId: accountOwnerIdProps = ' ',
        website = ' ',
        tags = [],
        comment = '',
      } = {},
    } = this.props;

    return (
      <div className={styles.EditCustomerModalContent}>
        <Form
          name="formAdd"
          ref={this.refForm}
          layout="vertical"
          initialValues={{
            customerID: customerId,
            status: statusProps,
            legalName,
            dba,
            phone: contactPhone,
            email: contactEmail,
            addressLine1,
            addressLine2,
            country: countryProps,
            state: stateProps,
            city,
            zipCode: postalCode,
            accountOwner: accountOwnerIdProps,
            tags,
            website,
            comments: comment,
          }}
          onFinish={(values) => {
            this.handleSubmit(values);
          }}
        >
          {/* Basic Customer Detail */}
          <div className={styles.basicInfoForm}>
            <div className={styles.basicInfoTitle}>
              <p>Basic Customer Detail</p>
            </div>
            <Row gutter={48}>
              <Col span={12}>
                <Form.Item
                  label={
                    <>
                      <p style={{ marginBottom: '0', marginRight: '10px' }}>Customer ID</p>
                      <Popover
                        placement="right"
                        content={content}
                        overlayClassName={styles.addNewPopover}
                      >
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
                        overlayClassName={styles.addNewPopover}
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
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Legal name"
                  name="legalName"
                  rules={[{ required: true, message: 'Required field!' }]}
                >
                  <Input placeholder="Enter Company legal name" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Doing Bussiness As(DBA)"
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
                          return Promise.reject(`Doing Bussiness As(DBA) is exist.`);
                        }
                        // eslint-disable-next-line compat/compat
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input placeholder="Enter Company short name" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider />

          {/* Contact Detail */}
          <div className={styles.contactDetail}>
            <div className={styles.contactDetailTitle}>
              <p>Contact Detail</p>
            </div>
            <Row gutter={48}>
              <Col span={12}>
                <Form.Item
                  label="Contact Phone"
                  name="phone"
                  rules={[{ required: true, message: 'Required field!' }]}
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
            <Row gutter={48}>
              <Col span={12}>
                <Form.Item
                  label="Country"
                  name="country"
                  rules={[{ required: true, message: 'Required field!' }]}
                >
                  <Select
                    placeholder="Select Country"
                    onChange={(value) => this.handleChangeCountry(value)}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
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
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {state.map((stateItem) => {
                      return <Select.Option key={stateItem}>{stateItem}</Select.Option>;
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={48}>
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
          <Divider />
          {/* Other Detail */}
          <div className={styles.otherDetail}>
            <div className={styles.otherDetailTitle}>
              <p>Other Detail</p>
            </div>
            <Row gutter={48}>
              <Col span={12}>
                <Form.Item
                  label="Account Owner"
                  name="accountOwner"
                  rules={[{ required: true, message: 'Required field!' }]}
                >
                  <Select
                    placeholder="Enter Account Owner"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {employeeList.map((employee) => {
                      return (
                        <Select.Option key={employee._id} value={employee._id}>
                          {employee?.generalInfo?.legalName}
                        </Select.Option>
                      );
                    })}
                  </Select>
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
              <Input.TextArea rows={4} placeholder="Enter Comments" />
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}

export default EditCustomerModalContent;
