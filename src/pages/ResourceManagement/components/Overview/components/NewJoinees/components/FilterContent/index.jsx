import { Col, DatePicker, Form, Row, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { DATE_FORMAT_STR } from '@/constants/dateFormat';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    onFilter = () => {},
    resourceManagement: { newJoineeList = [], titleList = [] } = {},
    setApplied = () => {},
    setForm = () => {},
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
    setForm(form);
  }, []);
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
    const filteredObj = Object.entries(values).filter(
      ([, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
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
          {titleList
            .filter((v, i, a) => a.findIndex((v2) => v2.name === v.name) === i)
            .map((item) => {
              return (
                <Select.Option value={item.name} key={item}>
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
              <DatePicker format={DATE_FORMAT_STR} />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="toDate">
              <DatePicker format={DATE_FORMAT_STR} />
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
