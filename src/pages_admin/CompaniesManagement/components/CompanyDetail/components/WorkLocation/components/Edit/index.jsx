/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent, Fragment } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

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
  }

  onChangeCountryHeadquarter = () => {
    const { dispatch } = this.props;
    this.formRef.current.setFieldsValue({
      state: undefined,
    });
    dispatch({
      type: 'companiesManagement/saveHeadQuarterAddress',
      payload: { state: '' },
    });
  };

  handleFormHeadquarter = (changedValues) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companiesManagement/saveHeadQuarterAddress',
      payload: { ...changedValues },
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
      companiesManagement: { idCurrentCompany = '' },
      handleCancelEdit = () => {},
    } = this.props;

    const payload = {
      ...values,
      company: idCurrentCompany,
      id: location.id,
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
    const {
      listCountry = [],
      companiesManagement,
      location,
      handleCancelEdit = () => {},
      loadingUpdate,
    } = this.props;
    const { name, address = '', country = '', state = '', zipCode = '' } = location;
    const {
      headQuarterAddress: {
        // address: addressHead = '',
        country: countryHead = '',
        // state: stateHead = '',
        // zipCode: zipCodeHead = '',
      } = {},
    } = companiesManagement;
    const listStateHead = this.findListState(countryHead) || [];
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
              address,
              country: country._id,
              state,
              zipCode,
            }}
            onValuesChange={this.handleFormHeadquarter}
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
              <Form.Item label="Address" name="address">
                <Input />
              </Form.Item>
              <Form.Item label="Country" name="country">
                <Select
                  placeholder="Select Country"
                  showArrow
                  showSearch
                  onChange={this.onChangeCountryHeadquarter}
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
                  disabled={!countryHead}
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
