import { Col, Divider, Form, Input, Popover, Row, Select } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import warnIcon from '@/assets/warning-filled.svg';
import DebounceSelect from '@/components/DebounceSelect';
import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

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
    user = {},
  }) => ({
    customerID,
    listTags,
    country,
    state,
    user,
    employeeList,
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
    this.state = {};
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

  onEmployeeSearch = (val) => {
    const { dispatch } = this.props;
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

  handleSubmit = async (values) => {
    const { customerID, status, legalName, dba, tags, comments, accountOwner } = values;
    const { onClose = () => {}, dispatch } = this.props;

    const payload = {
      tenantId: getCurrentTenant(),
      customerId: customerID,
      status,
      legalName: legalName || '',
      dba: dba || '',
      accountOwner: accountOwner || '',
      tags: tags || [],
      comment: comments || '',
    };
    const res = await dispatch({
      type: 'customerProfile/updateCustomerEffect',
      payload,
    });
    if (res.statusCode === 200) {
      dispatch({
        type: 'customerProfile/fetchCustomerInfo',
        payload: {
          id: customerID,
        },
      });
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
    const {
      listStatus,
      listTags,
      loadingTagList,
      listCustomer = [],
      selectedCustomer: {
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
        accountOwner = {},
      } = {},
    } = this.props;

    return (
      <div className={styles.EditCustomerModalContent}>
        <Form
          name="myForm"
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
          onFinish={this.handleSubmit}
        >
          {/* Basic Customer Detail */}
          <div className={styles.basicInfoForm}>
            <div className={styles.basicInfoTitle}>
              <p>Basic Customer Detail</p>
            </div>
            <Row gutter={24}>
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
                    fetchOptions={this.onEmployeeSearch}
                    showSearch
                    defaultValue={{
                      value: accountOwner?._id,
                      label: accountOwner?.generalInfo?.legalName,
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tags" name="tags">
                  <Select mode="multiple" placeholder="Select tags">
                    {listTags.map((tagItem) => {
                      return <Select.Option key={tagItem}>{tagItem}</Select.Option>;
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
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
