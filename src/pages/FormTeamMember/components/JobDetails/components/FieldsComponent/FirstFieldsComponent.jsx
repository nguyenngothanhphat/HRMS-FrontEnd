import React, { Component } from 'react';
import { Row, Col, Select, Typography } from 'antd';
const { Option } = Select;
import ExternalStyle from './FirstFieldsComponent.less';
class FirstFieldsComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { styles, dropdownField } = this.props;
    return (
      <div className={ExternalStyle.FirstFieldsComponent}>
        <Row gutter={[48, 0]}>
          <Col span={12}>
            <Typography.Title level={5}>{dropdownField[0].title}</Typography.Title>
            <Select placeholder={dropdownField[0].placeholder} className={styles}>
              {dropdownField[0].Option.map((data) => (
                <Option value={data.key}>
                  <Typography.Text className={ExternalStyle.SelectedOption}>
                    {data.name}
                  </Typography.Text>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Typography.Title level={5}>{dropdownField[1].title}</Typography.Title>
            <Select placeholder={dropdownField[1].placeholder} className={styles}>
              <Option></Option>
            </Select>
          </Col>
          <Col span={12}>
            <Typography.Title level={5}>{dropdownField[2].title}</Typography.Title>
            <Select placeholder={dropdownField[2].placeholder} className={styles}>
              <Option></Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Typography.Title level={5}>{dropdownField[3].title}</Typography.Title>
            <Select placeholder={dropdownField[3].placeholder} className={styles}>
              <Option></Option>
            </Select>
          </Col>
          <Col span={12}>
            <Typography.Title level={5}>{dropdownField[4].title}</Typography.Title>
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
