import React, { PureComponent } from 'react';
import { Form, Select, Input, Row, Col, DatePicker } from 'antd';
import { connect } from 'umi';
// import styles from './index.less';
const { Option } = Select;

@connect(({ documentsManagement }) => ({
  documentsManagement,
}))
class VisaForm extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/fetchCountryList',
    });
  };

  render() {
    const dateFormat = 'MM.DD.YY';
    const {
      documentsManagement: { countryList = [] },
    } = this.props;
    const formatCountryList = countryList.map((item) => {
      const { _id: value, name } = item;
      return {
        value,
        name,
      };
    });

    return (
      <div>
        <Row gutter={['20', '20']}>
          <Col span={12}>
            <Form.Item
              name="visaNumber"
              label="Visa Number"
              rules={[
                {
                  required: true,
                  pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                  message: 'Invalid Visa Number',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="visaType"
              label="Visa Type"
              rules={[{ required: true, message: 'Please select visa type!' }]}
            >
              <Select onChange={() => {}}>
                <Option value="B1">B1</Option>
                <Option value="B2">B2</Option>
                <Option value="B3">B3</Option>
                <Option value="nothing">nothing...</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={['20', '20']}>
          <Col span={12}>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: 'Please select country!' }]}
            >
              <Select onChange={() => {}}>
                {formatCountryList.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="entryType"
              label="Entry Type"
              rules={[{ required: true, message: 'Please select entry type!' }]}
            >
              <Select onChange={() => {}}>
                <Option value="Single Entry">Single Entry</Option>
                <Option value="nothing">nothing....</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={['20', '20']}>
          <Col span={12}>
            <Form.Item
              name="issuedOn"
              label="Issued On"
              rules={[{ required: true, message: 'Please select issued time!' }]}
            >
              <DatePicker format={dateFormat} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="validTill"
              label="Valid Till"
              rules={[{ required: true, message: 'Please select expired time!' }]}
            >
              <DatePicker format={dateFormat} />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}
export default VisaForm;
