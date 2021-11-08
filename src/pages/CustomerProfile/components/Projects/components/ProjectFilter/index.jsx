import React, { PureComponent } from 'react';
import { Col, DatePicker, Form, Row, Select } from 'antd';
import style from './index.less';

class ProjectFilter extends PureComponent {
  render() {
    const { onSubmit, listTypes } = this.props;
    return (
      <div className={style.docFilter}>
        <Form layout="vertical" name="filter" onFinish={(values) => onSubmit(values)}>
          <Form.Item label="By Project Name" name="byProjectName">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
            >
              {listTypes}
            </Select>
          </Form.Item>
          <Form.Item label="By Division" name="byDivision">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
            >
              {listTypes}
            </Select>
          </Form.Item>
          <Form.Item label="By Engagement Type" name="byEngagementType">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {listTypes}
            </Select>
          </Form.Item>
          <Form.Item label="By Project Manager" name="byProjectManager">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {listTypes}
            </Select>
          </Form.Item>
          <Form.Item label="By Status" name="byStatus">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {listTypes}
            </Select>
          </Form.Item>
          <Form.Item label="By Start Date">
            <Row gutter={16}>
              <Col span={11}>
                <Form.Item name="fromDateFrom">
                  <DatePicker format="MMM DD, YYYY" />
                </Form.Item>
              </Col>
              <Col span={2}>
                <span>to</span>
              </Col>
              <Col span={11} name="fromDateTo">
                <Form.Item>
                  <DatePicker format="MMM DD, YYYY" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="By End Date">
            <Row gutter={16}>
              <Col span={11}>
                <Form.Item name="toDateFrom">
                  <DatePicker format="MMM DD, YYYY" />
                </Form.Item>
              </Col>
              <Col span={2}>
                <span>to</span>
              </Col>
              <Col span={11} name="toDateTo">
                <Form.Item>
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

export default ProjectFilter;
