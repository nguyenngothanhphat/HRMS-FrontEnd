import { Col, DatePicker, Form, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const FilterResourcesContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    projectDetails: { billingStatusList = [], titleList = [] } = {},
    onFilter = () => {},
    needResetFilterForm = false,
    setNeedResetFilterForm = () => {},
    setIsFiltering = () => {},
    setApplied = () => {},
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

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

  useEffect(() => {
    fetchDataList();
  }, []);

  // clear values
  useEffect(() => {
    if (needResetFilterForm) {
      form.resetFields();
      setNeedResetFilterForm(false);
      setIsFiltering(false);
      setApplied(0);
    }
  }, [needResetFilterForm]);

  return (
    <Form
      form={form}
      layout="vertical"
      name="filter"
      onValuesChange={onValuesChange}
      className={styles.FilterResourcesContent}
    >
      <Form.Item label="By designation" name="title">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {titleList.map((x) => (
            <Option value={x._id}>{x.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="By billing status" name="statuses">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {billingStatusList.map((x) => (
            <Option value={x}>{x}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="By Start Date">
        <Row>
          <Col span={11}>
            <Form.Item name="startFromDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="startToDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label="By End Date">
        <Row style={{ width: '100%' }}>
          <Col span={11}>
            <Form.Item name="endFromDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="endToDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label="By Revised Date">
        <Row>
          <Col span={11}>
            <Form.Item name="revisedFromDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="revisedToDate">
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
