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
                  {
                    pattern: /^([a-zA-Z0-9]((?!__|--)[a-zA-Z0-9_\-\s])+[a-zA-Z0-9])$/,
                    message: 'Name is not a validate name!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Address"
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
