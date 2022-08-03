/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent, Fragment } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import styles from '../../../CompanyInformation/components/Information/Edit/index.less';

const { Option } = Select;

@connect(
  ({ country: { listState = [], listCountry = [] } = {}, companiesManagement = {}, loading }) => ({
    listState,
    listCountry,
    companiesManagement,
    loadingUpdate: loading.effects['companiesManagement/updateLocation'],
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.formRefLegal = React.createRef();
    this.state = {
      listStateHead: [],
      isSaved: false,
      notification: 'This location is updated successfully.',
      notificationColor: '#00c598',
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const { country = '' } = location;

    if (country) {
      const listStateHead = this.findListState(country._id);
      this.setState({
        listStateHead,
      });
    }
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

  compareValues = (beforeVals, afterVals) => {
    const {
      name,
      addressLine1 = '',
      addressLine2 = '',
      city = '',
      country = '',
      state = '',
      zipCode = '',
    } = beforeVals;
    const {
      headQuarterAddress: {
        addressLine1: newAddressLine1 = '',
        addressLine2: newAddressLine2 = '',
        city: newCity = '',
        country: { _id: newCountry = '' } = {},
        state: newState = '',
        zipCode: newZipCode = '',
      } = {},
      name: newName,
    } = afterVals;

    return (
      name === newName &&
      addressLine1 === newAddressLine1 &&
      addressLine2 === newAddressLine2 &&
      city === newCity &&
      country === newCountry &&
      state === newState &&
      zipCode === newZipCode
    );
  };

  handleUpdateLocation = (values, location) => {
    const { dispatch, handleCancelEdit = () => {} } = this.props;
    const tenantId = getCurrentTenant();

    const {
      name,
      addressLine1 = '',
      addressLine2 = '',
      city = '',
      country = '',
      state = '',
      zipCode = '',
    } = values;

    const checkTheSame = this.compareValues(values, location);

    if (checkTheSame) {
      this.setState({
        notification: 'Nothing changed.',
        notificationColor: '#FD4546',
        isSaved: true,
      });
      setTimeout(() => {
        this.setState({
          isSaved: false,
        });
        handleCancelEdit();
      }, 2500);
    } else {
      const payload = {
        tenantId,
        id: location?._id,
        name,
        headQuarterAddress: {
          addressLine1,
          addressLine2,
          city,
          country,
          state,
          zipCode,
        },
        // legalAddress: {
        //   addressLine1,
        //   addressLine2,
        //   country,
        //   state,
        //   zipCode,
        // },
      };

      dispatch({
        type: 'companiesManagement/updateLocation',
        payload,
      }).then((resp) => {
        const { statusCode } = resp;
        if (statusCode === 200) {
          this.setState({
            isSaved: true,
          });
          setTimeout(() => {
            this.setState({
              isSaved: false,
            });
            handleCancelEdit();
          }, 2500);
        }
      });
    }
  };

  render() {
    const { listCountry = [], location, handleCancelEdit = () => {}, loadingUpdate } = this.props;
    const { name } = location;
    const {
      headQuarterAddress: {
        addressLine1 = '',
        addressLine2 = '',
        country = {},
        state = '',
        zipCode = '',
        city = '',
      } = {},
    } = location;
    const { listStateHead = [], notification, notificationColor, isSaved } = this.state;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    return (
      <div className={styles.edit}>
        <div className={styles.edit_form}>
          {isSaved && (
            <div style={{ backgroundColor: `${notificationColor}` }} className={styles.savedBanner}>
              <span>{notification}</span>
            </div>
          )}
          <Form
            name="formEditLocation"
            requiredMark={false}
            {...formLayout}
            colon={false}
            ref={this.formRef}
            initialValues={{
              name,
              addressLine1,
              addressLine2,
              city,
              country: country?._id,
              state,
              zipCode,
            }}
            onValuesChange={this.handleFormEditLocation}
            onFinish={(values) => this.handleUpdateLocation(values, location)}
          >
            <>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
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
                rules={[
                  {
                    required: true,
                    message: 'Please enter address line 1!',
                  },
                ]}
                label="Address line 1"
                name="addressLine1"
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
                rules={[
                  {
                    required: true,
                    message: 'Please select Country!',
                  },
                ]}
                label="Country"
                name="country"
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
                rules={[
                  {
                    required: true,
                    message: 'Please select State!',
                  },
                ]}
                label="State"
                name="state"
              >
                <Select
                  placeholder="Select State"
                  showArrow
                  showSearch
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
                <Input placeholder="Zip/Postal Code" />
              </Form.Item>
            </>
            <div className={styles.edit_btn}>
              <Button
                disabled={isSaved}
                type="text"
                className={styles.edit_btn_cancel}
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                loading={loadingUpdate}
                type="primary"
                htmlType="submit"
                className={styles.edit_btn_save}
                disabled={isSaved}
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

export default Edit;
