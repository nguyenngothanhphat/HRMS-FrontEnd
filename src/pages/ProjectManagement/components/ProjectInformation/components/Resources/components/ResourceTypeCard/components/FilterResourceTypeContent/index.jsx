import { Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const FilterResourceTypeContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    projectDetails: { divisionList = [], titleList = [], billingStatusList = [] } = {},
    onFilter = () => {},
    needResetFilterForm = false,
    setNeedResetFilterForm = () => {},
    setApplied = () => {},
    setIsFiltering = () => {},
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

  // clear values
  useEffect(() => {
    if (needResetFilterForm) {
      form.resetFields();
      setNeedResetFilterForm(false);
      setIsFiltering(false);
      setApplied(0);
    }
  }, [needResetFilterForm]);

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      name="filter"
      onValuesChange={onValuesChange}
      className={styles.FilterResourceTypeContent}
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

      <Form.Item label="By resource type" name="resourceType">
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

      <Form.Item label="By billing status" name="billingStatus">
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
    </Form>
  );
};

export default connect(({ projectDetails, user: { currentUser: { employee = {} } = {} } }) => ({
  projectDetails,
  employee,
}))(FilterResourceTypeContent);
