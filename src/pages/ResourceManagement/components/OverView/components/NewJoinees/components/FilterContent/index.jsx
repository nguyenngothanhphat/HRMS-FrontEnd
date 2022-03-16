import { Form, Select, Row, Col, DatePicker } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    onFilter = () => {},
    resourceManagement: { newJoineeList = [], titleList = [] } = {},
  } = props;

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
    dispatch({
      type: 'resourceManagement/fetchTitleList',
    });
  }, []);

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

  return (
    <Form
      form={form}
      onValuesChange={onValuesChange}
      layout="vertical"
      name="filter"
      className={styles.FilterContent}
    >
      <Form.Item label="by candidate id" name="candidateId">
        <Select
          allowClear
          style={{ width: '100%' }}
          placeholder="Select the Candidate ID"
          showSearch
          showArrow
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {newJoineeList.map((item) => {
            return (
              <Select.Option value={item.ticketId} key={item._id}>
                {item.ticketId}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="by name" name="name">
        <Select
          allowClear
          style={{ width: '100%' }}
          showSearch
          showArrow
          placeholder="Select the name"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {newJoineeList.map((item) => {
            return (
              <Select.Option value={item.candidateFullName} key={item._id}>
                {item.candidateFullName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By job title" name="jobTitle">
        <Select
          allowClear
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select the Job Title"
          showSearch
          showArrow
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {titleList.map((item) => {
            return (
              <Select.Option value={item._id} key={item}>
                {item.name}
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

export default connect(({ resourceManagement, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  resourceManagement,
}))(FilterContent);
