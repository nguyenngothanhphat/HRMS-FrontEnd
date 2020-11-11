/* eslint-disable react/jsx-curly-newline */
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
class AddWorkLocationForm extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.formRefLegal = React.createRef();
  }

  onChangeCountry = () => {
    const { dispatch } = this.props;
    this.formRef.current.setFieldsValue({
      state: undefined,
    });
    dispatch({
      type: 'companiesManagement/saveHeadQuarterAddress',
      payload: { state: '' },
    });
  };

  handleFormAddLocation = (changedValues) => {
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

  handleCancelAdd = () => {};

  handleAddLocation = (values) => {
    const { handleCancelAdd = () => {} } = this.props;

    const {
      companiesManagement: { idCurrentCompany = '' },
      dispatch,
    } = this.props;

    if (idCurrentCompany) {
      const payload = {
        ...values,
        company: idCurrentCompany,
      };
      dispatch({
        type: 'companiesManagement/addLocation',
        payload,
      }).then((resp) => {
        if (resp) {
          const { statusCode } = resp;
          if (statusCode === 200) {
            handleCancelAdd();
          }
        }
      });
    }
  };

  render() {
    const { handleCancelAdd = () => {} } = this.props;
    const { listCountry = [], companiesManagement } = this.props;
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
        <div className={styles.spaceTitle}>
          <p className={styles.title}>Add work location</p>
        </div>
        <div className={styles.edit_form}>
          <Form
            name="formHeadQuarter"
            requiredMark={false}
            {...formLayout}
            colon={false}
            ref={this.formRef}
            initialValues={
              {
                // address: addressHead,
                // country: countryHead,
                // state: stateHead,
                // zipCode: zipCodeHead,
              }
            }
            onValuesChange={this.handleFormAddLocation}
            onFinish={this.handleAddLocation}
          >
            <>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Address*"
                name="address"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Country"
                name="country"
                rules={[
                  {
                    required: true,
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
                  },
                ]}
              >
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
                    required: true,
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

export default AddWorkLocationForm;
