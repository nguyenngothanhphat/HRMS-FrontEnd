import { Col, Form, InputNumber, Row, Select } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DebounceSelect from '@/components/DebounceSelect';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    employee: {
      departmentList = [],
      divisionList = [],
      filterList: { listCountry = [], listEmployeeType = [], listTitle = [] } = {},
      listSkill = [],
      // selectedFilter
      filter: {
        ids = [],
        departments = [],
        divisions = [],
        countries = [],
        locations = [],
        titles = [],
        reportingManager,
        employeeTypes = [],
        empTypeOthers = [],
        skills = [],
        fromExp,
        toExp,
      } = {},
      filter = {},
    } = {},
    activeTab = '',
    companyLocationList = [],
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
    if (isEmpty(filter)) {
      form.resetFields();
    }
    // this is needed for directly filtering when clicking on title or department on the table
    form.setFieldsValue({
      ...filter,
      ids,
      departments,
      divisions,
      titles,
      locations,
      countries,
      reportingManager,
      employeeTypes,
      empTypeOthers,
      skills,
      fromExp,
      toExp,
    });
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    dispatch({
      type: 'employee/fetchSkillList',
    });
    dispatch({
      type: 'employee/fetchDepartmentList',
      params: {
        type: 'DEPARTMENT',
      },
    });
    dispatch({
      type: 'employee/fetchDepartmentList',
      params: {
        type: 'DIVISION',
      },
    });
    return () => {
      dispatch({
        type: 'employee/clearFilter',
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
      type: 'employee/save',
      payload: { filter: filterTemp },
    });
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

  const onEmployeeSearch = (value, getAll = false) => {
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    return dispatch({
      type: 'globalData/fetchEmployeeListEffect',
      payload: {
        name: value,
        status:
          (getAll && ['ACTIVE', 'INACTIVE']) ||
          (activeTab === 'inActive' ? ['INACTIVE'] : ['ACTIVE']),
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: `${user.generalInfo?.employeeId} - ${user.generalInfo?.legalName}`,
        value: user._id,
      }));
    });
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
      <Form.Item label="by employee id / user id / name..." name="ids">
        <DebounceSelect
          placeholder="Search by Employee ID / User ID / Name..."
          fetchOptions={onEmployeeSearch}
          showSearch
          allowClear
        />
      </Form.Item>

      {activeTab !== 'myTeam' && (
        <>
          <Form.Item label="By department id / name" name="departments">
            <Select
              allowClear
              showSearch
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Search by Department"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              showArrow
            >
              {departmentList.map((x) => {
                return (
                  <Select.Option value={x._id} key={x._id}>
                    {x.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="By division name" name="divisions">
            <Select
              allowClear
              showSearch
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Search by Division Name"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              showArrow
            >
              {divisionList.map((x) => {
                return (
                  <Select.Option value={x._id} key={x._id}>
                    {x.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </>
      )}

      <Form.Item label="by job title" name="titles">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Job Title"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          showArrow
        >
          {listTitle.map((x) => {
            return (
              <Select.Option value={x._id} key={x._id}>
                {x.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      {activeTab !== 'myTeam' && (
        <>
          <Form.Item label="By reporting manager" name="managers">
            <DebounceSelect
              placeholder="Search by Reporting Manager"
              fetchOptions={(val) => onEmployeeSearch(val, true)}
              showSearch
              allowClear
            />
          </Form.Item>
        </>
      )}

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
      {activeTab !== 'myTeam' && (
        <>
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
          <Form.Item label="By employee type" name="empTypeOther">
            <Select
              allowClear
              showSearch
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Search by Employee Type"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              showArrow
            >
              {['Regular', 'Contingent Worker'].map((x, index) => {
                return (
                  <Select.Option key={`${index + 1}`} value={x}>
                    {x}
                  </Select.Option>
                );
              })}
              ]
            </Select>
          </Form.Item>

          <Form.Item label="By employment type" name="employeeTypes">
            <Select
              allowClear
              showSearch
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Search by Employment Type"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              showArrow
            >
              {listEmployeeType
                .filter((x) => x.name !== 'Other')
                .map((x) => {
                  return (
                    <Select.Option value={x._id} key={x._id}>
                      {x.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item label="By skills & certifications" name="skills">
            <Select
              allowClear
              showSearch
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Search by Skills"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              showArrow
            >
              {listSkill.map((x) => {
                return (
                  <Select.Option value={x._id} key={x._id}>
                    {x.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="By yrs of experience">
            <Row>
              <Col span={11}>
                <Form.Item name="fromExp">
                  <InputNumber min={0} max={100} placeholder="From" />
                </Form.Item>
              </Col>
              <Col span={2} className={styles.separator}>
                <span>to</span>
              </Col>
              <Col span={11}>
                <Form.Item name="toExp">
                  <InputNumber min={0} max={100} placeholder="To" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default connect(({ loading, employee, location: { companyLocationList = [] } = {} }) => ({
  loadingFetchEmployeeIDList: loading.effects['employee/fetchEmployeeIDListEffect'],
  loadingFetchEmployeeNameList: loading.effects['employee/fetchEmployeeNameListEffect'],
  employee,
  companyLocationList,
}))(FilterContent);
