import { Col, Form, Modal, Row, Input, Select, Button, Popover } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import warnIcon from '@/assets/warnIcon.svg';

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
class ModalAdd extends PureComponent {
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
    const { dispatch, country } = this.props;
    dispatch({
      type: 'customerManagement/fetchStateByCountry',
      payload: id,
    });
    this.setState({
      isCountryChosen: false,
    });
  };

  handleSubmit = (values) => {
    const { handleAddNew, country } = this.props;
    const nameCountry = country?.find((item) => item._id === values.country);

    handleAddNew(values, nameCountry);
    this.refForm.current.resetFields();
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
      isShown,
      onCloseModal = () => {},
      customerID,
      listStatus,
      listTags,
      country,
      state,
      accountOwnerId = '',
      loadingTagList,
      loadingStateList,
      employeeList = [],
      loadingAdd = false,
      listCustomer = [],
    } = this.props;

    return (
      <div className={styles.modalAdd}>
        <Modal
          className={styles.modalAdd}
          title="Add new customer"
          width={700}
          destroyOnClose
          footer={[
            <div className={styles.btnForm}>
              <Button
                className={styles.btnCancel}
                htmlType="reset"
                key="reset"
                form="formAdd"
                onClick={() => {
                  onCloseModal();
                  this.refForm.current.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                className={styles.btnAdd}
                form="formAdd"
                key="submit"
                htmlType="submit"
                loading={loadingAdd}
              >
                Add Customer
              </Button>
            </div>,
          ]}
          onCancel={() => {
            onCloseModal();
            // this.refForm.current.resetFields();
          }}
          visible={isShown}
        >
          <Form
            name="formAdd"
            ref={this.refForm}
            layout="vertical"
            initialValues={{ customerID, status: 'Engaging', accountOwner: accountOwnerId }}
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
                <Input placeholder="Enter the Company's DBA" />
              </Form.Item>
            </div>

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
                    rules={[
                      { required: true, message: 'Required field!' },
                      {
                        pattern:
                          // eslint-disable-next-line no-useless-escape
                          /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?$/gm,
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
        </Modal>
      </div>
    );
  }
}

export default ModalAdd;
