import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Divider, Form, Input, Select, Tag } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import CalendarIcon from '@/assets/calendar_icon.svg';
import styles from './index.less';

const { Option } = Select;

const FilterForm = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    filter: filterProp,
    onFilterChange = () => {},
    statusList = [],
    projectList = [],
    employeeList = [],
    divisions = [],
    titleList = [],
    loading = false,
    visible = false,
  } = props;

  const [durationFrom, setDurationFrom] = useState('');
  const [durationTo, setDurationTo] = useState('');
  const [filter, setFilter] = useState({});

  const fetchEmployeeList = async () => {
    dispatch({
      type: 'resourceManagement/getListEmployee',
      payload: {
        department: ['Engineering'],
      },
    });
  };

  useEffect(() => {
    if (visible && !loading) {
      fetchEmployeeList();
    }
  }, [visible]);

  useEffect(() => {
    setFilter({ ...filterProp });
  }, [JSON.stringify(filter)]);

  const clearFilter = () => {
    setFilter({
      filter: {
        name: undefined,
        title: [],
        tagDivision: [],
        statuses: undefined,
        projects: [],
        skill: undefined,
        fromDate: null,
        toDate: null,
        expYearBegin: undefined,
        expYearEnd: undefined,
        tentativeEndDateEnd: undefined,
        tentativeEndDateStart: undefined,
      },
    });
    setDurationFrom('');
    setDurationTo('');
    form.resetFields();
    onFilterChange({ ...filter, filter });
  };

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

  // onChangeDate = (currentDate, type) => {
  //   switch (type) {
  //     case 'fromDate':
  //       if (currentDate === null) {
  //         setState({
  //           durationFrom: '',
  //         });
  //       } else {
  //         setState({
  //           durationFrom: currentDate,
  //         });
  //       }
  //       break;

  //     case 'toDate':
  //       if (currentDate === null) {
  //         setState({
  //           durationTo: '',
  //         });
  //       } else {
  //         setState({
  //           durationTo: currentDate,
  //         });
  //       }
  //       break;

  //     default:
  //       break;
  //   }
  // };

  const tagRender = ({ label, closable, onClose }) => {
    return (
      <Tag
        className={styles.tags}
        closable={closable}
        onClose={onClose}
        closeIcon={<img alt="close-tag" src={CloseTagIcon} />}
      >
        {label}
      </Tag>
    );
  };

  // const onValuesChange = (value) => {
  //   setFilter({ ...filter, ...value });
  // };

  const onFinish = (value) => {
    console.log('onFinish with value: ', JSON.stringify(value));
    onFilterChange({ ...filter, ...value });

    // const payload = { ...value, ...filter };
  };

  // onChange = e => {
  //   const { value } = e.target;
  //   const reg = /^-?\d*(\.\d*)?$/;
  //   if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
  //     props.onChange(value);
  //   }
  // };

  const employees = employeeList.map((x) => {
    return { _id: x._id, name: x.generalInfo.legalName };
  });
  const division = divisions.map((x) => {
    return { _id: x, name: x };
  });
  const projects = projectList.map((x) => {
    return { _id: x.id, name: x.projectName };
  });

  const statuses = statusList.map((x) => {
    return { _id: x, name: x };
  });

  const titles = titleList.map((x) => {
    return { _id: x._id, name: x.name };
  });
  const dateFormat = 'MMM DD, YYYY';
  const fieldsArray = [
    {
      label: 'BY NAME/USER ID',
      name: 'name',
      placeholder: 'Select name',
      optionArray: employees,
      loading,
    },
    {
      label: 'BY DIVISION',
      name: 'tagDivision',
      mode: 'multiple',
      placeholder: 'Select priority',
      optionArray: division,
    },
    {
      label: 'BY DESIGNATION',
      name: 'title',
      mode: 'multiple',
      placeholder: 'Select designation',
      optionArray: titles,
    },
    {
      label: 'BY SKILL',
      name: 'skill',
      placeholder: 'Select location',
      optionArray: statuses,
    },
    {
      label: 'BY CURRENT PROJECT',
      name: 'projects',
      placeholder: 'Select location',
      mode: 'multiple',
      optionArray: projects,
    },
    {
      label: 'BY BILLING STATUS',
      name: 'statuses',
      // mode : "multiple",
      placeholder: 'Select billing status',
      optionArray: statuses,
    },
    // {
    //   label: 'BY ASSIGN',
    //   name: 'assign',
    //   placeholder: 'Select assign',
    //   optionArray: TicketsList,
    // },
  ];

  return (
    <div className={styles.filterForm}>
      <Form
        layout="horizontal"
        className={styles.form}
        // initialValues={filterProp}
        // onValuesChange={onValuesChange}
        onFinish={onFinish}
        form={form}
      >
        <div className={styles.form__top}>
          {fieldsArray.map((field) => (
            <Form.Item key={field.name} label={field.label} name={field.name}>
              <Select
                allowClear
                showArrow
                showSearch
                // optionFilterProp="children"
                filterOption={(input, option) => {
                  return (
                    input &&
                    ((option.key && option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0) ||
                      (option.label &&
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0))
                  );
                }}
                // const arrChild = option.props.children[1];
                // return arrChild.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                mode={field.mode || ''}
                tagRender={tagRender}
                placeholder={field.placeholder}
                dropdownClassName={styles.dropdown}
                loading={field.loading}
                disabled={field.loading}
              >
                {field.optionArray.map((option) => {
                  return (
                    <Option key={option._id} value={option._id} label={option.name}>
                      <span>{option.name}</span>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          ))}
          <div className={styles.doj}>
            <div className={styles.doj__label}>
              <div className={styles.labelText}>BY EXPERIENCE</div>
            </div>
            <div className={styles.doj__date}>
              <Form.Item
                name="expYearBegin"
                rules={[
                  {
                    pattern: /^-?\d*(\.\d*)?$/,
                    message: 'Only accept number',
                  },
                ]}
              >
                <Input className={styles.experience} placeholder="Input number" />
              </Form.Item>
              <div className={`${styles.labelText} ${styles.labelTo}`}>to</div>
              <Form.Item
                name="expYearEnd"
                rules={[
                  {
                    pattern: /^-?\d*(\.\d*)?$/,
                    message: 'Only accept number',
                  },
                ]}
              >
                <Input
                  // onChange={onChange}
                  // disabledDate={(currentDate) => disabledDate(currentDate, 'fromDate')}
                  // format={dateFormat}
                  className={styles.experience}
                  placeholder="Input number"
                />
              </Form.Item>
            </div>
          </div>

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
                  // onChange={(value) => {
                  //   onChangeDate(value, 'fromDate');
                  // }}
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
                  // onChange={(value) => {
                  //   onChangeDate(value, 'toDate');
                  // }}
                  suffixIcon={
                    <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                  }
                />
              </Form.Item>
            </div>
          </div>
          <div className={styles.doj}>
            <div className={styles.doj__label}>
              <div className={styles.labelText}>BY TENTATIVE END DATE</div>
            </div>
            <div className={styles.doj__date}>
              <Form.Item name="tentativeEndDateStart">
                <DatePicker
                  disabledDate={(currentDate) => disabledDate(currentDate, 'tentativeEndDateStart')}
                  format={dateFormat}
                  placeholder="From Date"
                  // onChange={(value) => {
                  //   onChangeDate(value, 'tentativeEndDateStart');
                  // }}
                  suffixIcon={
                    <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                  }
                />
              </Form.Item>
              <div className={`${styles.labelText} ${styles.labelTo}`}>to</div>
              <Form.Item name="tentativeEndDateEnd">
                <DatePicker
                  disabledDate={(currentDate) => disabledDate(currentDate, 'tentativeEndDateEnd')}
                  format={dateFormat}
                  placeholder="To Date"
                  // onChange={(value) => {
                  //   onChangeDate(value, 'tentativeEndDateEnd');
                  // }}
                  suffixIcon={
                    <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                  }
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <Divider className={styles.divider} />
        <div className={styles.footer}>
          <Button onClick={clearFilter} className={styles.footer__clear}>
            Clear
          </Button>
          <Button
            // onClick={onApply}
            // disabled={!isFilter}
            className={styles.footer__apply}
            htmlType="submit"
          >
            Apply
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default connect(
  ({
    loading,
    resourceManagement: {
      projectList = [],
      employeeList = [],
      divisions = [],
      statusList = [],
      titleList = [],
    } = {},
  }) => ({
    loading: loading.effects['resourceManagement/getListEmployee'],
    projectList,
    employeeList,
    divisions,
    statusList,
    titleList,
  }),
)(FilterForm);
