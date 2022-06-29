import React, { useState, useEffect } from 'react';
import { DatePicker, Form, Input, Select, Tag, AutoComplete, Spin } from 'antd';
import moment from 'moment';
import { debounce } from 'lodash';
import { connect } from 'umi';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import CalendarIcon from '@/assets/calendar_icon.svg';
import SearchIcon from '@/assets/directory/search.svg';
import { dateFormatAPI } from '@/utils/timeSheet';
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
    loadingFetchEmployeeNameList = false,
    visible = false,
    setApplied = () => {},
    setForm,
    listSkill = [],
  } = props;

  const [durationFrom, setDurationFrom] = useState('');
  const [durationTo, setDurationTo] = useState('');
  const [filter, setFilter] = useState({});
  const [employeeNameListState, setEmployeeNameListState] = useState([]);
  const [employeeNameState, setEmployeeNameState] = useState('');
  const [searchIcons, setSearchIcons] = useState({
    name: false,
  });

  useEffect(() => {
    setFilter({ ...filterProp });
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    setEmployeeNameListState(
      employeeList.map((x) => {
        return {
          value: x.generalInfo?.legalName,
          label: x.generalInfo.legalName,
        };
      }),
    );
  }, [JSON.stringify(employeeList)]);

  useEffect(() => {
    if (!employeeNameState) {
      setEmployeeNameListState([]);
    }
  }, [employeeNameState]);

  useEffect(() => {
    setForm(form);
  }, []);

  // const clearFilter = () => {
  //   setFilter({
  //     filter: {
  //       name: undefined,
  //       title: [],
  //       tagDivision: [],
  //       statuses: undefined,
  //       projects: [],
  //       skill: undefined,
  //       fromDate: null,
  //       toDate: null,
  //       expYearBegin: undefined,
  //       expYearEnd: undefined,
  //       tentativeEndDateEnd: undefined,
  //       tentativeEndDateStart: undefined,
  //     },
  //   });
  //   setDurationFrom('');
  //   setDurationTo('');
  //   form.resetFields();
  //   onFilterChange({ ...filter, filter });
  // };
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

  const onFinish = (values) => {
    const newValues = { ...values };

    // remove empty fields
    // eslint-disable-next-line no-return-assign
    const result = Object.entries(newValues).reduce(
      // eslint-disable-next-line no-return-assign
      (a, [k, v]) =>
        v == null || v.length === 0
          ? a
          : // eslint-disable-next-line no-param-reassign
            ((a[k] = v), a),
      {},
    );
    if (result.startFromDate) {
      result.startFromDate = moment(result.startFromDate).format(dateFormatAPI);
    }
    if (result.startToDate) {
      result.startToDate = moment(result.startToDate).format(dateFormatAPI);
    }
    if (result.tentativeEndDateStart) {
      result.tentativeEndDateStart = moment(result.tentativeEndDateStart).format(dateFormatAPI);
    }
    if (result.tentativeEndDateEnd) {
      result.tentativeEndDateEnd = moment(result.tentativeEndDateEnd).format(dateFormatAPI);
    }

    onFilterChange({ ...filter, ...result });
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 1000);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    const filteredObj = Object.entries(values).filter(
      ([, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
    onFinishDebounce(values);
  };
  const onSearchEmployeeDebounce = debounce((type, value) => {
    let typeTemp = '';
    switch (type) {
      // case 'id':
      //   typeTemp = 'employee/fetchEmployeeIDListEffect';
      //   break;
      case 'name':
        typeTemp = 'resourceManagement/getListEmployee';
        setEmployeeNameState(value);
        break;
      // case 'manager':
      //   typeTemp = 'employee/fetchManagerListEffect';
      //   break;
      default:
        break;
    }
    if (typeTemp && value) {
      dispatch({
        type: typeTemp,
        payload: {
          name: value,
          department: ['Engineering'],
        },
      });
    }
    if (!value) {
      switch (type) {
        // case 'id':
        //   setEmployeeIDListState([]);
        //   break;
        case 'name':
          setEmployeeNameListState([]);
          break;
        // case 'manager':
        //   setManagerListState([]);
        //   break;
        default:
          break;
      }
    }
  }, 1000);

  const handleEmployeeSearch = (type, value) => {
    onSearchEmployeeDebounce(type, value);
  };

  // const employees = employeeList.map((x) => {
  //   return { _id: x._id, name: x.generalInfo.legalName };
  // });
  const division = divisions.map((x) => {
    return { _id: x.name, name: x.name };
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

  const tagDefaultLis = listSkill.map((x) => {
    return { _id: x._id, name: x.name };
  });
  const dateFormat = 'MMM DD, YYYY';
  const fieldsArray = [
    {
      label: 'BY DIVISION',
      name: 'tagDivision',
      mode: 'multiple',
      placeholder: 'Select the division',
      optionArray: division,
    },
    {
      label: 'BY DESIGNATION',
      name: 'title',
      mode: 'multiple',
      placeholder: 'Select the designation',
      optionArray: titles,
    },
    {
      label: 'BY SKILL',
      name: 'skills',
      placeholder: 'Select the location',
      mode: 'multiple',
      optionArray: tagDefaultLis,
    },
    {
      label: 'BY CURRENT PROJECT',
      name: 'projects',
      placeholder: 'Select the project',
      mode: 'multiple',
      optionArray: projects,
    },
    {
      label: 'BY BILLING STATUS',
      name: 'statuses',
      placeholder: 'Select the billing status',
      optionArray: statuses,
    },
  ];

  return (
    <div className={styles.filterForm}>
      <Form
        layout="horizontal"
        className={styles.form}
        // initialValues={filterProp}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        form={form}
      >
        <div className={styles.form__top}>
          <Form.Item label="BY NAME/USER ID" name="name">
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
                <Input className={styles.experience} placeholder="Years of Exp" />
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
                <Input className={styles.experience} placeholder="Years of Exp" />
              </Form.Item>
            </div>
          </div>

          <div className={styles.doj}>
            <div className={styles.doj__label}>
              <div className={styles.labelText}>By Start Date</div>
            </div>
            <div className={styles.doj__date}>
              <Form.Item name="startFromDate">
                <DatePicker
                  disabledDate={(currentDate) => disabledDate(currentDate, 'fromDate')}
                  format={dateFormat}
                  placeholder="From Date"
                  suffixIcon={
                    <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                  }
                />
              </Form.Item>
              <div className={`${styles.labelText} ${styles.labelTo}`}>to</div>
              <Form.Item name="startToDate">
                <DatePicker
                  disabledDate={(currentDate) => disabledDate(currentDate, 'toDate')}
                  format={dateFormat}
                  placeholder="To Date"
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
      listSkill = [],
    } = {},
  }) => ({
    loadingFetchEmployeeNameList: loading.effects['resourceManagement/getListEmployee'],
    projectList,
    employeeList,
    divisions,
    statusList,
    listSkill,
    titleList,
  }),
)(FilterForm);
