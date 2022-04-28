/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Button, Checkbox, DatePicker, Divider, Form, Select, Tag } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import { isEmpty, values } from 'lodash';

import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import CalendarIcon from '@/assets/calendar_icon.svg';

import styles from './index.less';

const { Option } = Select;
const arrStatus = [
  {
    label: 'Draft',
    value: NEW_PROCESS_STATUS.DRAFT,
  },
  {
    label: 'Profile Verification',
    value: NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
  },
  {
    label: 'Document Verification',
    value: NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
  },
  {
    label: 'Salary Proposal',
    value: NEW_PROCESS_STATUS.SALARY_NEGOTIATION,
  },
  {
    label: 'Awaiting Approvals',
    value: NEW_PROCESS_STATUS.AWAITING_APPROVALS,
  },
  {
    label: 'Needs Changes',
    value: NEW_PROCESS_STATUS.NEEDS_CHANGES,
  },
  {
    label: 'Offer Released',
    value: NEW_PROCESS_STATUS.OFFER_RELEASED,
  },
  {
    label: 'Offer Accepted',
    value: NEW_PROCESS_STATUS.OFFER_ACCEPTED,
  },
  {
    label: 'Offer Rejected',
    value: NEW_PROCESS_STATUS.OFFER_REJECTED,
  },
  {
    label: 'Offer Withdraw',
    value: NEW_PROCESS_STATUS.OFFER_WITHDRAWN,
  },
];

@connect(
  ({
    onboarding: {
      searchOnboarding: {
        jobTitleList = [],
        locationList = [],
        isFilter: isFiltering = false,
      } = {},
      onboardingOverview: { currentStatus = '' } = {},
    } = {},
  }) => ({
    jobTitleList,
    locationList,
    currentStatus,
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
        processStatus: undefined,
        title: undefined,
        location: undefined,
        fromDate: undefined,
        toDate: undefined,
      },
      isFilter: false, // check enable|disable button Apply
      checkAll: false,
    };

    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { callbackClose = () => {} } = this.props;
    callbackClose(this.clearFilter);
  }

  componentDidUpdate(prevProps, prevState) {
    const { filter } = this.state;
    const { isFiltering } = this.props;

    if (JSON.stringify(prevState.filter) !== JSON.stringify(filter)) {
      this.validateFilterFields(filter);
    }

    if (prevProps.isFiltering !== isFiltering) {
      // this.clearFilter();
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
    // press Clear button
    this.setState(
      {
        filter: {
          processStatus: undefined,
          title: [],
          location: [],
          fromDate: null,
          toDate: null,
        },
        isFilter: false,
        checkAll: false,
        durationFrom: '',
        durationTo: '',
      },
      () => this.onFinish(),
    );

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
    // this.onFinish({ [type]: currentDate });
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

    this.setState(
      {
        isFilter: true,
        filter: {
          ...filter,
          ...value,
        },
      },
      () => this.onFinish(value),
    );
  };

  onFinish = (value) => {
    const { dispatch, currentStatus = '', callback = () => {} } = this.props;
    const { filter } = this.state;
    let payload = { ...value, ...filter };

    if (payload.processStatus === undefined && currentStatus !== 'ALL') {
      payload = {
        ...payload,
        processStatus: [currentStatus],
      };
    }

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
      type: 'onboarding/filterOnboardList',
      payload,
      currentStatus,
    });
    callback(payload);
  };

  handleCheckAll = (e) => {
    const { filter } = this.state;
    let data = { ...filter };

    if (e === 'ALL') {
      data = {
        processStatus: Object.values(NEW_PROCESS_STATUS),
      };
      this.setState(
        {
          checkAll: true,
          filter: {
            ...filter,
            ...data,
          },
        },
        () => this.onFinish(data),
      );
    } else {
      const { checked } = e.target;
      if (checked) {
        data = {
          processStatus: Object.values(NEW_PROCESS_STATUS),
        };
      } else {
        data = {
          processStatus: undefined,
        };
      }

      this.setState(
        {
          checkAll: checked,
          filter: {
            ...filter,
            ...data,
          },
        },
        () => this.onFinish(data),
      );
    }
  };

  handleSelect = (value) => {
    const { filter, checkAll } = this.state;
    const isAll = value?.length && value?.includes('ALL');
    if (isAll) {
      this.handleCheckAll('ALL');
    } else {
      let arrayStatus = checkAll ? [...filter.processStatus] : [];
      arrayStatus = arrayStatus.filter((status) => status !== value);

      if (checkAll) {
        this.setState({
          isFilter: true,
          filter: {
            ...filter,
            processStatus: arrayStatus,
          },
          checkAll: arrayStatus?.length === Object.keys(NEW_PROCESS_STATUS).length,
        });
      } else {
        this.setState(
          {
            isFilter: true,
            filter: {
              ...filter,
              processStatus: [...value],
            },
            checkAll: value?.length === Object.keys(NEW_PROCESS_STATUS).length,
          },
          () => this.onFinish({ processStatus: [...value] }),
        );
      }
    }
  };

  onSelectAll = (valueAll) => {
    const { filter } = this.state;
    let data = { ...filter };

    if (
      valueAll === 'ALL' &&
      data.processStatus.length === Object.keys(NEW_PROCESS_STATUS).length
    ) {
      data = {
        processStatus: undefined,
      };
      this.setState(
        {
          isFilter: true,
          filter: {
            ...filter,
            ...data,
          },
          checkAll: false,
        },
        () => this.onFinish(data),
      );
    }
  };

  render() {
    const { jobTitleList = [], locationList = [], currentStatus = '' } = this.props;
    const { isFilter, filter, checkAll } = this.state;
    const dateFormat = 'MMM DD, YYYY';

    const fieldsArray = [
      {
        label: 'BY POSITION',
        name: 'title',
        placeholder: 'Select postion',
        optionArray: jobTitleList,
      },
      {
        label: 'BY LOCATION',
        name: 'location',
        placeholder: 'Select location',
        optionArray: locationList,
      },
    ];

    return (
      <div className={styles.filterForm}>
        <Form
          layout="horizontal"
          className={styles.form}
          onValuesChange={(value) => {
            this.onValuesChange(value);
          }}
          // onFinish={this.onFinish}
          ref={this.formRef}
        >
          <div className={styles.form__top}>
            <div className={styles.processStatus}>
              <div className={styles.processStatus__label}>
                <div className={styles.labelText}>By Status</div>
              </div>
              <Select
                allowClear={!checkAll}
                showArrow
                showSearch
                filterOption={(input, option) => {
                  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                tagRender={this.tagRender}
                placeholder="Select status"
                onChange={this.handleSelect}
                onClear={() =>
                  this.setState({
                    checkAll: false,
                  })
                }
                mode={checkAll ? null : 'multiple'}
                value={checkAll ? 'ALL' : filter.processStatus}
                onSelect={checkAll ? this.onSelectAll : null} // use to un-select all
                disabled={currentStatus !== 'ALL'}
                dropdownClassName={styles.dropdown}
              >
                <Option value="ALL">
                  <Checkbox value="ALL" checked={checkAll} onChange={this.handleCheckAll} />
                  <span>Select All</span>
                </Option>
                {arrStatus.map((option) => {
                  return (
                    <Option key={option.value} value={option.value}>
                      <Checkbox
                        value={option.value}
                        checked={this.checkBoxStatusChecked(option.value, 'processStatus')}
                      />
                      <span>{option.label}</span>
                    </Option>
                  );
                })}
              </Select>
            </div>
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
                  mode="multiple"
                  tagRender={this.tagRender}
                  placeholder={field.placeholder}
                  dropdownClassName={styles.dropdown}
                >
                  {field.optionArray.map((option) => {
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
                </Select>
              </Form.Item>
            ))}
            <div className={styles.doj}>
              <div className={styles.doj__label}>
                <div className={styles.labelText}>By Date Of Joining</div>
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

          {/* <Divider className={styles.divider} />
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
          </div> */}
        </Form>
      </div>
    );
  }
}

export default FilterForm;
