/* eslint-disable react/jsx-curly-newline */
import { Form, Select, AutoComplete, Input, Spin } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import SearchIcon from '@/assets/directory/search.svg';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    timeSheet: { departmentList = [], projectList = [], employeeNameList = [] } = {},
    loadingFetchEmployeeNameList = false,
    loadingFetchDepartmentList = false,
    loadingFetchProjectList = false,
  } = props;

  const [employeeNameListState, setEmployeeNameListState] = useState([]);
  const [searchIcons, setSearchIcons] = useState({
    name: false,
  });

  useEffect(() => {
    dispatch({
      type: 'timeSheet/fetchDepartmentListEffect',
    });
    dispatch({
      type: 'timeSheet/fetchProjectListEffect',
    });
  }, []);

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
      payload: { filterHrView: filterTemp },
    });
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

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
          loading={loadingFetchDepartmentList}
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

      <Form.Item label="By Project" name="project">
        <Select
          allowClear
          showSearch
          mode="multiple"
          loading={loadingFetchProjectList}
          style={{ width: '100%' }}
          placeholder="Search by Project"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow
        >
          {projectList.map((x) => {
            return (
              <Select.Option value={x.id} key={x.id}>
                {x.projectName}
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
  loadingFetchDepartmentList: loading.effects['timeSheet/fetchDepartmentListEffect'],
  loadingFetchProjectList: loading.effects['timeSheet/fetchProjectListEffect'],
  timeSheet,
}))(FilterContent);
