import React, { PureComponent } from 'react';
import { Form, Input, Checkbox, DatePicker, Divider, Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

class Certification extends PureComponent {
  handleInput = (e, type) => {
    const { target: { value = '' } = {} } = e;
    const { index = 0, handleChange = () => {} } = this.props;
    handleChange(type, index, value);
  };

  handleCheckBox = (e, type) => {
    const { target: { checked = false } = {} } = e;
    const { index = 0, handleChange = () => {} } = this.props;
    handleChange(type, index, checked);
  };

  minTwoDigits = (n) => {
    return (n < 10 ? '0' : '') + n;
  };

  render() {
    const {
      index = 0,
      remove = () => {},
      length = 0,
      certification = {},
      handleChange = () => {},
    } = this.props;
    return (
      <div className={styles.Certification}>
        <div className={styles.titleBar}>
          <span className={styles.title}>Certification {this.minTwoDigits(index + 1)}</span>
          <CloseOutlined
            style={length === 1 ? { display: 'none' } : { display: 'block' }}
            className={styles.deleteIcon}
            onClick={() => remove(index)}
          />
        </div>
        <Form name="basic">
          <Form.Item label="Certification name" name="name" labelCol={{ span: 24 }}>
            <Input placeholder="Certification name" onChange={(e) => this.handleInput(e, 'name')} />
          </Form.Item>
          <Form.Item>
            <Form.Item name="limittedPeriod" valuePropName="checked" noStyle>
              <Checkbox onChange={(e) => this.handleCheckBox(e, 'limittedPeriod')}>
                Limitted validity period
              </Checkbox>
            </Form.Item>

            <Form.Item name="mandatory" valuePropName="checked" noStyle>
              <Checkbox onChange={(e) => this.handleCheckBox(e, 'mandatory')}>
                Upload certificates mandatory
              </Checkbox>
            </Form.Item>
          </Form.Item>
          <Row gutter={['12']}>
            <Col span={12}>
              <Form.Item label="Issued date" name="issuedDate" labelCol={{ span: 24 }}>
                <DatePicker
                  placeholder="Issued date"
                  format="MM.DD.YY"
                  onChange={(val) => handleChange('issuedDate', index, val)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Validity date" name="validityDate" labelCol={{ span: 24 }}>
                <DatePicker
                  placeholder="Validity date"
                  format="MM.DD.YY"
                  onChange={(val) => handleChange('validityDate', index, val)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {index + 1 < length && <Divider />}
      </div>
    );
  }
}
export default Certification;
