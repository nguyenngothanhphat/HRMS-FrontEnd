import { Form, Input, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    usersManagement: {
      filterList: { listCountry = [] } = {},
      filter: { employeeId = '', name = '', roles = [], countries = [], locations = [] } = {},
      filter = {},
      roleList = [],
    } = {},
    companyLocationList = [],
    handleFilterCounts = () => {},
  } = props;

  const [countryListState, setCountryListState] = useState([]);

  // FUNCTIONALITY
  const formatCountryList = () => {
    let temp = listCountry.map((x) => {
      return {
        id: x.country?._id,
        country: x.country?.name,
      };
    });
    // remove duplicate objects
    temp = temp.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
    setCountryListState(temp);
  };

  // USE EFFECT
  useEffect(() => {
    formatCountryList();
  }, [JSON.stringify(listCountry)]);

  useEffect(() => {
    // this is needed for directly filtering when clicking on title or department on the table
    form.setFieldsValue({
      ...filter,
      employeeId,
      name,
      locations,
      countries,
      roles,
    });
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'usersManagement/clearFilter',
      });
    };
  }, []);

  // FUNCTIONALITY
  const onFinish = (values) => {
    const newValues = { ...values };

    // remove empty fields
    // eslint-disable-next-line no-return-assign
    const filterTemp = Object.entries(newValues).reduce(
      // eslint-disable-next-line no-return-assign
      (a, [k, v]) =>
        v == null || v.length === 0 || !v
          ? a
          : // eslint-disable-next-line no-param-reassign
            ((a[k] = v), a),
      {},
    );

    // dispatch action
    dispatch({
      type: 'usersManagement/save',
      payload: { filter: filterTemp },
    });
  };

  const onFinishDebounce = debounce((values) => {
    handleFilterCounts(values);
    onFinish(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

  return (
    <Form
      layout="vertical"
      name="filter"
      // onFinish={onFinish}
      onValuesChange={onValuesChange}
      form={form}
      className={styles.FilterContent}
    >
      <Form.Item label="By name/user id" name="name">
        <Input placeholder="Search by Name/User ID..." />
      </Form.Item>
      <Form.Item label="By roles" name="roles">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Roles"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          showArrow
        >
          {roleList.map((x) => {
            return (
              <Select.Option value={x.idSync} key={x.idSync}>
                {x.idSync}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="By location" name="locations">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Location"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          showArrow
        >
          {companyLocationList.map((x) => {
            return (
              <Select.Option value={x._id} key={x._id}>
                {x.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By country" name="countries">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Country"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          showArrow
        >
          {countryListState.map((x) => {
            return (
              <Select.Option value={x.id} key={x.id}>
                {x.country}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default connect(({ usersManagement, location: { companyLocationList = [] } = {} }) => ({
  usersManagement,
  companyLocationList,
}))(FilterContent);
