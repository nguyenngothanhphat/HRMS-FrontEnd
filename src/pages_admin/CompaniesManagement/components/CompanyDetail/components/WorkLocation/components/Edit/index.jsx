/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent, Fragment } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'umi';
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

  handleUpdateLocation = (values, location) => {
    const {
      dispatch,
      companiesManagement: { idCurrentCompany = '', tenantCurrentCompany = '' },
      handleCancelEdit = () => {},
    } = this.props;

    const payload = {
      headQuarterAddress: {
        ...values,
      },
      company: idCurrentCompany,
      tenantId: tenantCurrentCompany,
      id: location?._id,
      name: location?.name,
    };

    dispatch({
      type: 'companiesManagement/updateLocation',
      payload,
    }).then((resp) => {
      const { statusCode } = resp;
      if (statusCode === 200) {
        handleCancelEdit();
      }
    });
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
      } = {},
    } = location;
    const { listStateHead = [] } = this.state;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <div className={styles.edit}>
        <div className={styles.edit_form}>
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
                <Input />
              </Form.Item>
              <Form.Item label="Address line 1" name="addressLine1">
                <Input />
              </Form.Item>
              <Form.Item label="Address line 2" name="addressLine2">
                <Input />
              </Form.Item>
              <Form.Item label="Country" name="country">
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
              <Form.Item label="State" name="state">
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
                label="Zip Code"
                name="zipCode"
                rules={[
                  {
                    pattern: /^[0-9]*$/,
                    message: 'Zip Code is not a valid number',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </>
            <div className={styles.edit_btn}>
              <Button type="text" className={styles.edit_btn_cancel} onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button
                loading={loadingUpdate}
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

export default Edit;
