import { Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const FilterResourcesListContent = (props) => {
  const {
    dispatch,
    projectDetails: { divisionList = [], titleList = [] } = {},
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

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <Form
      layout="vertical"
      name="filter"
      onFinish={onFilter}
      className={styles.FilterResourcesListContent}
    >
      <Form.Item label="By division" name="division">
        <Select allowClear style={{ width: '100%' }} placeholder="Please select">
          {divisionList.map((x) => (
            <Option value={x}>{x}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="By designation" name="designation">
        <Select allowClear style={{ width: '100%' }} placeholder="Please select">
          {titleList.map((x) => (
            <Option value={x._id}>{x.name}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default connect(({ projectDetails, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  projectDetails,
}))(FilterResourcesListContent);
