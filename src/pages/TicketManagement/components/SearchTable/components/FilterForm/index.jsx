import React, { useState, useEffect } from 'react';
import { DatePicker, Form, Select, AutoComplete, Spin, Input } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import { connect } from 'umi';
import CalendarIcon from '@/assets/calendar_icon.svg';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';

const { Option } = Select;

const FilterForm = (props) => {
  const {
    listOffAllTicket = [],
    // locationsList = [],
    employeeAssignedList = [],
    employeeRaiseList = [],
    currentStatus = '',
    selectedLocations = [],
    country = '',
    loadingFetchEmployeeRaiseListEffect,
    loadingFetchEmployeeAssignedListEffect,
    dispatch,
    visible = false,
    handleFilterCounts = () => {},
    setForm = () => {},
  } = props;

  const [form] = Form.useForm();
  const [durationFrom, setDurationFrom] = useState('');
  const [durationTo, setDurationTo] = useState('');

  const [nameListState, setNameListState] = useState([]);
  const [asignedListState, setAsignedListState] = useState([]);

  const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const queryTypeList = getUniqueListBy(listOffAllTicket, 'query_type');
  const priorityList = getUniqueListBy(listOffAllTicket, 'priority');
  const dateFormat = 'DD-MM-YYYY';

  useEffect(() => {
    setNameListState([]);
    setAsignedListState([]);
  }, [visible]);

  useEffect(() => {
    setNameListState(
      employeeRaiseList.map((x) => {
        return {
          value: x.generalInfo?.legalName,
          label: x.generalInfo.legalName,
        };
      }),
    );
  }, [JSON.stringify(employeeRaiseList)]);

  useEffect(() => {
    setAsignedListState(
      employeeAssignedList.map((x) => {
        return {
          value: x.generalInfo?.legalName,
          label: x.generalInfo.legalName,
        };
      }),
    );
  }, [JSON.stringify(employeeAssignedList)]);

  useEffect(() => {
    setForm(form);
  }, []);

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
      type: 'ticketManagement/save',
      payload: { filter: payload },
    });
    if (permissions && permissions.length > 0) {
      payload = {
        ...payload,
        permissions,
        country,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload: {
        ...payload,
        status: currentStatus,
        location: selectedLocations,
      },
    });
    dispatch({
      type: 'ticketManagement/fetchToTalList',
      payload: {
        ...payload,
        status: currentStatus,
        location: selectedLocations,
      },
    });
  };

  const onFinishDebounce = debounce((values) => {
    handleFilterCounts(values);
    onFinish(values);
  }, 1000);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

  const onSearchEmployeeDebounce = debounce((type, value) => {
    let typeTemp = '';
    switch (type) {
      case 'employeeRaise':
        typeTemp = 'ticketManagement/fetchEmployeeRaiseListEffect';
        break;
      case 'employeeAssignee':
        typeTemp = 'ticketManagement/fetchEmployeeAssignedListEffect';

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
        case 'employeeRaise':
          dispatch({
            type: 'ticketManagement/save',
            payload: {
              employeeRaiseList: [],
            },
          });
          setNameListState([]);
          break;
        case 'employeeAssignee':
          dispatch({
            type: 'ticketManagement/save',
            payload: {
              employeeAssignedList: [],
            },
          });
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
            <Form.Item key="name" label="BY NAME" name="employeeRaise">
              <AutoComplete
                dropdownMatchSelectWidth={252}
                notFoundContent={loadingFetchEmployeeRaiseListEffect ? <Spin /> : 'No Data'}
                options={nameListState}
                onSearch={(val) => handleEmployeeSearch('employeeRaise', val)}
              >
                <Input placeholder="Search by Name" allowClear />
              </AutoComplete>
            </Form.Item>
            <Form.Item key="queryType" label="BY REQUEST TYPE" name="queryType">
              <Select
                allowClear
                showSearch
                mode="multiple"
                placeholder="Select request type"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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

            {currentStatus && currentStatus[0] !== 'New' ? (
              <Form.Item key="employeeAssignee" label="BY ASSIGNED TO" name="employeeAssignee">
                <AutoComplete
                  dropdownMatchSelectWidth={252}
                  notFoundContent={loadingFetchEmployeeAssignedListEffect ? <Spin /> : 'No matches'}
                  options={asignedListState}
                  onSearch={(val) => handleEmployeeSearch('employeeAssignee', val)}
                >
                  <Input placeholder="Search by assigned" allowClear />
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
    ticketManagement: {
      locationsList = [],
      currentStatus = [],
      listOffAllTicket = [],
      employeeAssignedList = [],
      employeeRaiseList = [],
      selectedLocations = [],
    } = {},
    user: {
      permissions = {},
      currentUser: {
        employee: { location: { headQuarterAddress: { country = '' } = {} } = {} } = {},
      } = {},
    },
  }) => ({
    permissions,
    country,
    currentStatus,
    listOffAllTicket,
    locationsList,
    employeeRaiseList,
    employeeAssignedList,
    selectedLocations,
    loadingFetchListAllTicket: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFetchEmployeeRaiseListEffect:
      loading.effects['ticketManagement/fetchEmployeeRaiseListEffect'],
    loadingFetchEmployeeAssigneeListEffect:
      loading.effects['ticketManagement/fetchEmployeeAssignedListEffect'],
  }),
)(FilterForm);
