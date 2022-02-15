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
        location = [],
        title = [],
        reportingManager = [],
        employeeType = [],
        skill = [],
        fromExp,
        toExp,

        // search values
        searchDivision = [],
        searchDepartment = [],
        searchCountry = [],
        searchLocation = [],
        searchTitle = [],
        searchSkill = [],
        searchEmployeeType = [],
      } = {},
      filter = {},
    } = {},
    listLocationsByCompany = [],
    loadingFetchEmployeeIDList = false,
    loadingFetchEmployeeNameList = false,
    loadingFetchManagerList = false,
  } = props;

  const [countryListState, setCountryListState] = useState([]);
  const [employeeIDListState, setEmployeeIDListState] = useState([]);
  const [employeeNameListState, setEmployeeNameListState] = useState([]);
  const [managerListState, setManagerListState] = useState([]);
  const [searchIcons, setSearchIcons] = useState({
    id: false,
    name: false,
    manager: false,
  });

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
      name: name || undefined,
      department: [...department, ...searchDepartment],
      division: [...division, ...searchDivision],
      title: [...title, ...searchTitle],
      location: [...location, ...searchLocation],
      country: [...country, ...searchCountry],
      reportingManager,
      employeeType: [...employeeType, ...searchEmployeeType],
      skill: [...skill, ...searchSkill],
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

  useEffect(() => {
    setEmployeeIDListState(
      employeeIDList.map((x) => {
        return {
          value: x.generalInfo?.employeeId,
          label: x.generalInfo.employeeId,
        };
      }),
    );
  }, [JSON.stringify(employeeIDList)]);

  useEffect(() => {
    setManagerListState(
      managerList.map((x) => {
        return {
          value: x.generalInfo?.legalName,
          label: x.generalInfo.legalName,
        };
      }),
    );
  }, [JSON.stringify(managerList)]);

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

  const splitArray = (array, originalList) => {
    const searchValues = [];
    const filterValues = [];
    array.forEach((item) => {
      if (
        originalList.some((x) => x.name === item || x === item || x._id === item || x.id === item)
      ) {
        filterValues.push(item);
      } else {
        searchValues.push(item);
      }
    });
    return {
      searchValues,
      filterValues,
    };
  };

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

    // convert fields to filter array & search array
    const splitArrayValues = {};
    Object.entries(newValues).forEach((x) => {
      if (x[1] instanceof Array) {
        switch (x[0]) {
          case 'division': {
            const { searchValues, filterValues } = splitArray(x[1], listDepartmentName);
            if (searchValues.length > 0) {
              splitArrayValues.searchDivision = [...searchValues];
            }
            if (filterValues.length > 0) {
              splitArrayValues.division = [...filterValues];
            }
            break;
          }

          case 'country': {
            const { searchValues, filterValues } = splitArray(x[1], countryListState);
            if (searchValues.length > 0) {
              splitArrayValues.searchCountry = [...searchValues];
            }
            if (filterValues.length > 0) {
              splitArrayValues.country = [...filterValues];
            }
            break;
          }

          case 'location': {
            const { searchValues, filterValues } = splitArray(x[1], listLocationsByCompany);
            if (searchValues.length > 0) {
              splitArrayValues.searchLocation = [...searchValues];
            }
            if (filterValues.length > 0) {
              splitArrayValues.location = [...filterValues];
            }
            break;
          }
          case 'title': {
            const { searchValues, filterValues } = splitArray(x[1], listTitle);
            if (searchValues.length > 0) {
              splitArrayValues.searchTitle = [...searchValues];
            }
            if (filterValues.length > 0) {
              splitArrayValues.title = [...filterValues];
            }
            break;
          }

          case 'department': {
            const { searchValues, filterValues } = splitArray(x[1], listDepartmentName);
            if (searchValues.length > 0) {
              splitArrayValues.searchDepartment = [...searchValues];
            }
            if (filterValues.length > 0) {
              splitArrayValues.department = [...filterValues];
            }
            break;
          }

          case 'employeeType': {
            const { searchValues, filterValues } = splitArray(x[1], listEmployeeType);
            if (searchValues.length > 0) {
              splitArrayValues.searchEmployeeType = [...searchValues];
            }
            if (filterValues.length > 0) {
              splitArrayValues.employeeType = [...filterValues];
            }
            break;
          }

          case 'skill': {
            const { searchValues, filterValues } = splitArray(x[1], listSkill);
            if (searchValues.length > 0) {
              splitArrayValues.searchSkill = [...searchValues];
            }
            if (filterValues.length > 0) {
              splitArrayValues.skill = [...filterValues];
            }
            break;
          }
          default:
            break;
        }
      }
    });

    // dispatch action
    dispatch({
      type: 'employee/save',
      payload: { filter: { ...filterTemp, ...splitArrayValues } },
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
    if (!value) {
      switch (type) {
        case 'id':
          setEmployeeIDListState([]);
          break;
        case 'name':
          setEmployeeNameListState([]);
          break;
        case 'manager':
          setManagerListState([]);
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
      <Form.Item label="by employee id" name="employeeId">
        <AutoComplete
          dropdownMatchSelectWidth={252}
          notFoundContent={loadingFetchEmployeeIDList ? <Spin /> : 'No matches'}
          options={employeeIDListState}
          onSearch={(val) => handleEmployeeSearch('id', val)}
          onFocus={() => setSearchIcons({ ...searchIcons, id: true })}
          onBlur={() => setSearchIcons({ ...searchIcons, id: false })}
        >
          <Input
            placeholder="Search by Employee ID"
            prefix={searchIcons.id ? <img src={SearchIcon} alt="search" /> : null}
            allowClear
          />
        </AutoComplete>
      </Form.Item>

      <Form.Item label="By name/user id" name="name">
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
          mode="tags"
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
          mode="tags"
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
          mode="tags"
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
        <AutoComplete
          dropdownMatchSelectWidth={252}
          notFoundContent={loadingFetchManagerList ? <Spin /> : 'No matches'}
          options={managerListState}
          onSearch={(val) => handleEmployeeSearch('manager', val)}
          onFocus={() => setSearchIcons({ ...searchIcons, manager: true })}
          onBlur={() => setSearchIcons({ ...searchIcons, manager: false })}
        >
          <Input
            placeholder="Search by Reporting Manager"
            prefix={searchIcons.manager ? <img src={SearchIcon} alt="search" /> : null}
            allowClear
          />
        </AutoComplete>
      </Form.Item>

      <Form.Item label="By location" name="location">
        <Select
          allowClear
          showSearch
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Search by Location"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          showArrow
        >
          {listLocationsByCompany.map((x) => {
            return (
              <Select.Option value={x._id} key={x._id}>
                {x.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By country" name="country">
        <Select
          allowClear
          showSearch
          mode="tags"
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

      <Form.Item label="By employment type" name="employeeType">
        <Select
          allowClear
          showSearch
          mode="tags"
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
          mode="tags"
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
