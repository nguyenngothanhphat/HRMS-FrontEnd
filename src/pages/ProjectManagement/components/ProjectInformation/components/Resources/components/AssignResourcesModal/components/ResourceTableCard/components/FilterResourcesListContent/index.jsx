import { Form, Input, Select } from 'antd';
import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const FilterResourcesListContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    projectDetails: { divisionList = [], projectId = '' } = {},
    projectManagement: { projectList = [] },
    onFilter = () => {},
    needResetFilterForm = false,
    setNeedResetFilterForm = () => {},
    setIsFiltering = () => {},
    setApplied = () => {},
  } = props;

  const fetchDataList = () => {
    dispatch({
      type: 'projectDetails/fetchTitleListEffect',
    });
    dispatch({
      type: 'projectDetails/fetchDivisionListEffect',
    });
    dispatch({
      type: 'projectDetails/fetchBillingStatusListEffect',
    });
    dispatch({
      type: 'projectManagement/fetchProjectListEffect',
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
      className={styles.FilterResourcesListContent}
    >
      <Form.Item label="By division" name="division">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {divisionList.map((x) => (
            <Option value={x.name}>{x.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="By Experience"
        name="expYearBegin"
        style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '8px' }}
        rules={[
          {
            pattern: /^[0-9]*$/,
            message: 'Exp is invalid',
          },
        ]}
      >
        <Input placeholder="Years of Exp" />
      </Form.Item>
      <Form.Item
        label="To"
        name="expYearEnd"
        style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '8px' }}
        rules={[
          {
            pattern: /^[0-9]*$/,
            message: 'Exp is invalid',
          },
        ]}
      >
        <Input placeholder="Years of Exp" />
      </Form.Item>

      <Form.Item label="By Project" name="project">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {projectList
            .filter((i) => i.projectId !== projectId)
            .map((x) => (
              <Option value={x.id}>{x.projectName}</Option>
            ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default connect(
  ({ projectDetails, user: { currentUser: { employee = {} } = {} }, projectManagement }) => ({
    employee,
    projectDetails,
    projectManagement,
  }),
)(FilterResourcesListContent);
