import React, { Component } from 'react';
import { Button, Checkbox, DatePicker, Divider, Form, Select, Tag } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import { isEmpty, values } from 'lodash';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import CalendarIcon from '@/assets/calendar_icon.svg';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    ticketManagement: {
      searchTicket: {
        listOffAllTicketSearch = [],
        locationList = [],
        isFilter: isFiltering = false,
      } = {},
    } = {},
  }) => ({
    listOffAllTicketSearch,
    locationList,
    isFiltering,
  }),
)
class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      durationFrom: '', // validate date
      durationTo: '', // validate date
      filter: {
        // store data
        name: undefined,
        query_type: undefined,
        priority: undefined,
        location: undefined,
        assign: undefined,
        fromDate: undefined,
        toDate: undefined,
      },
      isFilter: false, // check enable|disable button Apply
      checkAll: false,
    };

    this.formRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const { filter } = this.state;
    if (JSON.stringify(prevState.filter) !== JSON.stringify(filter)) {
      this.validateFilterFields(filter);
    }
  }

  validateFilterFields = (filter) => {
    if (!filter.fromDate && !filter.toDate) {
      // in case without filter date
      const isEmptyValue = values(filter).every(isEmpty);
      this.setState({
        isFilter: !isEmptyValue, // if all fields value is empty => means not filtering
      });
    } else if (filter.fromDate && filter.toDate) {
      // in case filter date, must select 2 date fields
      this.setState({
        isFilter: true,
      });
    } else {
      this.setState({
        isFilter: false,
      });
    }
  };

  clearFilter = () => {
    this.setState({
      filter: {
        name: undefined,
        title: [],
        priority: undefined,
        assign: undefined,
        location: [],
        fromDate: null,
        toDate: null,
      },
      isFilter: false,
      checkAll: false,
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

  onChangeDate = (currentDate, type) => {
    switch (type) {
      case 'fromDate':
        if (currentDate === null) {
          this.setState({
            durationFrom: '',
          });
        } else {
          this.setState({
            durationFrom: currentDate,
          });
        }
        break;

      case 'toDate':
        if (currentDate === null) {
          this.setState({
            durationTo: '',
          });
        } else {
          this.setState({
            durationTo: currentDate,
          });
        }
        break;

      default:
        break;
    }
  };

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

  checkBoxStatusChecked = (id, field) => {
    const { filter } = this.state;
    let check = false;
    if (isEmpty(filter[field])) return check;

    filter[field].forEach((itemId) => {
      if (itemId === id) {
        check = true;
      }
    });

    return check;
  };

  onValuesChange = (value) => {
    const { filter } = this.state;

    this.setState({
      isFilter: true,
      filter: {
        ...filter,
        ...value,
      },
    });
  };

  onFinish = (value) => {
    const { dispatch } = this.props;
    const { filter } = this.state;
    console.log(value);
    let payload = { ...value, ...filter };
    if (payload.fromDate && payload.toDate) {
      const _fromDate = moment(payload.fromDate).format('YYYY-MM-DD');
      const _toDate = moment(payload.toDate).format('YYYY-MM-DD');
      payload = {
        ...payload,
        fromDate: _fromDate,
        toDate: _toDate,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchListAllTicketSearch',
      payload,
    });
  };

  // handleCheckAll = (e) => {
  //   const { filter } = this.state;
  //   const { locationList } = this.props;
  //   let data = { ...filter };

  //   if (e === 'ALL') {
  //     data = {
  //       location: locationList,
  //     };
  //     this.setState({
  //       checkAll: true,
  //       filter: {
  //         ...filter,
  //         ...data,
  //       },
  //     });
  //   } else {
  //     const { checked } = e.target;
  //     if (checked) {
  //       data = {
  //         location: locationList,
  //       };
  //     } else {
  //       data = {
  //         location: undefined,
  //       };
  //     }

  //     this.setState({
  //       checkAll: checked,
  //       filter: {
  //         ...filter,
  //         ...data,
  //       },
  //     });
  //   }
  // };

  // onSelectAll = (valueAll) => {
  //   const { filter } = this.state;
  //   const { locationList } = this.props;
  //   let data = { ...filter };

  //   if (valueAll === 'ALL' && data.location.length === locationList.length) {
  //     data = {
  //       location: undefined,
  //     };
  //     this.setState({
  //       isFilter: true,
  //       filter: {
  //         ...filter,
  //         ...data,
  //       },
  //       checkAll: false,
  //     });
  //   }
  // };

  render() {
    const { listOffAllTicketSearch = [], locationList = [] } = this.props;
    const { isFilter, filter, checkAll } = this.state;
    const dateFormat = 'MMM DD, YYYY';
    const fieldsArray = [
      {
        label: 'BY NAME',
        name: 'name',
        placeholder: 'Select name',
        optionArray: listOffAllTicketSearch,
      },
      {
        label: 'BY REQUEST TYPE',
        name: 'requestType',
        placeholder: 'Select request type',
        optionArray: listOffAllTicketSearch,
      },
      {
        label: 'BY PRIORITY',
        name: 'priority',
        placeholder: 'Select priority',
        optionArray: listOffAllTicketSearch,
      },
      {
        label: 'BY LOCATION',
        name: 'location',
        placeholder: 'Select location',
        optionArray: locationList,
      },
      {
        label: 'BY ASSIGN',
        name: 'assign',
        placeholder: 'Select assign',
        optionArray: listOffAllTicketSearch,
      },
    ];

    return (
      <div className={styles.filterForm}>
        <Form
          layout="horizontal"
          className={styles.form}
          onValuesChange={this.onValuesChange}
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
                  filterOption={(input, option) => {
                    const arrChild = option.props.children[1];
                    return arrChild.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                  tagRender={this.tagRender}
                  placeholder={field.placeholder}
                  onClear={() =>
                    this.setState({
                      checkAll: false,
                    })}
                  mode="multiple"
                  // mode={checkAll ? null : 'multiple'}
                  // value={checkAll ? 'ALL' : filter.location}
                  // onSelect={checkAll ? this.onSelectAll : null} // use to un-select all
                  // // disabled={locationList !== 'ALL'}
                  dropdownClassName={styles.dropdown}
                >
                  {field.name === 'name' &&
                    field.optionArray.map((option) => {
                      return (
                        <Option key={option.id} value={option.employeeRaise.generalInfo.legalName}>
                          <Checkbox
                            value={option.employeeRaise.generalInfo.legalName}
                            checked={this.checkBoxStatusChecked(
                              option.employeeRaise.generalInfo.legalName,
                              field.name,
                            )}
                          />
                          <span>{option.employeeRaise.generalInfo.legalName}</span>
                        </Option>
                      );
                    })}
                  {field.name === 'requestType' &&
                    field.optionArray.map((option) => {
                      return (
                        <Option key={option.id} value={option.query_type}>
                          <Checkbox
                            value={option.query_type}
                            checked={this.checkBoxStatusChecked(option.query_type, field.name)}
                          />
                          <span>{option.query_type}</span>
                        </Option>
                      );
                    })}
                  {field.name === 'priority' &&
                    field.optionArray.map((option) => {
                      return (
                        <Option key={option.id} value={option.priority}>
                          <Checkbox
                            value={option.priority}
                            checked={this.checkBoxStatusChecked(option.priority, field.name)}
                          />
                          <span>{option.priority}</span>
                        </Option>
                      );
                    })}
                  {field.name === 'location' && (
                    <Option value="ALL">
                      <Checkbox value="ALL" checked={checkAll} onChange={this.handleCheckAll} />
                      <span>Select All</span>
                    </Option>
                  )}
                  {field.name === 'location' &&
                    field.optionArray.map((option) => {
                      return (
                        <Option key={option._id} value={option._id}>
                          <Checkbox
                            value={option._id}
                            checked={this.checkBoxStatusChecked(option._id, field.name)}
                          />
                          <span>{option.name}</span>
                        </Option>
                      );
                    })}

                  {field.name === 'assign' &&
                    field.optionArray.map((option) => {
                      return (
                        <Option key={option.id} value={option.priority}>
                          <Checkbox
                            value={option.priority}
                            checked={this.checkBoxStatusChecked(option.priority, field.name)}
                          />
                          <span>{option.priority}</span>
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            ))}
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

export default FilterForm;
