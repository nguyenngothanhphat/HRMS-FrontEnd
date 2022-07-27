import React, { PureComponent } from 'react';
import { Col, DatePicker, Form, Row, Select } from 'antd';
import style from './index.less';

class DocumentFilter extends PureComponent {
  render() {
    const { onFilter, documentType, uploadByList = [] } = this.props;
    return (
      <div className={style.docFilter}>
        <Form layout="vertical" name="filter" onFinish={(values) => onFilter(values)}>
          <Form.Item label="By Type" name="byType">
            <Select
              // mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {documentType.map((item) => (
                <Select.Option key={item.id}>{item.type_name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="By uploaded by" name="byUpload">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {uploadByList.map((item) => {
                return <Select.Option key={item}>{item}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item label="By Uploaded On">
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

export default DocumentFilter;
