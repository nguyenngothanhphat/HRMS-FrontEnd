/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent, Fragment } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'umi';
import styles from '../../../../WorkLocation/components/Edit/index.less';

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

  onChangeCountryLegalAddress = () => {
    const { dispatch } = this.props;
    this.formRef.current.setFieldsValue({
      state: undefined,
    });
    dispatch({
      type: 'companiesManagement/saveLegalAddress',
      payload: { state: '' },
    });
  };

  handleFormLegalAddress = (changedValues) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companiesManagement/saveLegalAddress',
      payload: { ...changedValues },
    });
  };

  findListState = (idCountry) => {
    const { listCountry = [] } = this.props;
    const itemCountry = listCountry.find((item) => item._id === idCountry) || {};
    const listState = itemCountry.states || [];
    return listState;
  };

  render() {
    const { handleCancelEdit = () => {} } = this.props;
    const { listCountry = [], companiesManagement } = this.props;
    const {
      legalAddress: {
        address: addressLegal = '',
        country: countryLegal = '',
        state: stateLegal = '',
        zipCode: zipCodeLegal = '',
      } = {},
    } = companiesManagement;
    const listStateHead = this.findListState(countryLegal) || [];

    const checkDisableBtnNext = !addressLegal || !countryLegal || !stateLegal || !zipCodeLegal;

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
              address: addressLegal,
              country: countryLegal,
              state: stateLegal,
              zipCode: zipCodeLegal,
            }}
            onValuesChange={this.handleFormLegalAddress}
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
                  onChange={this.onChangeCountryLegalAddress}
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
                  disabled={!countryLegal}
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
              <Button
                type="primary"
                htmlType="submit"
                disabled={checkDisableBtnNext}
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
