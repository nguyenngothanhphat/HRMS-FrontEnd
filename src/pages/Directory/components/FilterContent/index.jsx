import { Form, Select, AutoComplete, Input, Spin } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    employee: {
      employeeIDList = [],
      employeeNameList = [],
      managerList = [],
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
    loadingFetchEmployeeIDList = false,
    loadingFetchEmployeeNameList = false,
    loadingFetchManagerList = false,
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

  const onSearchEmployeeDebounce = debounce((type, value) => {
    let typeTemp = '';
    switch (type) {
      case 'id':
        typeTemp = 'employee/fetchEmployeeIDListEffect';
        break;
      case 'name':
        typeTemp = 'employee/fetchEmployeeNameListEffect';
        break;
      case 'manager':
        typeTemp = 'employee/fetchManagerListEffect';
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
      <Form.Item label="by employee id" name="employeeId">
        {/* <Select
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
        </Select> */}
        <AutoComplete
          dropdownMatchSelectWidth={252}
          notFoundContent={loadingFetchEmployeeIDList ? <Spin /> : 'No matches'}
          options={employeeIDList.map((x) => {
            return {
              value: x.generalInfo?.employeeId,
              label: x.generalInfo.employeeId,
            };
          })}
          onSearch={(val) => handleEmployeeSearch('id', val)}
        >
          <Input placeholder="Search by Employee ID" />
        </AutoComplete>
      </Form.Item>

      <Form.Item label="By name/user id" name="name">
        <AutoComplete
          dropdownMatchSelectWidth={252}
          notFoundContent={loadingFetchEmployeeNameList ? <Spin /> : 'No matches'}
          options={employeeNameList.map((x) => {
            return {
              value: x.generalInfo?.legalName,
              label: x.generalInfo.legalName,
            };
          })}
          onSearch={(val) => handleEmployeeSearch('name', val)}
        >
          <Input placeholder="Search by Name/User ID" />
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
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
      <Form.Item label="By reporting manager" name="reportingManager">
        {/* <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Reporting Manager"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          showArrow
        >
          {managerList.map((x) => {
            return (
              <Select.Option value={x._id} key={x._id}>
                {x.generalInfo?.legalName}
              </Select.Option>
            );
          })}
        </Select> */}
        <AutoComplete
          dropdownMatchSelectWidth={252}
          notFoundContent={loadingFetchManagerList ? <Spin /> : 'No matches'}
          options={managerList.map((x) => {
            return {
              value: x.generalInfo?.legalName,
              label: x.generalInfo.legalName,
            };
          })}
          onSearch={(val) => handleEmployeeSearch('manager', val)}
        >
          <Input placeholder="Search by Reporting Manager" />
        </AutoComplete>
      </Form.Item>

      <Form.Item label="By country" name="country">
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
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
    loadingFetchEmployeeIDList: loading.effects['employee/fetchEmployeeIDListEffect'],
    loadingFetchEmployeeNameList: loading.effects['employee/fetchEmployeeNameListEffect'],
    loadingFetchManagerList: loading.effects['employee/fetchManagerListEffect'],
    employee,
    listLocationsByCompany,
  }),
)(FilterContent);
