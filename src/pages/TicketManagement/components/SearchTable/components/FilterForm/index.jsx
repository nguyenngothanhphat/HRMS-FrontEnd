import React, { Component } from 'react';
import { Button, Checkbox, DatePicker, Divider, Form, Select, Tag } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
// import LOCATION from '@/utils/ticketManagement';

import CloseTagIcon from '@/assets/closeTagIcon.svg';
import CalendarIcon from '@/assets/calendar_icon.svg';

import styles from './index.less';

const { Option } = Select;
@connect(
  ({
    ticketManagement: {
      currentStatus = [],
      listOffAllTicket = [],
      searchTicket: { totalList = [], locationList = [], isFilter: isFiltering = false } = {},
    } = {},
  }) => ({
    currentStatus,
    listOffAllTicket,
    locationList,
    isFiltering,
    totalList,
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
        queryType: undefined,
        priority: undefined,
        location: undefined,
        employeeAssignee: undefined,
        fromDate: undefined,
        toDate: undefined,
      },
      // isFilter: false, // check enable|disable button Apply
      // checkAll: false,
    };

    this.formRef = React.createRef();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { filter } = this.state;
  //   if (JSON.stringify(prevState.filter) !== JSON.stringify(filter)) {
  //     this.validateFilterFields(filter);
  //   }
  // }

  //  validateFilterFields = (filter) => {
  //    if (!filter.fromDate && !filter.toDate) {
  //      // in case without filter date
  //      const isEmptyValue = values(filter).every(isEmpty);
  //      this.setState({
  //       //  isFilter: !isEmptyValue,  // if all fields value is empty => means not filtering
  //      });
  //    } else if (filter.fromDate && filter.toDate) {
  //      // in case filter date, must select 2 date fields
  //      this.setState({
  //        isFilter: true,
  //      });
  //    } else {
  //      this.setState({
  //        isFilter: false,
  //      });
  //    }
  //  };

  clearFilter = () => {
    const { dispatch, currentStatus = [] } = this.props;
    this.setState({
      filter: {
        name: undefined,
        queryType: undefined,
        priority: undefined,
        assign: undefined,
        location: undefined,
        fromDate: null,
        toDate: null,
      },
      // isFilter: false,
      // checkAll: false,
      durationFrom: '',
      durationTo: '',
    });
    this.formRef.current.resetFields();
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload: {
        status: currentStatus,
      },
    });
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
      // isFilter: true,
      filter: {
        ...filter,
        ...value,
      },
    });
  };

  onFinish = (value) => {
    const { dispatch, currentStatus = [] } = this.props;
    const { filter } = this.state;
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
      type: 'ticketManagement/fetchListAllTicket',
      payload: {
        ...payload,
        status: currentStatus,
      },
    });
  };

  // handleCheckAll = (e) => {
  //   const { filter } = this.state;
  //   let data = { ...filter };

  //   if (e === 'ALL') {
  //     data = {
  //       location: Object.values(LOCATION),
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
  //     console.log(checked);
  //     if (checked) {
  //       data = {
  //         location: Object.values(LOCATION),
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

  // handleSelect = (value) => {
  //   console.log(value);
  //   const { filter, checkAll } = this.state;
  //   const isAll = value.includes('ALL');
  //   if (isAll) {
  //     this.handleCheckAll('ALL');
  //   } else {
  //     let arrayLocation = checkAll ? [...filter.location] : [];
  //     arrayLocation = arrayLocation.filter((location) => location !== value);

  //     if (checkAll) {
  //       this.setState({
  //         isFilter: true,
  //         filter: {
  //           ...filter,
  //           location: arrayLocation,
  //         },
  //         checkAll: arrayLocation?.length === Object.keys(LOCATION).length,
  //       });
  //     } else {
  //       this.setState({
  //         isFilter: true,
  //         filter: {
  //           ...filter,
  //           location: [...value],
  //         },
  //         checkAll: value?.length === Object.keys(LOCATION).length,
  //       });
  //     }
  //   }
  // };

  // onSelectAll = (valueAll) => {
  //   const { filter } = this.state;
  //   let data = { ...filter };

  //   if (valueAll === 'ALL' && data.location.length === Object.keys(LOCATION).length) {
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
    const { listOffAllTicket = [] } = this.props;
    function getUniqueListBy(arr, key) {
      return [...new Map(arr.map((item) => [item[key], item])).values()];
    }
    const queryTypeList = getUniqueListBy(listOffAllTicket, 'query_type');
    const priorityList = getUniqueListBy(listOffAllTicket, 'priority');
    const assigned = getUniqueListBy(listOffAllTicket, 'employee_assignee');
    const assginedList = assigned.filter((val) => val.employee_assignee !== '');
    const legalNameList = getUniqueListBy(listOffAllTicket, 'employee_raise');
    const locationList = getUniqueListBy(listOffAllTicket, 'employee_raise');
    // const { isFilter, checkItem, checkAll, checkedList } = this.state;
    const dateFormat = 'MMM DD, YYYY';

    return (
      <div className={styles.filterForm}>
        <Form
          layout="horizontal"
          className={styles.form}
          onValuesChange={this.onValuesChange}
          onFinish={this.onFinish}
          ref={this.formRef}
          name="formFilter"
        >
          <div className={styles.form__top}>
            <Form.Item key="name" label="BY NAME" name="name">
              <Select
                allowClear
                showArrow
                showSearch
                filterOption={(input, option) => {
                  const arrChild = option.props.children[1];
                  return arrChild.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                mode="multiple"
                tagRender={this.tagRender}
                placeholder="Select name"
                dropdownClassName={styles.dropdown}
              >
                {legalNameList.map((option) => {
                  return (
                    <Option key={option.id} value={option.employeeRaise.generalInfo.legalName}>
                      <Checkbox
                        value={option.employeeRaise.generalInfo.legalName}
                        checked={this.checkBoxStatusChecked(
                          option.employeeRaise.generalInfo.legalName,
                          'name',
                        )}
                      />
                      <span>{option.employeeRaise.generalInfo.legalName}</span>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item key="queryType" label="BY REQUEST TYPE" name="queryType">
              <Select
                allowClear
                showArrow
                showSearch
                filterOption={(input, option) => {
                  const arrChild = option.props.children[1];
                  return arrChild.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                mode="multiple"
                tagRender={this.tagRender}
                placeholder="Select request type"
                dropdownClassName={styles.dropdown}
              >
                {queryTypeList.map((option) => {
                  return (
                    <Option key={option.id} value={option.query_type}>
                      <Checkbox
                        value={option.query_type}
                        checked={this.checkBoxStatusChecked(option.query_type, 'queryType')}
                      />
                      <span>{option.query_type}</span>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item key="priority" label="BY PRIORITY" name="priority">
              <Select
                allowClear
                showArrow
                showSearch
                filterOption={(input, option) => {
                  const arrChild = option.props.children[1];
                  return arrChild.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                mode="multiple"
                tagRender={this.tagRender}
                placeholder="Select priority"
                dropdownClassName={styles.dropdown}
              >
                {priorityList.map((option) => {
                  return (
                    <Option key={option.id} value={option.priority}>
                      <Checkbox
                        value={option.priority}
                        checked={this.checkBoxStatusChecked(option.priority, 'priority')}
                      />
                      <span>{option.priority}</span>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item key="location" label="BY LOCATION" name="location">
              <Select
                allowClear
                showArrow
                showSearch
                // filterOption={(input, option) => {
                //   return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                // }}
                filterOption={(input, option) => {
                  const arrChild = option.props.children[1];
                  return arrChild.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                mode="multiple"
                tagRender={this.tagRender}
                placeholder="Select location"
                // onChange={() => this.handleSelect(locationList)}
                // onClear={() =>
                //   this.setState({
                //     checkAll: false,
                //   })}
                // mode="multiple"
                // value={checkAll ? 'ALL' : filter.location}
                // onSelect={checkAll ? this.onSelectAll : null}
                // disabled={currentStatus !== 'ALL'}
                dropdownClassName={styles.dropdown}
              >
                {/* <Option value="ALL" >
                  <Checkbox value="ALL" checked={checkAll} onChange={this.onCheckAllChange} />
                  <span>Select All</span>
                </Option> */}
                {locationList.map((option) => {
                  const { employeeRaise: { location: { name = '' } = {} } = {} } = option;
                  return (
                    <Option
                      key={option.employeeRaise.location.name}
                      value={option.employeeRaise.location.name}
                    >
                      <Checkbox
                        value={option.employeeRaise.location.name}
                        checked={this.checkBoxStatusChecked(
                          option.employeeRaise.location.name,
                          'location',
                        )}
                      />
                      <span>{name}</span>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item key="employeeAssignee" label="BY ASSIGN" name="employeeAssignee">
              <Select
                allowClear
                showArrow
                showSearch
                filterOption={(input, option) => {
                  const arrChild = option.props.children[1];
                  return arrChild.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                mode="multiple"
                tagRender={this.tagRender}
                placeholder="Select assign"
                dropdownClassName={styles.dropdown}
              >
                {/** condition status have different New */}
                {!isEmpty(assginedList)
                  ? assginedList.map((option) => {
                      const { employeeAssignee: { generalInfo: { legalName = '' } = {} } = {} } =
                        option;
                      return (
                        <Option
                          key={option.id}
                          value={option.employeeAssignee.generalInfo.legalName}
                        >
                          <Checkbox
                            value={option.employeeAssignee.generalInfo.legalName}
                            checked={this.checkBoxStatusChecked(
                              option.employeeAssignee.generalInfo.legalName,
                              'employeeAssignee',
                            )}
                          />
                          <span>{legalName}</span>
                        </Option>
                      );
                    })
                  : ''}
              </Select>
            </Form.Item>

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
