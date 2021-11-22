import { Button, Form, Input, Select } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    customerManagement: { country: countryList = [], state: stateList = [] } = {},
    customerProfile: { info = {} } = {},
  }) => ({
    countryList,
    stateList,
    info,
    loadingUpdate: loading.effects['customerProfile/updateContactInfo'],
    loadingCountry: loading.effects['customerManagement/fetchCountryList'],
    loadingState: loading.effects['customerManagement/fetchStateByCountry'],
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate = (prevProps) => {
    const { countryList = [], info: { country } = {} } = this.props;
    if (JSON.stringify(prevProps.countryList) !== JSON.stringify(countryList) && country) {
      const find = countryList.find((x) => x.name === country);
      if (find) {
        this.fetchStateByCountry(find._id);
      }
    }
  };

  fetchStateByCountry = (country) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagement/fetchStateByCountry',
      payload: country,
    });
  };

  onCountryChange = (value) => {
    const { countryList = [] } = this.props;
    const find = countryList.find((x) => x.name === value);
    if (find) {
      this.fetchStateByCountry(find._id);
    }
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagement/fetchCountryList',
    });
  };

  onSubmit = async (values) => {
    const { dispatch, info, onClose = () => {} } = this.props;
    const res = await dispatch({
      type: 'customerProfile/updateContactInfo',
      payload: { id: info.id, customerId: info.customerId, locationId: info.locationId, ...values },
    });
    if (res.statusCode) {
      onClose();
    }
  };

  render() {
    const {
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
      loadingUpdate = false,
      onClose = () => {},
      countryList = [],
      stateList = [],
      loadingCountry = false,
      loadingState = false,
    } = this.props;

    return (
      <div className={styles.Edit}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          name="myForm"
          onFinish={this.onSubmit}
          ref={this.formRef}
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
          className={styles.form}
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
            <Select onChange={this.onCountryChange} loading={loadingCountry}>
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
          <Button className={styles.btnClose} onClick={onClose}>
            Close
          </Button>
          <Button
            className={styles.btnApply}
            form="myForm"
            htmlType="submit"
            key="submit"
            onClick={this.handleEdit}
            loading={loadingUpdate}
          >
            Update
          </Button>
        </div>
      </div>
    );
  }
}

export default Edit;
