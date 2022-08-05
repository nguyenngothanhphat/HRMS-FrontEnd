/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable compat/compat */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent, Fragment } from 'react';
import { Button, Form, Input, notification, Select } from 'antd';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    country: { listState = [], listCountry = [] } = {},
    companiesManagement = {},
    loading,
    user: { currentUser: { manageTenant = [] } = {} } = {},
  }) => ({
    listState,
    listCountry,
    companiesManagement,
    manageTenant,
    loadingAddLocation: loading.effects['companiesManagement/addLocation'],
  }),
)
class AddWorkLocationForm extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.formRefLegal = React.createRef();

    this.state = {
      listStateHead: [],
    };
  }

  componentDidMount() {
    const searchInputs = document.querySelectorAll(`input[type='search']`);
    searchInputs.forEach((element) => element.setAttribute('autocomplete', 'nope'));
  }

  onChangeCountry = async (country) => {
    this.formRef.current.setFieldsValue({
      state: undefined,
    });
    const listStateHead = this.findListState(country);
    this.setState({
      listStateHead,
    });
  };

  findListState = (idCountry) => {
    const { listCountry = [] } = this.props;
    const itemCountry = listCountry.find((item) => item._id === idCountry) || {};
    const listState = itemCountry.states || [];
    return listState;
  };

  handleCancelAdd = () => {};

  handleAddLocation = async (values) => {
    const { dispatch, handleCancelAdd = () => {}, manageTenant = [] } = this.props;
    const tenantId = getCurrentTenant();
    const companyId = getCurrentCompany();

    const workLocations = [{ ...values }];

    const formatListLocation = workLocations.map((location) => {
      const {
        name = '',
        addressLine1 = '',
        addressLine2 = '',
        city = '',
        country = '',
        state = '',
        zipCode = '',
      } = location;
      return {
        name,
        headQuarterAddress: {
          addressLine1,
          addressLine2,
          city,
          country: country || country?._id || '',
          state,
          zipCode,
        },
        legalAddress: {
          addressLine1,
          addressLine2,
          city,
          country: country || country?._id || '',
          state,
          zipCode,
        },
        isHeadQuarter: false,
      };
    });

    const payload = {
      locations: formatListLocation,
      company: companyId,
      tenantId,
    };

    const res = await dispatch({
      type: 'companiesManagement/addMultiLocation',
      payload,
    });
    const { statusCode } = res;
    if (statusCode === 200) {
      notification.success({
        message: 'Add new locations successfully.',
      });
      // refresh locations in dropdown menu (owner)
      // dispatch({
      //   type: 'location/fetchLocationListByParentCompany',
      //   payload: {
      //     company: companyId,
      //     tenantIds: manageTenant,
      //   },
      // });
      // refresh work locations list
      dispatch({
        type: 'companiesManagement/fetchLocationsList',
        payload: { company: companyId, tenantId },
      }).then(() => {
        handleCancelAdd();
      });
    }
  };

  render() {
    const { listCountry = [], loadingAddLocation, handleCancelAdd = () => {} } = this.props;
    const { listStateHead = [] } = this.state;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <div className={styles.edit}>
        <div className={styles.spaceTitle}>
          <p className={styles.title}>Add work location</p>
        </div>
        <div className={styles.edit_form}>
          <Form
            name="formAddWorkLocation"
            {...formLayout}
            colon={false}
            ref={this.formRef}
            // onValuesChange={this.handleFormAddLocation}
            onFinish={this.handleAddLocation}
          >
            <>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter location name!',
                  },
                  {
                    pattern: /^([a-zA-Z0-9]((?!__|--)[a-zA-Z0-9_\-\s])+[a-zA-Z0-9])$/,
                    message: 'Name is not a validate name!',
                  },
                ]}
              >
                <Input placeholder="Location Name" />
              </Form.Item>
              <Form.Item
                label="Address line 1"
                name="addressLine1"
                rules={[
                  {
                    required: true,
                    message: 'Please enter address line 1!',
                  },
                ]}
              >
                <Input placeholder="Address Line 1" />
              </Form.Item>
              <Form.Item label="Address line 2" name="addressLine2">
                <Input placeholder="Address Line 2" />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please enter City Name!',
                  },
                ]}
                label="City Name"
                name="city"
              >
                <Input placeholder="City Name" />
              </Form.Item>
              <Form.Item
                label="Country"
                name="country"
                rules={[
                  {
                    required: true,
                    message: 'Please select Country!',
                  },
                ]}
              >
                <Select
                  placeholder="Select Country"
                  showArrow
                  showSearch
                  onChange={this.onChangeCountry}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {listCountry.map((item) => (
                    <Option key={item._id}>{item.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="State"
                name="state"
                rules={[
                  {
                    required: true,
                    message: 'Please select State!',
                  },
                ]}
              >
                <Select
                  placeholder="Select State"
                  showArrow
                  showSearch
                  disabled={listStateHead.length === 0}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {listStateHead.map((item) => (
                    <Option key={item}>{item}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Zip/Postal Code"
                name="zipCode"
                rules={[
                  {
                    pattern: /^[0-9]*$/,
                    message: 'Zip/Postal Code is not a valid number',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </>
            <div className={styles.edit_btn}>
              <Button
                type="text"
                className={styles.edit_btn_cancel}
                onClick={() => handleCancelAdd()}
              >
                Cancel
              </Button>
              <Button
                loading={loadingAddLocation}
                type="primary"
                htmlType="submit"
                className={styles.edit_btn_save}
              >
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default AddWorkLocationForm;
