import { Form, Select, Row, Col, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const FilterContent = (props) => {
  const {
    dispatch,
    employee: {
      filterList: {
        listDepartmentName = [],
        listCountry = [],
        listEmployeeType = [],
        listTitle = [],
      } = {},
      listSkill = [],
    } = {},
  } = props;

  const [locationList, setLocationList] = useState([]);

  // FUNCTIONALITY
  const formatLocationList = () => {
    const temp = listCountry.map((x, index) => {
      return {
        id: index,
        country: x.country?.name,
      };
    });
    setLocationList(temp);
  };

  // USE EFFECT
  useEffect(() => {
    formatLocationList();
  }, [JSON.stringify(listCountry)]);

  const onFinish = (values) => {
    const newValues = { ...values };

    // remove empty fields
    // eslint-disable-next-line no-return-assign
    const filter = Object.entries(newValues).reduce(
      // eslint-disable-next-line no-return-assign
      (a, [k, v]) =>
        v == null || v.length === 0 || !v
          ? a
          : // eslint-disable-next-line no-param-reassign
            ((a[k] = v), a),
      {},
    );

    dispatch({
      type: 'employee/save',
      payload: { filter },
    });
  };

  return (
    <Form layout="vertical" name="filter" onFinish={onFinish} className={styles.FilterContent}>
      <Form.Item label="by employee id" name="employeeId">
        <Select allowClear showSearch style={{ width: '100%' }} placeholder="Search by Employee ID">
          {[].map((x) => {
            return (
              <Select.Option value={x} key={x}>
                {x}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By name/user id" name="name">
        {/* <Select
          allowClear
          showSearch
          style={{ width: '100%' }}
          placeholder="Search by Name/User ID"
        >
          {[].map((x) => {
            return (
              <Select.Option value={x} key={x}>
                {x}
              </Select.Option>
            );
          })}
        </Select> */}
        <Input placeholder="Search by Name/User ID" />
      </Form.Item>

      <Form.Item label="By department id/name" name="department">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Department"
        >
          {listDepartmentName.map((x) => {
            return (
              <Select.Option value={x} key={x}>
                {x}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="By division name" name="division">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Division Name"
        >
          {[].map((x) => {
            return (
              <Select.Option value={x} key={x}>
                {x}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="by job title" name="title">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Job Title"
        >
          {listTitle.map((x) => {
            return (
              <Select.Option value={x._id} key={x._id}>
                {x.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="By reporting manager" name="reportingManager">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Reporting Manager"
        >
          {[].map((x) => {
            return (
              <Select.Option value={x} key={x}>
                {x}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By location" name="country">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Location"
        >
          {[].map((x) => {
            return (
              <Select.Option value={x} key={x}>
                {x}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By employment type" name="employeeType">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Employment Type"
        >
          {listEmployeeType.map((x) => {
            return (
              <Select.Option value={x._id} key={x}>
                {x.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By skills & certifications" name="skill">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Skills"
        >
          {listSkill.map((x) => {
            return (
              <Select.Option value={x._id} key={x._id}>
                {x.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By years of experience">
        <Row>
          <Col span={11}>
            <Form.Item name="from">
              <Input />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="to">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default connect(
  ({ loading, employee, locationSelection: { listLocationsByCompany = [] } = {} }) => ({
    loading: loading.effects['login/login'],
    employee,
    listLocationsByCompany,
  }),
)(FilterContent);
