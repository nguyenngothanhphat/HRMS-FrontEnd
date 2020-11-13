/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent, Fragment } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'umi';
import styles from '../../../../WorkLocation/components/Edit/index.less';

const { Option } = Select;

@connect(
  ({ loading, country: { listState = [], listCountry = [] } = {}, companiesManagement = {} }) => ({
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
      originData: { companyDetails = {} },
    } = companiesManagement;
    const payload = {
      ...companyDetails,
      id: companyDetails._id,
      legalAddress: {
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
    const { listCountry = [], location, loadingUpdate, handleCancelEdit = () => {} } = this.props;
    const { listStateHead = [] } = this.state;
    const { name, address = '', country = '', state = '', zipCode = '' } = location;

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
            onFinish={this.handleUpdate}
          >
            <>
              <Form.Item label="Address*" name="address">
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
                  disabled={!listStateHead}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
