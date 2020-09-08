import React, { Component } from 'react';
import { Radio, Row, Col, Select, DatePicker, Typography } from 'antd';
import ExternalStyle from './CandidateFieldsComponent.less';
const { Option } = Select;
class RadioComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dropdownField, styles } = this.props;
    return (
      <div className={ExternalStyle.CandidateFields}>
        <Typography.Text className={ExternalStyle.title}>To be filled by candidate</Typography.Text>
        <Row>
          <Col span={8}>
            <p>{dropdownField[5].title}</p>
            <Select placeholder={dropdownField[5].placeholder} className={styles}>
              <Option></Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <p>{dropdownField[6].title}</p>
            <DatePicker className={styles} placeholder="" picker="week"></DatePicker>
          </Col>
          <Col span={6}>
            <div className={ExternalStyle.warning}>
              <h4>Reminder</h4>
              <p>Anticipated Date of joining by the company, 22nd September, 2020</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RadioComponent;
