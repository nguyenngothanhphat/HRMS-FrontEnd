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
    name: 'All',
    _id: '',
  },
  {
    name: 'Draft',
    _id: NEW_PROCESS_STATUS.DRAFT,
  },
  {
    name: 'Profile Verification',
    _id: NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
  },
  {
    name: 'Document Verification',
    _id: NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
  },
  {
    name: 'Salary Negotiation',
    _id: NEW_PROCESS_STATUS.SALARY_NEGOTIATION,
  },
  {
    name: 'Awaiting approvals',
    _id: NEW_PROCESS_STATUS.AWAITING_APPROVALS,
  },
  {
    name: 'Offer Released',
    _id: NEW_PROCESS_STATUS.OFFER_RELEASED,
  },
  {
    name: 'Offer Accepted',
    _id: NEW_PROCESS_STATUS.OFFER_ACCEPTED,
  },
  {
    name: 'Offer Rejected',
    _id: NEW_PROCESS_STATUS.OFFER_REJECTED,
  },
  {
    name: 'Offer Withdraw',
    _id: NEW_PROCESS_STATUS.OFFER_WITHDRAWN,
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
        otherStatus: undefined,
        title: [],
        location: [],
        fromDate: null,
        toDate: null,
      },
      isFilter: false, // check enable|disable button Apply
    };

    this.formRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const { filter } = this.state;
    const { isFiltering } = this.props;

    if (JSON.stringify(prevState.filter) !== JSON.stringify(filter)) {
      this.validateFilterFields(filter);
    }

    if (prevProps.isFiltering !== isFiltering) {
      this.clearFilter();
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
    this.setState({
      filter: {
        processStatus: undefined,
        otherStatus: undefined,
        title: [],
        location: [],
        fromDate: null,
        toDate: null,
      },
      isFilter: false,
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
    const { dispatch, currentStatus = '' } = this.props;
    const payload = { ...value };
    Object.keys(payload).forEach(
      (k) =>
        (payload[k] === null && delete payload[k]) ||
        (payload[k] === undefined && delete payload[k]) ||
        (payload[k] === '' && delete payload[k]) ||
        (payload[k] === [] && delete payload[k]),
    );

    if ('processStatus' in payload) {
      const newProcessStatus = payload.processStatus.filter((status) => status !== '');

      const newPayload = {
        ...payload,
        processStatus: newProcessStatus.length === 0 ? '' : payload.processStatus,
      };

      dispatch({
        type: 'onboarding/filterOnboardList',
        payload: newPayload,
        currentStatus,
      });
    } else {
      dispatch({
        type: 'onboarding/filterOnboardList',
        payload,
        currentStatus,
      });
    }
  };

  render() {
    const { jobTitleList = [], locationList = [] } = this.props;
    const { isFilter } = this.state;
    const dateFormat = 'MMM DD, YYYY';

    const fieldsArray = [
      {
        label: 'BY STATUS',
        name: 'processStatus',
        placeholder: 'Select status',
        filterOption: 1,
        optionArray: arrStatus,
      },
      {
        label: 'BY POSITION',
        name: 'title',
        placeholder: 'Select postion',
        filterOption: 2,
        optionArray: jobTitleList,
      },
      {
        label: 'BY LOCATION',
        name: 'location',
        placeholder: 'Select location',
        filterOption: 2,
        optionArray: locationList,
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
                    if (field.filterOption === 2) {
                      const arrChild = option.props.children[1];
                      return (
                        arrChild.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }

                    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                  mode="multiple"
                  tagRender={this.tagRender}
                  placeholder={field.placeholder}
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
                <div className={styles.labelText}>DOJ</div>
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
              disabled={!isFilter}
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
