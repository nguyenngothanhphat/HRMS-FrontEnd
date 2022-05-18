import { Form, Select, AutoComplete, Input, Spin, InputNumber, Row, Col } from 'antd';
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
        employeeId = '',
        name = '',
        department = [],
        division = [],
        countries = [],
        locations = [],
        title = [],
        reportingManager = [],
        employeeType = [],
        skill = [],
        fromExp,
        toExp,
      } = {},
      filter = {},
    } = {},
    activeTab = '',
    companyLocationList = [],
    loadingFetchEmployeeIDList = false,
    loadingFetchEmployeeNameList = false,
    loadingFetchManagerList = false,
    handleFilterCounts = () => {},
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
      employeeId,
      name,
      department,
      division,
      title,
      locations,
      countries,
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
    handleFilterCounts(values);
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
        case 'id': {
          dispatch({
            type: 'employee/save',
            payload: {
              employeeIDList: [],
            },
          });
          setEmployeeIDListState([]);
          break;
        }
        case 'name': {
          dispatch({
            type: 'employee/save',
            payload: {
              employeeNameList: [],
            },
          });
          setEmployeeNameListState([]);
          break;
        }
        case 'manager': {
          dispatch({
            type: 'employee/save',
            payload: {
              managerList: [],
            },
          });
          setManagerListState([]);
          break;
        }

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
          notFoundContent={loadingFetchEmployeeIDList ? <Spin /> : 'No Data'}
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
          notFoundContent={loadingFetchEmployeeNameList ? <Spin /> : 'No Data'}
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

      {activeTab !== 'myTeam' && (
        <>
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
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
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
        </>
      )}

      <Form.Item label="by job title" name="title">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Job Title"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
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
          <Form.Item label="By reporting manager" name="reportingManager">
            <AutoComplete
              dropdownMatchSelectWidth={252}
              notFoundContent={loadingFetchManagerList ? <Spin /> : 'No Data'}
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
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
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
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
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
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Search by Employment Type"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
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

          <Form.Item label="By skills & certifications" name="skill">
            <Select
              allowClear
              showSearch
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Search by Skills"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
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
  loadingFetchManagerList: loading.effects['employee/fetchManagerListEffect'],
  employee,
  companyLocationList,
}))(FilterContent);
