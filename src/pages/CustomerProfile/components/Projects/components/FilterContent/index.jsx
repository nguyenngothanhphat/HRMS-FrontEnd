import { Form, Select, Row, Col, DatePicker } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const FilterContent = (props) => {
  const {
    dispatch,
    customerProfile: {
      projectTypeList = [],
      projectStatusList = [],
      divisionList = [],
      employeeList = [],
      projectNameList = [],
    } = {},
    onFilter = () => {},
  } = props;

  const fetchDocumentTypeList = () => {
    dispatch({
      type: 'customerProfile/fetchCustomerListEffect',
    });
    dispatch({
      type: 'customerProfile/fetchProjectNameListEffect',
    });
    dispatch({
      type: 'customerProfile/fetchProjectTypeListEffect',
    });
    dispatch({
      type: 'customerProfile/fetchProjectStatusListEffect',
    });
    dispatch({
      type: 'customerProfile/fetchDivisionListEffect',
      payload: {
        name: 'Engineering',
      },
    });
    dispatch({
      type: 'customerProfile/fetchEmployeeListEffect',
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
    fetchDocumentTypeList();
  }, []);

  return (
    <Form layout="vertical" name="filter" onFinish={onFinish} className={styles.FilterContent}>
      <Form.Item label="By PROJECT NAME" name="projectName">
        <Select
          allowClear
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select Project Name"
        >
          {projectNameList.map((item) => {
            return (
              <Select.Option value={item.projectName} key={item}>
                {item.projectName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By division" name="division">
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Select Division">
          {divisionList.map((x) => {
            return <Select.Option value={x}>{x}</Select.Option>;
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By engagement type" name="engagementType">
        <Select
          allowClear
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select Engagement Type"
        >
          {projectTypeList.map((x) => (
            <Select.Option value={x.id}>{x.type_name}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="By PROJECT manager" name="projectManager">
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          // loading={loadingFetchEmployeeList}
          placeholder="Select Project Manager"
        >
          {employeeList.map((x) => (
            <Select.Option value={x._id}>{x?.generalInfo?.legalName}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="By status" name="projectStatus">
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Select Status">
          {projectStatusList.map((x) => (
            <Select.Option value={x.id}>{x.status}</Select.Option>
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

      <Form.Item label="By end date">
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

export default connect(({ customerProfile, user: { currentUser: { employee = {} } = {} } }) => ({
  customerProfile,
  employee,
}))(FilterContent);
