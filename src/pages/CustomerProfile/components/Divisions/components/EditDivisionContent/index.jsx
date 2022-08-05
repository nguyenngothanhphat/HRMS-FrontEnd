import { Checkbox, Col, Form, Input, Popover, Row, Select } from 'antd';
import React from 'react';
import { connect } from 'umi';
import iconNote from '@/assets/icon-note.svg';
import styles from './index.less';

const EditDivisionContent = (props) => {
  const [form] = Form.useForm();

  const {
    listTags = [],
    isCountrySelected,
    handelSelectCountry,
    countryList = [],
    stateList = [],
    employeeList = [],
    data = {},
    info = {},
    onClose = () => {},
    dispatch,
  } = props;

  const {
    accountOwner = '',
    divisionId = '',
    divisionName = '',
    primaryPOCName = '',
    primaryPOCNumber = '',
    primaryPOCEmail = '',
    primaryPOCDesignation = '',
    secondaryPOCName = '',
    secondaryPOCNumber = '',
    secondaryPOCEmail = '',
    secondaryPOCDesignation = '',
    sameAsHQ = '',
    addressLine1 = '',
    addressLine2 = '',
    country = '',
    state = '',
    city = '',
    postalCode = '',
    tags = [],
    comments = '',
  } = data;

  const handleClose = () => {
    form?.resetFields();
    onClose();
  };

  const handleChange = (e) => {
    if (e.target.checked) {
      form.setFieldsValue({
        addressLine1: info?.addressLine1,
        addressLine2: info?.addressLine2,
        country: info?.country,
        state: info?.state,
        city: info?.city,
        postalCode: info?.postalCode,
      });
    }
  };

  const onEditDivision = async (values) => {
    const payload = {
      ...values,
      customerId: info.customerId,
      tags: values.tags || [],
    };
    const res = await dispatch({
      type: 'customerProfile/updateDivision',
      payload,
    });
    if (res.statusCode === 200) {
      handleClose();
    }
  };

  return (
    <div className={styles.EditDivisionContent}>
      <Form
        name="myForm"
        layout="vertical"
        form={form}
        initialValues={{
          accountOwner,
          divisionId,
          divisionName,
          primaryPOCName,
          primaryPOCNumber,
          primaryPOCEmail,
          primaryPOCDesignation,
          secondaryPOCName,
          secondaryPOCNumber,
          secondaryPOCEmail,
          secondaryPOCDesignation,
          sameAsHQ,
          addressLine1,
          addressLine2,
          country,
          state,
          city,
          postalCode,
          comments,
          tags,
        }}
        onFinish={onEditDivision}
      >
        {/* Basic Customer Detail */}
        <div className={styles.basicInfoForm}>
          <div className={styles.basicInfoTitle}>
            <p>Basic Division Detail</p>
          </div>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                // loading={loadingId}
                label={
                  <p style={{ marginBottom: '0' }}>
                    Division ID
                    <Popover
                      className={styles.popover}
                      style={{}}
                      placement="right"
                      content={() => <p style={{ marginBottom: '0' }}>Generate automatically</p>}
                    >
                      <img className={styles.popopverImg} src={iconNote} alt="note" />
                    </Popover>
                  </p>
                }
                name="divisionId"
              >
                <Input disabled style={{ color: '#000' }} placeholder="Enter Division ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Division Name" name="divisionName">
                <Input placeholder="Enter Division Name" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Contact Detail */}
        <div className={styles.contactDetail}>
          <div className={styles.contactDetailTitle}>
            <p>Contact Detail</p>
          </div>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Primary POC Name" name="primaryPOCName">
                <Input placeholder="Enter Primary POC Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Primary POC Ph No." name="primaryPOCNumber">
                <Input placeholder="Enter Primary POC Ph No." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Primary POC Email ID" name="primaryPOCEmail">
                <Input placeholder="Enter Primary POC Email ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Primary POC Designation" name="primaryPOCDesignation">
                <Input placeholder="Enter Primary POC Designation" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Secondary POC Name" name="secondaryPOCName">
                <Input placeholder="Enter Secondary POC Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Secondary POC Ph No." name="secondaryPOCNumber">
                <Input placeholder="Enter Secondary POC Ph No." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Secondary POC Email ID" name="secondaryPOCEmail">
                <Input placeholder="Enter Secondary POC Email ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Secondary POC Designation" name="secondaryPOCDesignation">
                <Input placeholder="Enter Secondary POC Designation" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="sameAsHQ">
            <Checkbox onChange={(e) => handleChange(e)}>Same address as HQ</Checkbox>
          </Form.Item>

          <Form.Item label="Address Line 1" name="addressLine1">
            <Input placeholder="Enter Address Line 1" />
          </Form.Item>
          <Form.Item label="Address Line 2" name="addressLine2">
            <Input placeholder="Enter Address Line 2" />
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Country" name="country">
                <Select
                  placeholder="Select Country"
                  onChange={(value) => handelSelectCountry(value)}
                >
                  {countryList.map((item) => {
                    return (
                      <Select.Option value={item._id} key={item.name}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="State" name="state">
                <Select disabled={isCountrySelected} placeholder="Select State">
                  {stateList.map((stateItem) => {
                    return <Select.Option key={stateItem}>{stateItem}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="City" name="city">
                <Input placeholder="Enter City name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Zip/Postal Code" name="postalCode">
                <Input placeholder="Enter Postal Code" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Other Detail */}
        <div className={styles.otherDetail}>
          <div className={styles.otherDetailTitle}>
            <p>Other Details</p>
          </div>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Account Owner" name="accountOwner">
                <Select placeholder="Enter Account Owner">
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
            <Col span={12} />
            <Col span={24}>
              <Form.Item label="Tags (Optional)" name="tags">
                <Select mode="multiple" placeholder="Enter tags">
                  {listTags.map((item) => {
                    return <Select.Option key={item}>{item}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Comments (Optional)" name="comments">
                <Input.TextArea placeholder="Enter Comments" autoSize={{ minRows: 5 }} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default connect(
  ({ customerManagement: { employeeList = [] } = {}, customerProfile: { info = {} } = {} }) => ({
    employeeList,
    info,
  }),
)(EditDivisionContent);
