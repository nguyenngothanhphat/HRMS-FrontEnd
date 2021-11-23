import React, { Component } from 'react'
import { Button, DatePicker, Divider, Form, Input, Select, Tag } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import CalendarIcon from '@/assets/calendar_icon.svg';
import styles from './index.less';

const { Option } = Select;

@connect(({ loading, resourceManagement: 
  { 
    projectList = [], 
    employeeList = [], 
    divisions = [],
    statusList=[],
    titleList=[],
  } = {} }) => ({
  loading: loading.effects['resourceManagement/getListEmployee'],
  projectList,
  employeeList,
  divisions,
  statusList,
  titleList
}))
class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      durationFrom: '', // validate date
      durationTo: '', // validate date
      filter: {...props.filter},
      // isFilter: false, // check enable|disable button Apply
      // checkAll: false,
    };

    this.formRef = React.createRef();
  }

  componentDidMount() {
  }

  clearFilter = () => {
    this.setState({
      filter: {
        nam: undefined,
        title: [],
        priority: undefined,
        assign: undefined,
        location: [],
        fromDate: null,
        toDate: null,
      },
      // isFilter: false,
      // checkAll: false,
      durationFrom: '',
      durationTo: '',
    });
    this.formRef.current.resetFields();
  };

  disabledDate = (currentDate, type) => {
    const { durationTo, durationFrom } = this.state;

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
  // };

  tagRender = (props) => {
    const { label, closable, onClose } = props;
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

  onValuesChange = (value) => {
    // const { filter } = this.state;
    this.setState({
      // isFilter: true,
      filter: {...value}
      // filter: {
      //   ...filter,
      //   ...value,
      // },
    });
  };

  onFinish = (value) => {
    const {onFilterChange} = this.props
    console.log('onFinish with value: ', JSON.stringify(value))
    const { filter } = this.state;
    onFilterChange({...filter, ...value})
    // const payload = { ...value, ...filter };
  };

  // onChange = e => {
  //   const { value } = e.target;
  //   const reg = /^-?\d*(\.\d*)?$/;
  //   if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
  //     this.props.onChange(value);
  //   }
  // };

  render() {
    const { statusList = [], projectList = [], employeeList = [], divisions = [], titleList=[] } = this.props;
    const employees = employeeList.map(x => {
        return {_id: x._id, name: x.generalInfo.legalName}
    })
    const division = divisions.map((x) => {
        return {_id: x, name: x} 
    })
    const projects = projectList.map((x) => {
      return { _id: x.id, name: x.projectName };
    });

    const statuses = statusList.map((x) => {
      return { _id: x, name: x };
    })

    const titles = titleList.map((x) => {
      return { _id: x._id, name: x.name };
    })
    const dateFormat = 'MMM DD, YYYY';
    const fieldsArray = [
      {
        label: 'BY NAME/USER ID',
        name: 'name',
        placeholder: 'Select name',
        optionArray: employees,
      },
      {
        label: 'BY DIVISION',
        name: 'tagDivision',
        mode : "multiple",
        placeholder: 'Select priority',
        optionArray: division,
      },
      {
        label: 'BY DESIGNATION',
        name: 'title',
        mode : "multiple",
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
        mode : "multiple",
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
    const {filter} = this.props
    return (
      <div className={styles.filterForm}>
        <Form
          layout="horizontal"
          className={styles.form}
          initialValues={filter}
          // onValuesChange={this.onValuesChange}
          onFinish={this.onFinish}
          ref={this.formRef}
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
                  tagRender={this.tagRender}
                  placeholder={field.placeholder}
                  dropdownClassName={styles.dropdown}
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
                    // onChange={this.onChange}
                    // disabledDate={(currentDate) => this.disabledDate(currentDate, 'fromDate')}
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
                    disabledDate={(currentDate) => this.disabledDate(currentDate, 'fromDate')}
                    format={dateFormat}
                    placeholder="From Date"
                    onChange={(value) => {
                      this.onChangeDate(value, 'fromDate');
                    }}
                    suffixIcon={
                      <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                    }
                  />
                </Form.Item>
                <div className={`${styles.labelText} ${styles.labelTo}`}>to</div>
                <Form.Item name="toDate">
                  <DatePicker
                    disabledDate={(currentDate) => this.disabledDate(currentDate, 'toDate')}
                    format={dateFormat}
                    placeholder="To Date"
                    onChange={(value) => {
                      this.onChangeDate(value, 'toDate');
                    }}
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
                    disabledDate={(currentDate) =>
                      this.disabledDate(currentDate, 'tentativeEndDateStart')}
                    format={dateFormat}
                    placeholder="From Date"
                    onChange={(value) => {
                      this.onChangeDate(value, 'tentativeEndDateStart');
                    }}
                    suffixIcon={
                      <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                    }
                  />
                </Form.Item>
                <div className={`${styles.labelText} ${styles.labelTo}`}>to</div>
                <Form.Item name="tentativeEndDateEnd">
                  <DatePicker
                    disabledDate={(currentDate) => this.disabledDate(currentDate, 'tentativeEndDateEnd')}
                    format={dateFormat}
                    placeholder="To Date"
                    onChange={(value) => {
                      this.onChangeDate(value, 'tentativeEndDateEnd');
                    }}
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
            <Button onClick={this.clearFilter} className={styles.footer__clear}>
              Clear
            </Button>
            <Button
              onClick={this.onApply}
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
  }
}

export default FilterForm
