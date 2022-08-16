import { AutoComplete, Col, DatePicker, Form, Input, Row, Select, Spin } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { DATE_FORMAT_MDY, DATE_FORMAT_YMD } from '@/constants/dateFormat';
import CalendarIcon from '@/assets/calendar_icon.svg';
import styles from './index.less';

const { Option } = Select;

const FilterForm = (props) => {
  const {
    loadingFetchEmployeeRaiseListEffect = false,
    loadingFetchEmployeeAssignedListEffect = false,
    dispatch,
    visible = false,
    setFilterForm = () => {},
    country = {},
    permissions = {},
    ticketManagement: {
      currentStatus = [],
      listOffAllTicket = [],
      employeeAssignedList = [],
      employeeRaiseList = [],
      supportTeamList = [],
      filter = {},
    } = {},
  } = props;

  const [form] = Form.useForm();
  const [durationFrom, setDurationFrom] = useState('');
  const [durationTo, setDurationTo] = useState('');

  const [nameListState, setNameListState] = useState([]);
  const [assignedListState, setAssignedListState] = useState([]);

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const queryTypeList = getUniqueListBy(listOffAllTicket, 'query_type');
  const priorityList = getUniqueListBy(listOffAllTicket, 'priority');

  useEffect(() => {
    setNameListState([]);
    setAssignedListState([]);
    dispatch({
      type: 'ticketManagement/fetchSupportTeamList',
      payload: { country: country?._id, permissions },
    });
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
    setAssignedListState(
      employeeAssignedList.map((x) => {
        return {
          value: x.generalInfo?.legalName,
          label: x.generalInfo.legalName,
        };
      }),
    );
  }, [JSON.stringify(employeeAssignedList)]);

  useEffect(() => {
    setFilterForm(form);
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
      const _fromDate = moment(newValues.fromDate).format(DATE_FORMAT_YMD);
      const _toDate = moment(newValues.toDate).format(DATE_FORMAT_YMD);
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
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 800);

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(allValues);
  };

  // clear values
  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

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
          setAssignedListState([]);
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
            {permissions.viewTicketByAdmin === 1 && (
              <Form.Item key="name" label="BY TEAM" name="supportTeam">
                <Select
                  allowClear
                  showSearch
                  mode="multiple"
                  placeholder="Search by Team Name"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  showArrow
                >
                  {supportTeamList.map((option) => {
                    return (
                      <Option key={option._id} value={option.name}>
                        {option.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
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
                    <Option key={option.query_type_id} value={option.query_type_id}>
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
                  options={assignedListState}
                  onSearch={(val) => handleEmployeeSearch('employeeAssignee', val)}
                >
                  <Input placeholder="Search by assigned" allowClear />
                </AutoComplete>
              </Form.Item>
            ) : null}

            <Form.Item label="BY REQUEST DATE">
              <Row>
                <Col span={11}>
                  <Form.Item name="fromDate">
                    <DatePicker
                      disabledDate={(currentDate) => disabledDate(currentDate, 'fromDate')}
                      format={DATE_FORMAT_MDY}
                      placeholder="From Date"
                      onChange={(value) => {
                        onChangeDate(value, 'fromDate');
                      }}
                      suffixIcon={
                        <img
                          alt="calendar-icon"
                          src={CalendarIcon}
                          className={styles.calendarIcon}
                        />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={2} className={styles.separator}>
                  <span>to</span>
                </Col>
                <Col span={11}>
                  <Form.Item name="toDate">
                    <DatePicker
                      disabledDate={(currentDate) => disabledDate(currentDate, 'toDate')}
                      format={DATE_FORMAT_MDY}
                      placeholder="To Date"
                      onChange={(value) => {
                        onChangeDate(value, 'toDate');
                      }}
                      suffixIcon={
                        <img
                          alt="calendar-icon"
                          src={CalendarIcon}
                          className={styles.calendarIcon}
                        />
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default connect(
  ({
    loading,
    ticketManagement,
    user: {
      permissions = {},
      currentUser: {
        employee: { location: { headQuarterAddress: { country = {} } = {} } = {} } = {},
      } = {},
    },
  }) => ({
    permissions,
    country,
    ticketManagement,
    loadingFetchListAllTicket: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFetchEmployeeRaiseListEffect:
      loading.effects['ticketManagement/fetchEmployeeRaiseListEffect'],
    loadingFetchEmployeeAssigneeListEffect:
      loading.effects['ticketManagement/fetchEmployeeAssignedListEffect'],
  }),
)(FilterForm);
