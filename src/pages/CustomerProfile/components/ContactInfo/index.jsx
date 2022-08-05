import { CopyTwoTone } from '@ant-design/icons';
import { Card, Col, Form, Input, message, Row, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomEditButton from '@/components/CustomEditButton';
import styles from './index.less';

const ContactInfo = (props) => {
  const [contactForm] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);

  const {
    customerProfile: {
      info: {
        contactPhone = '',
        addressLine1 = '',
        website = '',
        addressLine2 = '',
        city = '',
        state = '',
        country = '',
        postalCode = '',
        contactEmail = '',
      } = {},
      info = {},
    },
    customerManagement: { country: countryList = [], state: stateList = [] } = {},
    loadingCountry = false,
    loadingState = false,
    loadingUpdate = false,
    dispatch,
  } = props;

  // ON FINISH
  useEffect(() => {
    if (isEditing) {
      dispatch({
        type: 'customerManagement/fetchCountryList',
      });
    }
  }, [isEditing]);

  const fetchState = (val) => {
    dispatch({
      type: 'customerManagement/fetchStateByCountry',
      payload: val,
    });
  };

  useEffect(() => {
    if (country && isEditing) {
      const find = countryList.find((x) => x.name === country);
      fetchState(find?._id);
    }
  }, [country, isEditing]);

  const onCountryChange = (value) => {
    contactForm.setFieldsValue({ state: null });
    const find = countryList.find((x) => x.name === value);
    fetchState(find._id);
  };

  const onFinish = async (values) => {
    const res = await dispatch({
      type: 'customerProfile/updateContactInfo',
      payload: { id: info.id, customerId: info.customerId, locationId: info.locationId, ...values },
    });
    if (res.statusCode === 200) {
      setIsEditing(false);
    }
  };

  // RENDER UI
  const renderOption = () => {
    if (isEditing) return null;
    return <CustomEditButton onClick={() => setIsEditing(true)}>Edit</CustomEditButton>;
  };

  const _renderEditMode = () => {
    return (
      <div className={styles.editMode}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          name="contactForm"
          // onFinish={onSubmit}
          initialValues={{
            contactPhone,
            addressLine1,
            website,
            addressLine2,
            city,
            state,
            country,
            postalCode,
            contactEmail,
          }}
          form={contactForm}
          className={styles.form}
          onFinish={onFinish}
        >
          <Form.Item label="Contact Phone:" name="contactPhone">
            <Input />
          </Form.Item>

          <Form.Item label="Contact Email:" name="contactEmail">
            <Input />
          </Form.Item>

          <Form.Item label="Website:" name="website">
            <Input />
          </Form.Item>

          <Form.Item label="Address Line 1:" name="addressLine1">
            <Input />
          </Form.Item>

          <Form.Item label="Address Line 2:" name="addressLine2">
            <Input />
          </Form.Item>

          <Form.Item label="City:" name="city">
            <Input />
          </Form.Item>

          <Form.Item label="State:" name="state">
            <Select loading={loadingState} disabled={loadingState || stateList.length === 0}>
              {stateList.map((x) => (
                <Select.Option value={x}>{x}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Country:" name="country">
            <Select onChange={onCountryChange} loading={loadingCountry}>
              {countryList.map((x) => (
                <Select.Option value={x.name}>{x.name} </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Zip/Postal Code:" name="postalCode">
            <Input />
          </Form.Item>
        </Form>
        <div className={styles.btnForm}>
          <CustomSecondaryButton onClick={() => setIsEditing(false)}>Cancel</CustomSecondaryButton>
          <CustomPrimaryButton
            form="contactForm"
            htmlType="submit"
            key="submit"
            loading={loadingUpdate}
          >
            Update
          </CustomPrimaryButton>
        </div>
      </div>
    );
  };

  const _renderViewMode = () => {
    const items = [
      {
        name: 'Contact Phone',
        value: contactPhone,
        copy: true,
      },
      {
        name: 'Contact Email',
        value: contactEmail,
        copy: true,
      },
      {
        name: 'Website',
        value: website,
        copy: true,
      },
      {
        name: 'Address Line 1',
        value: addressLine1,
      },
      {
        name: 'Address Line 2',
        value: addressLine2,
      },
      {
        name: 'City',
        value: city,
      },
      {
        name: 'State',
        value: state,
      },
      {
        name: 'Country',
        value: country,
      },
      {
        name: 'Zip/Postal Code',
        value: postalCode,
      },
    ];
    return (
      <div className={styles.viewMode}>
        <Row>
          {items.map((val) => {
            return (
              <>
                <Col span={8}>
                  <p className={styles.label}>{val.name}</p>
                </Col>
                <Col span={16}>
                  <p className={styles.value}>
                    {val.value}
                    {val.value && val.copy && (
                      <Tooltip title="Copy" placement="right">
                        <CopyTwoTone
                          style={{ paddingLeft: 16 }}
                          onClick={() => {
                            // eslint-disable-next-line compat/compat
                            navigator.clipboard?.writeText(val.value);
                            message.success('Copied to clipboard');
                          }}
                        />
                      </Tooltip>
                    )}
                  </p>
                </Col>
              </>
            );
          })}
        </Row>
      </div>
    );
  };

  return (
    <div className={styles.ContactInfo}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Contact Info" extra={renderOption()}>
            {isEditing ? _renderEditMode() : _renderViewMode()}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default connect(({ customerManagement, customerProfile, loading }) => ({
  customerProfile,
  customerManagement,
  loadingUpdate: loading.effects['customerProfile/updateContactInfo'],
  loadingCountry: loading.effects['customerManagement/fetchCountryList'],
  loadingState: loading.effects['customerManagement/fetchStateByCountry'],
}))(ContactInfo);
