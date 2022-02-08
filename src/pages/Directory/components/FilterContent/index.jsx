import { Form, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    employee: {
      employeeList2 = [],
      filterList: {
        listDepartmentName = [],
        listCountry = [],
        listEmployeeType = [],
        listTitle = [],
      } = {},
      listSkill = [],
      // selectedFilter
      filter: {
        name = '',
        department = [],
        division = [],
        country = [],
        title = [],
        reportingManager = [],
        employeeType = [],
        skill = [],
        fromExp,
        toExp,
      } = {},
      filter = {},
    } = {},
    loadingFetchEmployee = false,
  } = props;

  const [locationList, setLocationList] = useState([]);

  // FUNCTIONALITY
  const formatLocationList = () => {
    let temp = listCountry.map((x) => {
      return {
        id: x.country?._id,
        country: x.country?.name,
      };
    });
    // remove duplicate objects
    temp = temp.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
    setLocationList(temp);
  };

  // USE EFFECT
  useEffect(() => {
    formatLocationList();
  }, [JSON.stringify(listCountry)]);

  useEffect(() => {
    // this is needed for directly filtering when clicking on title or department on the table
    form.setFieldsValue({
      ...filter,
      name: name || undefined,
      department,
      division,
      title,
      country,
      reportingManager,
      employeeType,
      skill,
      fromExp,
      toExp,
    });
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    dispatch({
      type: 'employee/fetchSkillList',
    });
    dispatch({
      type: 'employee/fetchEmployeeType',
    });

    dispatch({
      type: 'employee/fetchEmployeeListSingleCompanyEffect',
    });

    return () => {
      dispatch({
        type: 'employee/clearFilter',
      });
    };
  }, []);

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

  const onSearchEmployeeDebounce = debounce((value) => {
    dispatch({
      type: 'employee/fetchEmployeeListSingleCompanyEffect',
      payload: {
        name: value,
      },
    });
  }, 1000);

  const handleEmployeeSearch = (value) => {
    onSearchEmployeeDebounce(value);
  };

  const handleEmployeeClear = () => {
    setTimeout(() => {
      onSearchEmployeeDebounce('');
    }, 100);
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
      <Form.Item label="by employee id" name="employeeId">
        <Select
          allowClear
          showSearch
          showArrow
          style={{ width: '100%' }}
          loading={loadingFetchEmployee}
          placeholder="Search by Employee ID"
        >
          {employeeList2.map((x) => {
            return (
              <Select.Option value={x.generalInfo?.employeeId} key={x.generalInfo?.employeeId}>
                {x.generalInfo?.employeeId}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By name/user id" name="name">
        <Select
          allowClear
          showSearch
          style={{ width: '100%' }}
          placeholder="Search by Name/User ID"
          filterOption={false}
          showArrow
          onSearch={handleEmployeeSearch}
          loading={loadingFetchEmployee}
          onClear={handleEmployeeClear}
        >
          {employeeList2.map((x) => {
            return (
              <Select.Option value={x.generalInfo?.legalName} key={x._id}>
                {x.generalInfo.legalName}
              </Select.Option>
            );
          })}
        </Select>
        {/* <Input placeholder="Search by Name/User ID" /> */}
      </Form.Item>

      <Form.Item label="By department id/name" name="department">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Department"
          showArrow
        >
          {listDepartmentName.map((x) => {
            return (
              <Select.Option value={x} key={x}>
                {x}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="By division name" name="division">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Division Name"
          showArrow
        >
          {listDepartmentName.map((x) => {
            return (
              <Select.Option value={x} key={x}>
                {x}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="by job title" name="title">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Job Title"
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
      <Form.Item label="By reporting manager" name="reportingManager">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Reporting Manager"
          showArrow
        >
          {employeeList2.map((x) => {
            return (
              <Select.Option value={x._id} key={x._id}>
                {x.generalInfo?.legalName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By location" name="country">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Location"
          showArrow
        >
          {locationList.map((x) => {
            return (
              <Select.Option value={x.id} key={x.id}>
                {x.country}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By employment type" name="employeeType">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Employment Type"
          showArrow
        >
          {listEmployeeType
            .filter((x) => x.name !== 'Other')
            .map((x) => {
              return (
                <Select.Option value={x._id} key={x}>
                  {x.name}
                </Select.Option>
              );
            })}
        </Select>
      </Form.Item>

      <Form.Item label="By skills & certifications" name="skill">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Skills"
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

      {/* temporarily hide this one - need backend fixes */}
      {/* 
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
      </Form.Item>  */}
    </Form>
  );
};

export default connect(
  ({ loading, employee, locationSelection: { listLocationsByCompany = [] } = {} }) => ({
    loadingFetchEmployee: loading.effects['employee/fetchEmployeeListSingleCompanyEffect'],
    employee,
    listLocationsByCompany,
  }),
)(FilterContent);
