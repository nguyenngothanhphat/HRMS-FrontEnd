import React, { PureComponent } from 'react';
import { Col, DatePicker, Form, Row, Select } from 'antd';
import style from './index.less';

class NotestFilter extends PureComponent {
  render() {
    const { onSubmit, listEmployeeActive } = this.props;
    return (
      <div className={style.docFilter} style={{ width: '350px' }}>
        <Form layout="vertical" name="filter" onFinish={(values) => onSubmit(values)}>
          <Form.Item label="By Author" name="byAuthor">
            <Select allowClear style={{ width: '100%' }} placeholder="Please select">
              {listEmployeeActive.map((item) => {
                return (
                  <Select.Option value={item._id} key={item._id}>
                    {item.generalInfo?.legalName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="By Date">
            <Row gutter={24}>
              <Col span={11}>
                <Form.Item name="fromDate">
                  <DatePicker format="MMM DD, YYYY" />
                </Form.Item>
              </Col>
              <Col span={2}>
                <p>to</p>
              </Col>
              <Col span={11}>
                <Form.Item name="toDate">
                  <DatePicker format="MMM DD, YYYY" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default NotestFilter;
