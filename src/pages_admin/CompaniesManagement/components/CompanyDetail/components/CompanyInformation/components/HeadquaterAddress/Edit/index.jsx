import React, { PureComponent } from 'react';
import { Button, Form, Input, Select, Row, Col } from 'antd';
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

  render() {
    const { handleCancelEdit = () => {} } = this.props;
    const { listCountry = [], companiesManagement } = this.props;
    const {
      headQuarterAddress: {
        address: addressHead = '',
        country: countryHead = '',
        state: stateHead = '',
        zipCode: zipCodeHead = '',
      } = {},
    } = companiesManagement;
    const listStateHead = this.findListState(countryHead) || [];

    const checkDisableBtnNext = !addressHead || !countryHead || !stateHead || !zipCodeHead;

    return (
      <div className={styles.edit}>
        <div className={styles.edit_form}>
          <Form
            name="formHeadQuarter"
            requiredMark={false}
            layout="vertical"
            colon={false}
            ref={this.formRef}
            initialValues={{
              address: addressHead,
              country: countryHead,
              state: stateHead,
              zipCode: zipCodeHead,
            }}
            onValuesChange={this.handleFormHeadquarter}
          >
            <Form.Item label="Address*" name="address">
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
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item label="State" name="state">
                  <Select
                    placeholder="Select State"
                    showArrow
                    showSearch
                    disabled={!countryHead}
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
              </Col>
              <Col span={12}>
                <Form.Item label="Zip Code" name="zipCode">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <div className={styles.edit_btn}>
              <Button type="text" className={styles.edit_btn_cancel} onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button
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
