/* eslint-disable react/jsx-curly-newline */
import { AutoComplete, Form, Input, Select, Spin } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import SearchIcon from '@/assets/directory/search.svg';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    timeSheet: {
      filterManagerReport = {},
      designationList = [],
      departmentList = [],
      employeeNameList = [],
    } = {},
    loadingFetchEmployeeNameList = false,
  } = props;

  const [employeeNameListState, setEmployeeNameListState] = useState([]);
  const [searchIcons, setSearchIcons] = useState({
    name: false,
  });

  useEffect(() => {
    setEmployeeNameListState(
      employeeNameList.map((x) => {
        return {
          value: x.generalInfo?.legalName,
          label: x.generalInfo.legalName,
        };
      }),
    );
  }, [JSON.stringify(employeeNameList)]);

  useEffect(() => {
    dispatch({
      type: 'timeSheet/fetchDesignationListEffect',
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'timeSheet/fetchDepartmentListEffect',
    });
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
      type: 'timeSheet/save',
      payload: { filterManagerReport: filterTemp },
    });
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(allValues);
  };

  // clear values
  useEffect(() => {
    if (isEmpty(filterManagerReport)) {
      form.resetFields();
    }
  }, [JSON.stringify(filterManagerReport)]);

  const onSearchEmployeeDebounce = debounce((type, value) => {
    let typeTemp = '';
    switch (type) {
      case 'name':
        typeTemp = 'timeSheet/fetchEmployeeNameListEffect';
        break;
      default:
        break;
    }
    if (typeTemp && value) {
      dispatch({
        type: typeTemp,
        payload: {
          name: value,
        },
      });
    }
    if (!value) {
      switch (type) {
        case 'name':
          setEmployeeNameListState([]);
          break;
        default:
          break;
      }
    }
  }, 1000);

  const handleEmployeeSearch = (type, value) => {
    onSearchEmployeeDebounce(type, value);
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
      <Form.Item label="By Employee" name="search">
        <AutoComplete
          dropdownMatchSelectWidth={252}
          notFoundContent={loadingFetchEmployeeNameList ? <Spin /> : 'No matches'}
          options={employeeNameListState}
          onSearch={(val) => handleEmployeeSearch('name', val)}
          onFocus={() => setSearchIcons({ ...searchIcons, name: true })}
          onBlur={() => setSearchIcons({ ...searchIcons, name: false })}
        >
          <Input
            placeholder="Search by Name/User ID"
            prefix={searchIcons.name ? <img src={SearchIcon} alt="search" /> : null}
            allowClear
          />
        </AutoComplete>
        {/* <Input placeholder="Search by Name/User ID" /> */}
      </Form.Item>

      <Form.Item label="by job title" name="title">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Designation"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow
        >
          {designationList.map((x) => {
            return (
              <Select.Option value={x._id} key={x._id}>
                {x.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By department id/name" name="department">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Department"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow
        >
          {departmentList.map((x) => {
            return (
              <Select.Option value={x._id} key={x.name}>
                {x.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default connect(({ loading, timeSheet }) => ({
  loadingFetchEmployeeNameList: loading.effects['timeSheet/fetchEmployeeNameListEffect'],
  timeSheet,
}))(FilterContent);
