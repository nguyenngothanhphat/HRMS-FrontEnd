import { Col, Form, Modal, Row, Input, Select, Button, Popover } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    customerManagement: {
      state = [],
      country = [],
      listTags = [],
      temp: { customerID = '' } = {},
    } = {},
    user: {
      currentUser: {
        employee: {
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
    loadingCustomerID: loading.effects['customerManagement/getCustomerID'],
    loadingTagList: loading.effects['customerManagement/fetchTagList'],
    loadingStateList: loading.effects['customerManagement/fetchStateByCountry'],
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
      type: 'customerManagement/genCustomerID',
    });
    dispatch({
      type: 'customerManagement/fetchTagList',
    });
    dispatch({
      type: 'customerManagement/fetchCountryList',
    });
  }

  componentDidUpdate(props) {
    const { state } = this.props;
    if (props.state !== state) {
      this.handleChangeCountry();
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

  render() {
    const content = <p>Customer ID is auto-generated</p>;
    const { isCountryChosen } = this.state;
    const {
      isShown,
      handleAddNew = () => {},
      onCloseModal = () => {},
      customerID,
      listStatus,
      listTags,
      country,
      state,
      _id,
      firstName,
      middleName,
      lastName,
      loadingCustomerID,
      loadingTagList,
      loadingStateList,
      ref,
    } = this.props;
    const accountOwner = `${firstName} ${middleName} ${lastName}`;

    return (
      <div className={styles.modalAdd}>
        <Modal
          className={styles.modalAdd}
          title="Add new customer"
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
                // onClick={(values) => handleAddNew(values)}
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
            initialValues={{ customerID, status: 'Engaging', accountOwner }}
            onFinish={(values) => {
              this.refForm.current.resetFields();
              handleAddNew(values);
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
                    label={() => (
                      <>
                        <p>Customer ID</p>
                        <Popover placement="right" content={content}>
                          <span>i</span>
                        </Popover>
                      </>
                    )}
                    name="customerID"
                  >
                    <Input disabled placeholder="Enter Customer ID" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Status" name="status">
                    <Select disabled loading={loadingTagList} placeholder="Enter status">
                      {listStatus}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Legal name" name="legalName">
                <Input placeholder="Enter Company legal name" />
              </Form.Item>
              <Form.Item label="Doing Bussiness As(DBA)" name="dba">
                <Input placeholder="Enter Company short name" />
              </Form.Item>
            </div>

            {/* Contact Detail */}
            <div className={styles.contactDetail}>
              <div className={styles.contactDetailTitle}>
                <p>Contact Detail</p>
              </div>
              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item label="Contact Phone" name="phone">
                    <Input placeholder="Enter Phone Number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Contact Email" name="email">
                    <Input placeholder="Enter Email Address" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Address Line 1" name="addressLine1">
                <Input placeholder="Enter Address Line 1" />
              </Form.Item>
              <Form.Item label="Address Line 2" name="addressLine2">
                <Input placeholder="Enter Address Line 2" />
              </Form.Item>
              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item label="Country" name="country">
                    <Select
                      placeholder="Select Country"
                      onChange={(value) => this.handleChangeCountry(value)}
                    >
                      {country.map((countryItem) => {
                        return (
                          <Select.Option key={countryItem._id}>{countryItem.name}</Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="State" name="state">
                    <Select
                      disabled={isCountryChosen}
                      loading={loadingStateList}
                      placeholder="Select State"
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
                  <Form.Item label="City" name="city">
                    <Input placeholder="Enter City name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Zip/Postal Code" name="zipCode">
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
                  <Form.Item label="Account Owner" name="accountOwner">
                    <Input placeholder="Enter Account Owner" />
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
                    return (
                      <Select.Option key={parseFloat(tagItem.id)}>{tagItem.tag_name}</Select.Option>
                    );
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
