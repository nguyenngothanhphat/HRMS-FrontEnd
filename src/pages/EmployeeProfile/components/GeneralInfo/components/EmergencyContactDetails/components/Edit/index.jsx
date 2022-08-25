/* eslint-disable react/jsx-props-no-spreading */
import { PlusOutlined } from '@ant-design/icons';
import { Col, Form, Input, notification, Row, Select, Space } from 'antd';
import React, { Component, useEffect } from 'react';
import { connect, formatMessage } from 'umi';
import removeIcon from '../assets/removeIcon.svg';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import styles from './index.less';

const { Option } = Select;

const Edit = (props) => {
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 9 },
      sm: { span: 12 },
    },
  };

  const {
    dispatch,
    employeeProfile: {
      employee = '',
      employmentData: { generalInfo = {} } = {},
      listRelation = [],
    } = {},
    loading,
    handleCancel = () => {},
  } = props;

  const { emergencyContactDetails = [] } = generalInfo;

  useEffect(() => {
    dispatch({
      type: 'employeeProfile/fetchListRelation',
    });
  }, []);

  const onFinish = async (values) => {
    const payload = {
      generalInfo: { emergencyContactDetails: values.emergencyContactDetails },
      _id: employee,
    };
    const res = await dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
    });
    if (res.statusCode === 200) {
      handleCancel();
    }
  };

  return (
    <Row gutter={[0, 24]} className={styles.Edit}>
      <Form
        form={form}
        className={styles.Form}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...formItemLayout}
        name="editEmergencyContactForm"
        initialValues={{
          emergencyContactDetails,
        }}
        onFinish={onFinish}
      >
        <Form.List name="emergencyContactDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div className={styles.containerForm}>
                  <div className={styles.removeIcon} onClick={() => remove(name)}>
                    <img src={removeIcon} alt="remove" />
                  </div>

                  <Form.Item
                    {...restField}
                    name={[name, 'emergencyPersonName']}
                    label="Emergency Contact’s Name"
                    validateTrigger="onChange"
                    rules={[
                      {
                        pattern: /^[a-zA-Z ]*$/,
                        message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
                      },
                      {
                        required: true,
                        message: 'Required field!',
                      },
                    ]}
                  >
                    <Input
                      className={styles.inputForm}
                      placeholder="Enter the Emergency Contact’s Name"
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'emergencyRelation']}
                    label="Relation"
                    rules={[
                      {
                        pattern: /^[a-zA-Z ]*$/,
                        message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
                      },
                      {
                        required: true,
                        message: 'Required field!',
                      },
                    ]}
                  >
                    <Select
                      size={14}
                      placeholder="Please select a choice"
                      showArrow
                      filterOption={
                        (input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // eslint-disable-next-line react/jsx-curly-newline
                      }
                      className={styles.inputForm}
                    >
                      {listRelation.map((value, i) => {
                        return (
                          <Option key={`${i + 1}`} value={value}>
                            {value}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Contact No."
                    name={[name, 'emergencyContact']}
                    rules={[
                      {
                        // pattern: /^[+]*[\d]{0,10}$/,
                        pattern:
                          // eslint-disable-next-line no-useless-escape
                          /^(?=.{0,25}$)((?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?)$/gm,
                        message: formatMessage({
                          id: 'pages.employeeProfile.validateWorkNumber',
                        }),
                      },
                      {
                        required: true,
                        message: 'Required field!',
                      },
                    ]}
                  >
                    <Input
                      className={styles.inputForm}
                      placeholder="Enter the Emergency Contact’s Number"
                    />
                  </Form.Item>
                </div>
              ))}

              <Col span={24} className={styles.addMoreButton}>
                <div onClick={add}>
                  <PlusOutlined className={styles.addMoreButtonIcon} />
                  Add another Emergency Contact
                </div>
              </Col>
            </>
          )}
        </Form.List>

        <div className={styles.spaceFooter}>
          <CustomSecondaryButton onClick={handleCancel}>Cancel</CustomSecondaryButton>
          <CustomPrimaryButton htmlType="submit" loading={loading} form="editEmergencyContactForm">
            Save
          </CustomPrimaryButton>
        </div>
      </Form>
    </Row>
  );
};

export default connect(({ loading, employeeProfile = {} }) => ({
  loading: loading.effects['employeeProfile/updateGeneralInfo'],
  employeeProfile,
}))(Edit);
