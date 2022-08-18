import { Form, Input, Select } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import DebounceSelect from '@/components/DebounceSelect';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const { onFilter = () => {}, dispatch, filter = {} } = props;

  // redux
  const {
    projectManagement: {
      customerList = [],
      projectTypeList = [],
      projectStatusList = [],
      divisionList = [],
      projectNameList = [],
    } = {},
  } = props;

  // clear values
  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

  const onEmployeeSearch = (val) => {
    if (!val) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return dispatch({
      type: 'projectManagement/fetchEmployeeListEffect',
      payload: {
        name: val,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfoInfo?.legalName,
        value: user._id,
      }));
    });
  };

  useEffect(() => {
    dispatch({
      type: 'projectManagement/fetchCustomerListEffect',
    });
    dispatch({
      type: 'projectManagement/fetchProjectNameListEffect',
    });
    dispatch({
      type: 'projectManagement/fetchProjectTypeListEffect',
    });
    dispatch({
      type: 'projectManagement/fetchProjectStatusListEffect',
    });
    dispatch({
      type: 'projectManagement/fetchDivisionListEffect',
      payload: {
        name: 'Engineering',
      },
    });
  }, []);

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
    dispatch({
      type: 'projectManagement/save',
      payload: { filter: result },
    });
    onFilter(result);
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(allValues);
  };

  return (
    <div className={styles.FilterContent}>
      <Form form={form} layout="vertical" name="filter" onValuesChange={onValuesChange}>
        <Form.Item label="By Project ID" name="projectId">
          <Input placeholder="Project ID" />
        </Form.Item>
        <Form.Item label="By division" name="division">
          <Select
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Division"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {divisionList.map((x) => (
              <Select.Option value={x.name} key={x}>
                {x.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="By PROJECT NAME" name="projectName">
          <Select
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Project Name"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {projectNameList.map((item) => {
              return (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item label="By customer" name="customerId">
          <Select
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Customer"
            filterOption={(input, option) => {
              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          >
            {customerList.map((x) => {
              return (
                <Select.Option value={x.customerId} key={x.customerId}>
                  {x.legalName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item label="By engagement type" name="engagementType">
          <Select
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Engagement Type"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {projectTypeList.map((x) => {
              return (
                <Select.Option value={x.id} key={x.id}>
                  {x.type_name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item label="By PROJECT manager" name="projectManager">
          <DebounceSelect
            mode="multiple"
            allowClear
            showArrow
            placeholder="Select Project Manager"
            fetchOptions={onEmployeeSearch}
            showSearch
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="By status" name="projectStatus">
          <Select
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Status"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {projectStatusList.map((x) => (
              <Select.Option value={x.id} key={x.id}>
                {x.status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ projectManagement, user: { currentUser: { employee = {} } = {} } }) => ({
  projectManagement,
  employee,
}))(FilterContent);
