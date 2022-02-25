import React, { useState, useEffect } from 'react';
import { DatePicker, Form, Select, AutoComplete, Spin, Input } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import { connect } from 'umi';

import CalendarIcon from '@/assets/calendar_icon.svg';

import styles from './index.less';

const { Option } = Select;

const FilterForm = (props) => {
  const {
    listOffAllTicket = [],
    locationsList = [],
    currentStatus = '',
    loadingFetchListAllTicket,
    dispatch,
  } = props;
  const [form] = Form.useForm();
  const [durationFrom, setDurationFrom] = useState('');
  const [durationTo, setDurationTo] = useState('');
  const [nameListState, setNameListState] = useState([]);
  const [asignedListState, setAsignedListState] = useState([]);

  const [selectedname, setSelectedname] = useState('');
  const [selectedAsigned, setSelectedAsigned] = useState('');

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }
  const queryTypeList = getUniqueListBy(listOffAllTicket, 'query_type');
  const priorityList = getUniqueListBy(listOffAllTicket, 'priority');
  const assigned = getUniqueListBy(listOffAllTicket, 'employee_assignee');
  const assginedList = assigned.filter((val) => val.employee_assignee !== '');
  const legalNameList = getUniqueListBy(listOffAllTicket, 'employee_raise');
  const locationsListNew = getUniqueListBy(listOffAllTicket, 'location');
  const dateFormat = 'DD-MM-YYYY';

  useEffect(() => {
    setNameListState(
      legalNameList.map((x) => {
        return {
          value: x.employeeRaise?.generalInfo?._id,
          label: x.employeeRaise?.generalInfo.legalName,
        };
      }),
    );
  }, [JSON.stringify(legalNameList)]);

  useEffect(() => {
    setAsignedListState(
      assginedList.map((x) => {
        return {
          value: x.employeeAssignee?.generalInfo?._id,
          label: x.employeeAssignee?.generalInfo.legalName,
        };
      }),
    );
  }, [JSON.stringify(assginedList)]);

  useEffect(() => {
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload: {
        status: currentStatus,
        employeeRaise: [selectedname],
      },
    });
  }, [JSON.stringify(selectedname), JSON.stringify(selectedAsigned)]);

  useEffect(() => {
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload: {
        status: currentStatus,
        employeeRaise: [selectedAsigned],
      },
    });
  }, [JSON.stringify(selectedAsigned)]);

  const disabledDate = (currentDate, type) => {
    if (type === 'fromDate') {
      return (
        (currentDate && currentDate > moment(durationTo)) ||
        moment(currentDate).day() === 0 ||
        moment(currentDate).day() === 6
      );
    }

    return (
      (currentDate && currentDate < moment(durationFrom)) ||
      moment(currentDate).day() === 0 ||
      moment(currentDate).day() === 6
    );
  };

  const onChangeDate = (currentDate, type) => {
    switch (type) {
      case 'fromDate':
        if (currentDate === null) {
          setDurationFrom('');
        } else {
          setDurationFrom(currentDate);
        }
        break;

      case 'toDate':
        if (currentDate === null) {
          setDurationTo('');
        } else {
          setDurationTo(currentDate);
        }
        break;

      default:
        break;
    }
  };

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
    let payload = filterTemp;
    if (newValues.fromDate && newValues.toDate) {
      const _fromDate = moment(newValues.fromDate).format('YYYY-MM-DD');
      const _toDate = moment(newValues.toDate).format('YYYY-MM-DD');
      payload = {
        ...filterTemp,
        fromDate: _fromDate,
        toDate: _toDate,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload: {
        ...payload,
        status: currentStatus,
      },
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
    switch (type) {
      case 'employeeRaise':
        setSelectedname(value);
        break;
      case 'employeeAssignee':
        setSelectedAsigned(value);
        break;

      default:
        break;
    }
    if (!value) {
      switch (type) {
        case 'employeeRaise':
          setNameListState([]);
          break;
        case 'employeeAssignee':
          setAsignedListState([]);
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
    <div>
      <div className={styles.filterForm}>
        <Form
          layout="horizontal"
          className={styles.form}
          form={form}
          name="formFilter"
          onValuesChange={onValuesChange}
        >
          <div className={styles.form__top}>
            <Form.Item key="name" label="BY NAME">
              <AutoComplete
                dropdownMatchSelectWidth={252}
                notFoundContent={loadingFetchListAllTicket ? <Spin /> : 'No matches'}
                options={nameListState}
                onSearch={(val) => handleEmployeeSearch('employeeRaise', val)}
              >
                <Input
                  placeholder="Search by Name"
                  // prefix={searchIcons.name ? <img src={SearchIcon} alt="search" /> : null}
                  allowClear
                />
              </AutoComplete>
              {/* <Select
                allowClear
                showSearch
                mode="multiple"
                placeholder="Select name"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showArrow
              >
                {!isEmpty(legalNameList)
                  ? legalNameList.map((option) => {
                      const {
                        employeeRaise: {
                          _id: userId = '',
                          generalInfo: { legalName = '' } = {},
                        } = {},
                      } = option;
                      return (
                        <Option key={option.id} value={userId}>
                          {legalName}
                        </Option>
                      );
                    })
                  : null}
              </Select> */}
            </Form.Item>
            <Form.Item key="queryType" label="BY REQUEST TYPE" name="queryType">
              <Select
                allowClear
                showSearch
                mode="multiple"
                placeholder="Select request type"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showArrow
              >
                {queryTypeList.map((option) => {
                  return (
                    <Option key={option.id} value={option.query_type}>
                      {option.query_type}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item key="priority" label="BY PRIORITY" name="priority">
              <Select
                allowClear
                showSearch
                mode="multiple"
                placeholder="Select priority"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showArrow
              >
                {priorityList.map((option) => {
                  return (
                    <Option key={option.id} value={option.priority}>
                      {option.priority}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item key="location" label="BY LOCATION" name="location">
              <Select
                allowClear
                showSearch
                mode="multiple"
                placeholder="Select location"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showArrow
              >
                {locationsListNew.map((option) => {
                  const locationName =
                    locationsList.length > 0
                      ? locationsList.filter((val) => val._id === option.location)
                      : [];
                  const name = locationName.length > 0 ? locationName[0].name : null;
                  return (
                    <Option key={option.location} value={option.location}>
                      {name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {currentStatus && currentStatus[0] !== 'New' ? (
              <Form.Item key="employeeAssignee" label="BY ASSIGNED TO">
                <AutoComplete
                  dropdownMatchSelectWidth={252}
                  notFoundContent={loadingFetchListAllTicket ? <Spin /> : 'No matches'}
                  options={asignedListState}
                  onSearch={(val) => handleEmployeeSearch('employeeAssignee', val)}
                >
                  <Input
                    placeholder="Search by assigned"
                    // prefix={searchIcons.name ? <img src={SearchIcon} alt="search" /> : null}
                    allowClear
                  />
                </AutoComplete>
              </Form.Item>
            ) : null}

            <div className={styles.doj}>
              <div className={styles.doj__label}>
                <div className={styles.labelText}>BY REQUEST DATE</div>
              </div>
              <div className={styles.doj__date}>
                <Form.Item name="fromDate">
                  <DatePicker
                    disabledDate={(currentDate) => disabledDate(currentDate, 'fromDate')}
                    format={dateFormat}
                    placeholder="From Date"
                    onChange={(value) => {
                      onChangeDate(value, 'fromDate');
                    }}
                    suffixIcon={
                      <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                    }
                  />
                </Form.Item>
                <div className={`${styles.labelText} ${styles.labelTo}`}>to</div>
                <Form.Item name="toDate">
                  <DatePicker
                    disabledDate={(currentDate) => disabledDate(currentDate, 'toDate')}
                    format={dateFormat}
                    placeholder="To Date"
                    onChange={(value) => {
                      onChangeDate(value, 'toDate');
                    }}
                    suffixIcon={
                      <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                    }
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default connect(
  ({
    loading,
    ticketManagement: { locationsList = [], currentStatus = [], listOffAllTicket = [] } = {},
  }) => ({
    currentStatus,
    listOffAllTicket,
    locationsList,
    loadingFetchListAllTicket: loading.effects['ticketManagement/fetchListAllTicket'],
  }),
)(FilterForm);
