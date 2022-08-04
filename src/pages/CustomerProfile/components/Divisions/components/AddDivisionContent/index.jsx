import { Checkbox, Col, Form, Input, Popover, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import iconNote from '../../../../../../assets/icon-note.svg';
import styles from './index.less';

const AddDivisionContent = (props) => {
  const [form] = Form.useForm();

  const {
    visible,
    onCloseModal = () => {},
    listTags = [],
    info: { accountOwner: { _id: accountOwnerId = '' } = {} } = {},
    divisionId,
    isCountrySelected = false,
    handleSelectCountry = () => {},
    countryList = [],
    stateList = [],
    employeeList = [],
    reId = '',
    dispatch,
    info,
  } = props;

  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'customerProfile/generateDivisionId',
        payload: {
          id: reId,
        },
      });
    }
  }, [visible]);

  const handleChange = (e) => {
    const {
      info: {
        addressLine1 = '',
        addressLine2 = '',
        city = '',
        state = '',
        country = '',
        postalCode = '',
      } = {},
    } = props;
    if (e.target.checked) {
      form.setFieldsValue({
        addressLine1,
        addressLine2,
        country,
        state,
        city,
        zipCode: postalCode,
      });
    }
  };

  const onSubmit = async (values) => {
    const {
      accountOwner,
      addressLine1,
      addressLine2,
      city,
      country,
      divisionId: divisionIdVal,
      divisionName,
      primaryPOCDesignation,
      primaryPOCEmail,
      primaryPOCName,
      primaryPOCPhNo,
      secondaryPOCDesignation,
      secondaryPOCEmail,
      secondaryPOCName,
      secondaryPOCPhNo,
      state,
      tags,
      zipCode,
      comments,
    } = values;
    const payload = {
      customerId: info.customerId,
      addressLine1,
      addressLine2,
      city,
      country,
      divisionId: divisionIdVal,
      divisionName,
      primaryPOCName,
      primaryPOCDesignation,
      primaryPOCEmail,
      primaryPOCNumber: primaryPOCPhNo,
      secondaryPOCDesignation,
      secondaryPOCEmail,
      secondaryPOCName,
      secondaryPOCNumber: secondaryPOCPhNo,
      state,
      tags: tags || [],
      postalCode: zipCode,
      comments,
      accountOwner,
    };

    await dispatch({
      type: 'customerProfile/addDivision',
      payload,
    }).then(() => {
      onCloseModal();
      form?.resetFields();
    });
  };

  return (
    <div className={styles.AddDivisionContent}>
      <Form
        name="myForm"
        layout="vertical"
        form={form}
        initialValues={{ accountOwner: accountOwnerId, divisionId }}
        onFinish={onSubmit}
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
              <Form.Item label="Primary POC Ph No." name="primaryPOCPhNo">
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
              <Form.Item label="Secondary POC Ph No." name="secondaryPOCPhNo">
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
                  onChange={(value) => {
                    handleSelectCountry(value);
                    form.setFieldsValue({
                      state: null,
                    });
                  }}
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
              <Form.Item label="Zip/Postal Code" name="zipCode">
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
  ({
    loading,
    customerManagement: { employeeList = [] } = {},
    customerProfile: { info = {}, divisionId = '' } = {},
  }) => ({
    loadingId: loading.effects['customerProfile/generateDivisionId'],
    divisionId,
    employeeList,
    info,
  }),
)(AddDivisionContent);
