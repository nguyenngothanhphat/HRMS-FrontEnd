/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from '../../Information/Edit/index.less';

const { Option } = Select;

@connect(
  ({ country: { listState = [], listCountry = [] } = {}, companiesManagement = {}, loading }) => ({
    listState,
    listCountry,
    companiesManagement,
    loadingUpdate: loading.effects['companiesManagement/updateCompany'],
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

  handleUpdate = (changedValues) => {
    const { dispatch, companiesManagement, handleCancelEdit = () => {} } = this.props;
    const {
      originData: { companyDetails: { company: companyDetails = {} } = {} },
      tenantCurrentCompany,
    } = companiesManagement;
    const payload = {
      ...companyDetails,
      id: companyDetails._id,
      tenantId: tenantCurrentCompany,
      headQuarterAddress: {
        ...changedValues,
      },
    };
    delete payload._id;
    dispatch({
      type: 'companiesManagement/updateCompany',
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
    const {
      name,
      addressLine1 = '',
      addressLine2 = '',
      country = '',
      state = '',
      zipCode = '',
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
            name="formHeadquarterAddress"
            colon={false}
            ref={this.formRef}
            initialValues={{
              name,
              addressLine1,
              addressLine2,
              country,
              state,
              zipCode,
            }}
            onFinish={this.handleUpdate}
            {...formLayout}
          >
            <Form.Item
              label={formatMessage({ id: 'pages_admin.company.location.addressLine1' })}
              name="addressLine1"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'pages_admin.company.location.addressLine2' })}
              name="addressLine2"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'pages_admin.company.location.country' })}
              name="country"
            >
              <Select
                placeholder="Select Country"
                showArrow
                showSearch
                onChange={this.onChangeCountry}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {listCountry.map((item) => (
                  <Option key={item._id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'pages_admin.company.location.state' })}
              name="state"
            >
              <Select
                placeholder="Select State"
                showArrow
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {listStateHead.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'pages_admin.company.location.zipCode' })}
              name="zipCode"
            >
              <Input />
            </Form.Item>
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
