import { Col, DatePicker, Form, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const FilterResourcesContent = (props) => {
  const {
    dispatch,
    projectDetails: { billingStatusList = [], titleList = [] } = {},
    onFilter = () => {},
  } = props;

  const fetchDataList = () => {
    dispatch({
      type: 'projectDetails/fetchBillingStatusListEffect',
    });
    dispatch({
      type: 'projectDetails/fetchTitleListEffect',
    });
  };

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
    fetchDataList();
  }, []);

  return (
    <Form
      layout="vertical"
      name="filter"
      onFinish={onFinish}
      className={styles.FilterResourcesContent}
    >
      <Form.Item label="By designation" name="designation">
        <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
          {titleList.map((x) => (
            <Option value={x._id}>{x.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="By billing status" name="billingStatus">
        <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
          {billingStatusList.map((x) => (
            <Option value={x}>{x}</Option>
          ))}
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

      <Form.Item label="By End Date">
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

      <Form.Item label="By Revised Date">
        <Row>
          <Col span={11}>
            <Form.Item name="r_fromDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="r_toDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default connect(({ projectDetails, user: { currentUser: { employee = {} } = {} } }) => ({
  projectDetails,
  employee,
}))(FilterResourcesContent);
