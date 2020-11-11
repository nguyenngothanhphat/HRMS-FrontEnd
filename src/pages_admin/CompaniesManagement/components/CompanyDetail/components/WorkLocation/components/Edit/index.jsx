/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent, Fragment } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

@connect(({ country: { listState = [], listCountry = [] } = {}, companiesManagement = {} }) => ({
  listState,
  listCountry,
  companiesManagement,
}))
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
    } = this.props;

    const payload = {
      ...values,
      company: idCurrentCompany,
      id: location.id,
    };
    dispatch({
      type: 'companiesManagement/updateLocation',
      payload,
    });
    console.log('payload', payload);
  };

  render() {
    const { handleCancelEdit = () => {} } = this.props;
    const { listCountry = [], companiesManagement, location } = this.props;
    const {
      headQuarterAddress: {
        // address: addressHead = '',
        country: countryHead = '',
        // state: stateHead = '',
        // zipCode: zipCodeHead = '',
      } = {},
    } = companiesManagement;
    const { name, address = '', country = '', state = '', zipCode = '' } = location;
    const listStateHead = this.findListState(countryHead) || [];
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <div className={styles.edit}>
        <div className={styles.edit_form}>
          <Form
            name="formHeadQuarter"
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
              <Form.Item label="Name" name="name">
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
                  filterOption={
                    (input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // eslint-disable-next-line react/jsx-curly-newline
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
                  // disabled={!countryHead}
                  filterOption={
                    (input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // eslint-disable-next-line react/jsx-curly-newline
                  }
                >
                  {listStateHead.map((item) => (
                    <Option key={item}>{item}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Zip Code" name="zipCode">
                <Input />
              </Form.Item>
            </>
            <div className={styles.edit_btn}>
              <Button type="text" className={styles.edit_btn_cancel} onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" className={styles.edit_btn_save}>
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
