import { Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const FilterResourceTypeContent = (props) => {
  const {
    dispatch,
    projectDetails: { divisionList = [], titleList = [], billingStatusList = [] } = {},
    onFilter = () => {},
  } = props;

  const fetchDataList = () => {
    dispatch({
      type: 'projectDetails/fetchTitleListEffect',
    });
    dispatch({
      type: 'projectDetails/fetchDivisionListEffect',
      payload: {
        name: 'Engineering',
      },
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


  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <Form
      layout="vertical"
      name="filter"
      onFinish={onFinish}
      className={styles.FilterResourceTypeContent}
    >
      <Form.Item label="By division" name="division">
        <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
          {divisionList.map((x) => (
            <Option value={x}>{x}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="By resource type" name="resourceType">
        <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
          {titleList.map((x) => (
            <Option value={x._id}>{x.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="By billing status" name="billingStatus">
        <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
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
