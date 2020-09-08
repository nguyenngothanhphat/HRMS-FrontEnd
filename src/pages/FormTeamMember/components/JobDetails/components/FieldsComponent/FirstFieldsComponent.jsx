import React, { Component } from 'react';
import { Row, Col, Select } from 'antd';
const { Option } = Select;
class FirstFieldsComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { styles, dropdownField } = this.props;
    return (
      <div>
        <Row>
          <Col span={8}>
            <p>{dropdownField[0].title}</p>
            <Select placeholder={dropdownField[0].placeholder} className={styles}>
              {dropdownField[0].Option.map((data) => (
                <Option>{data}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <p>{dropdownField[1].title}</p>
            <Select placeholder={dropdownField[1].placeholder} className={styles}>
              <Option></Option>
            </Select>
          </Col>
          <Col span={8}>
            <p>{dropdownField[2].title}</p>
            <Select placeholder={dropdownField[2].placeholder} className={styles}>
              <Option></Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <p>{dropdownField[3].title}</p>
            <Select placeholder={dropdownField[3].placeholder} className={styles}>
              <Option></Option>
            </Select>
          </Col>
          <Col span={8}>
            <p>{dropdownField[4].title}</p>
            <Select placeholder={dropdownField[4].placeholder} className={styles}>
              <Option></Option>
            </Select>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FirstFieldsComponent;
