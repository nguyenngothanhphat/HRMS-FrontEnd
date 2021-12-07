import { Form, Select, Row, Col, DatePicker } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const FilterContent = (props) => {
  const {
    // dispatch,
    onFilter = () => {},
  } = props;

  const fetchDocumentTypeList = () => {};

  const onFinish = (values) => {
    const newValues = { ...values };

    // remove empty fields
    // eslint-disable-next-line no-return-assign
    const result = Object.entries(newValues).reduce(
      // eslint-disable-next-line no-return-assign
      (a, [k, v]) =>
        v == null || v.length === 0
          ? a
          : // eslint-disable-next-line no-param-reassign
            ((a[k] = v), a),
      {},
    );

    onFilter(result);
  };

  useEffect(() => {
    fetchDocumentTypeList();
  }, []);

  return (
    <Form layout="vertical" name="filter" onFinish={onFinish} className={styles.FilterContent}>
      <Form.Item label="by candidate id" name="candidateId">
        <Select allowClear style={{ width: '100%' }} placeholder="Please select">
          {[].map((item) => {
            return (
              <Select.Option value={item._id} key={item}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="by name" name="name">
        <Select allowClear style={{ width: '100%' }} placeholder="Please select">
          {[].map((item) => {
            return (
              <Select.Option value={item._id} key={item}>
                {item.generalInfo?.legalName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By job title" name="jobTitle">
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Please select">
          {[].map((item) => {
            return (
              <Select.Option value={item.id} key={item}>
                {item.type_name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By joining date">
        <Row>
          <Col span={11}>
            <Form.Item name="fromDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="toDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default connect(({ projectDetails, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  projectDetails,
}))(FilterContent);
