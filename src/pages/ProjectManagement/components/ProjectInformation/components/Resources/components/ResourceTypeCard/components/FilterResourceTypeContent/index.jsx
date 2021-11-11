import { Col, DatePicker, Form, Row, Select } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const FilterResourceTypeContent = (props) => {
  return (
    <Form layout="vertical" name="filter">
      <Form.Item label="By Project ID" name="byProjectID">
        <Select allowClear style={{ width: '100%' }} placeholder="Please select">
          {['A', 'B'].map((item) => {
            return (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="By division" name="byDivision">
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Please select">
          {['A', 'B'].map((item) => {
            return (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By PROJECT NAME" name="byProjectName">
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Please select">
          {['A', 'B'].map((item) => {
            return (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By customer" name="byCustomer">
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Please select">
          {['A', 'B'].map((item) => {
            return (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By engagement type" name="byEngagementType">
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Please select">
          {['A', 'B'].map((item) => {
            return (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By PROJECT manager" name="byProjectManager">
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Please select">
          {['A', 'B'].map((item) => {
            return (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By status" name="byStatus">
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Please select">
          {['A', 'B'].map((item) => {
            return (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By Start Date">
        <Row>
          <Col span={11}>
            <Form.Item name="s_fromDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="s_toDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label="By Tentative end date">
        <Row>
          <Col span={11}>
            <Form.Item name="e_fromDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="e_toDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  FilterResourceTypeContent,
);
