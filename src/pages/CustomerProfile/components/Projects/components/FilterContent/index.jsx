import { Col, DatePicker, Form, Row, Select } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import DebounceSelect from '@/components/DebounceSelect';
import styles from './index.less';
import { DATE_FORMAT_STR } from '@/constants/dateFormat';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    customerProfile: {
      projectTypeList = [],
      projectStatusList = [],
      divisionList = [],
      projectNameList = [],
    } = {},
    filter = {},
    onFilter = () => {},
  } = props;

  const onEmployeeSearch = (value) => {
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    return dispatch({
      type: 'customerManagement/fetchEmployeeList',
      payload: {
        name: value,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfo?.legalName,
        value: user._id,
      }));
    });
  };

  const onValuesChange = (changedValues, allValues) => {
    const newValues = { ...allValues };

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

  const disableFromDate = (value, compareVar) => {
    const t = form.getFieldValue(compareVar);
    if (!t) return false;
    return value > moment(t);
  };

  const disableToDate = (value, compareVar) => {
    const t = form.getFieldValue(compareVar);
    if (!t) return false;
    return value < moment(t);
  };

  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

  return (
    <Form
      layout="vertical"
      name="filter"
      onValuesChange={onValuesChange}
      className={styles.FilterContent}
      form={form}
    >
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
            return <Select.Option value={x.name}>{x.name}</Select.Option>;
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
        <DebounceSelect
          placeholder="Select Project Manager"
          fetchOptions={onEmployeeSearch}
          showSearch
          allowClear
          mode="multiple"
        />
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
              <DatePicker
                format={DATE_FORMAT_STR}
                disabledDate={(val) => disableFromDate(val, 's_toDate')}
              />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="s_toDate">
              <DatePicker
                format={DATE_FORMAT_STR}
                disabledDate={(val) => disableToDate(val, 's_fromDate')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label="By end date">
        <Row>
          <Col span={11}>
            <Form.Item name="e_fromDate">
              <DatePicker
                format={DATE_FORMAT_STR}
                disabledDate={(val) => disableFromDate(val, 'e_toDate')}
              />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="e_toDate">
              <DatePicker
                format={DATE_FORMAT_STR}
                disabledDate={(val) => disableToDate(val, 'e_fromDate')}
              />
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
