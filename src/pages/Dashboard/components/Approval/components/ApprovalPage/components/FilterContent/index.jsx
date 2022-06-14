import { AutoComplete, Col, DatePicker, Form, Input, Row, Select, Spin } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import SearchIcon from '@/assets/directory/search.svg';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    onFilter = () => {},
    employee: {
      employeeIDList = [],
      employeeNameList = [],
      filterList: { listDepartmentName = [], listTitle = [] } = {},
    } = {},
    loadingFetchEmployeeIDList = false,
    loadingFetchEmployeeNameList = false,
    // handleFilterCounts = () => {},
    setForm = () => {},
  } = props;

  const dateFormat = 'MMM DD, YYYY';

  const [employeeIDListState, setEmployeeIDListState] = useState([]);
  const [employeeNameListState, setEmployeeNameListState] = useState([]);
  const [searchIcons, setSearchIcons] = useState({
    id: false,
    name: false,
  });

  useEffect(() => {
    setForm(form);
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

    if (filterTemp.fromDate) {
      filterTemp.fromDate = moment(filterTemp.fromDate).format('YYYY-MM-DD');
    }
    if (filterTemp.toDate) {
      filterTemp.toDate = moment(filterTemp.toDate).format('YYYY-MM-DD');
    }

    dispatch({
      type: 'employee/save',
      payload: { filter: filterTemp },
    });
    onFilter(filterTemp);
    console.log(filterTemp);
  };

  const onFinishDebounce = debounce((values) => {
    // handleFilterCounts(values);
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

        default:
          break;
      }
    }
  }, 1000);

  const handleEmployeeSearch = (type, value) => {
    onSearchEmployeeDebounce(type, value);
  };

  // const onChangeDate = (currentDate, type) => {
  //   switch (type) {
  //     case 'fromDate':
  //       if (currentDate === null) {
  //         this.setState({
  //           durationFrom: '',
  //         });
  //       } else {
  //         this.setState({
  //           durationFrom: currentDate,
  //         });
  //       }
  //       break;

  //     case 'toDate':
  //       if (currentDate === null) {
  //         this.setState({
  //           durationTo: '',
  //         });
  //       } else {
  //         this.setState({
  //           durationTo: currentDate,
  //         });
  //       }
  //       break;

  //     default:
  //       break;
  //   }
  //   // this.onFinish({ [type]: currentDate });
  // };

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
          {listDepartmentName.map((x) => {
            return (
              <Select.Option value={x} key={x}>
                {x}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="by request type" name="type">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by request type"
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

      <Form.Item label="By request date">
        <Row>
          <Col span={11}>
            <Form.Item name="fromDate">
              <DatePicker
                format={dateFormat}
                placeholder="From Date"
                // onChange={(value) => {
                //   onChangeDate(value, 'fromDate');
                // }}
              />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="toDate">
              <DatePicker format={dateFormat} placeholder="To Date" />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
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
