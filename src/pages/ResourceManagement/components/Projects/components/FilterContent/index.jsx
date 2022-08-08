import { Form, Select } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const { onSubmit = () => {}, dispatch, filter = {} } = props;
  // redux
  const {
    projectManagement: {
      projectTypeList = [],
      projectStatusList = [],
      divisionList = [],
      employeeList = [],
      projectNameList = [],
    } = {},
    resourceManagement: { customerList = [] } = {},
    loadingFetchEmployeeList = false,
  } = props;

  const removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };
  const customerNewList = removeDuplicate(customerList, (item) => item?.customerName);

  const onFinish = (values) => {
    const newValues = { ...values };
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
    onSubmit(result);
    dispatch({
      type: 'resourceManagement/save',
      payload: {
        filter: result,
      },
    });
  };

  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(allValues);
  };

  return (
    <>
      <div className={styles.FilterContent}>
        <Form form={form} layout="vertical" name="filterForm" onValuesChange={onValuesChange}>
          <Form.Item label="By Project ID" name="projectId">
            <Select
              allowClear
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select Project ID"
              showSearch
              showArrow
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {projectNameList.map((x) => {
                return <Select.Option value={x.projectId}>{x.projectId}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item label="By division" name="division">
            <Select
              allowClear
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select Division"
              showSearch
              showArrow
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {divisionList.map((x) => {
                return <Select.Option value={x.name}>{x.name}</Select.Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item label="By PROJECT NAME" name="projectName">
            <Select
              allowClear
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select Project Name"
              showSearch
              showArrow
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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

          <Form.Item label="By customer" name="customerName">
            <Select
              allowClear
              mode="multiple"
              showSearch
              showArrow
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{ width: '100%' }}
              placeholder="Select Customer"
            >
              {customerNewList.map((x) => {
                return <Select.Option value={x.customerName}>{x.customerName}</Select.Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item label="By engagement type" name="engagementType">
            <Select
              allowClear
              mode="multiple"
              showSearch
              showArrow
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{ width: '100%' }}
              placeholder="Select Engagement Type"
            >
              {projectTypeList.map((x) => (
                <Select.Option value={x.type_name}>{x.type_name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="By PROJECT manager" name="projectManager">
            <Select
              mode="multiple"
              allowClear
              showSearch
              showArrow
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{ width: '100%' }}
              loading={loadingFetchEmployeeList}
              placeholder="Select Project Manager"
            >
              {employeeList.map((x) => (
                <Select.Option value={x._id}>{x?.generalInfo?.legalName}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="By status" name="projectStatus">
            <Select
              allowClear
              mode="multiple"
              showSearch
              showArrow
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{ width: '100%' }}
              placeholder="Select Status"
            >
              {projectStatusList.map((x) => (
                <Select.Option value={x.status}>{x.status}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default connect(
  ({ projectManagement, resourceManagement, user: { currentUser: { employee = {} } = {} } }) => ({
    projectManagement,
    resourceManagement,
    employee,
  }),
)(FilterContent);
