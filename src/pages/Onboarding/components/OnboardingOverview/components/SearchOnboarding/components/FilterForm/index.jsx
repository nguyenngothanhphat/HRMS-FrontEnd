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
    _id: 'ALL',
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
  ({ onboarding: { searchOnboarding: { jobTitleList = [], locationList = [] } = {} } = {} }) => ({
    jobTitleList,
    locationList,
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
        pendingStatus: undefined,
        otherStatus: undefined,
        title: [],
        location: [],
        dateOfJoinFrom: null,
        dateOfJoinTo: null,
      },
      isFilter: false, // check enable|disable button Apply
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
    if (!filter.dateOfJoinFrom && !filter.dateOfJoinTo) {
      // in case without filter date
      const isEmptyValue = values(filter).every(isEmpty);
      this.setState({
        isFilter: !isEmptyValue, // if all fields value is empty => means not filtering
      });
    } else if (filter.dateOfJoinFrom && filter.dateOfJoinTo) {
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
        pendingStatus: undefined,
        otherStatus: undefined,
        title: [],
        location: [],
        dateOfJoinFrom: null,
        dateOfJoinTo: null,
      },
      isFilter: false,
    });

    this.formRef.current.resetFields();
  };

  disabledDate = (currentDate, type) => {
    const { durationTo, durationFrom } = this.state;

    if (type === 'dateOfJoinFrom') {
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
      case 'dateOfJoinFrom':
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

      case 'dateOfJoinTo':
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
    const payload = { ...value };
    Object.keys(payload).forEach(
      (k) =>
        (payload[k] === null && delete payload[k]) ||
        (payload[k] === undefined && delete payload[k]) ||
        (payload[k] === '' && delete payload[k]),
    );

    console.log(value);
    console.log(payload);
  };

  render() {
    const { jobTitleList = [], locationList = [] } = this.props;
    const { isFilter } = this.state;
    const dateFormat = 'MMM DD, YYYY';

    const fieldsArray = [
      {
        label: 'BY PENDING STATUS',
        name: 'pendingStatus',
        placeholder: 'Select pending status',
        filterOption: 1,
        optionArray: arrStatus,
      },
      {
        label: 'BY OTHER STATUS',
        name: 'otherStatus',
        placeholder: 'Select other status',
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
                  filterOption={(input, option) =>
                    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
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
                <Form.Item name="dateOfJoinFrom">
                  <DatePicker
                    disabledDate={(currentDate) => this.disabledDate(currentDate, 'dateOfJoinFrom')}
                    format={dateFormat}
                    placeholder="From Date"
                    onChange={(value) => {
                      this.onChangeDate(value, 'dateOfJoinFrom');
                    }}
                    suffixIcon={
                      <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                    }
                  />
                </Form.Item>
                <div className={`${styles.labelText} ${styles.labelTo}`}>to</div>
                <Form.Item name="dateOfJoinTo">
                  <DatePicker
                    disabledDate={(currentDate) => this.disabledDate(currentDate, 'dateOfJoinTo')}
                    format={dateFormat}
                    placeholder="To Date"
                    onChange={(value) => {
                      this.onChangeDate(value, 'dateOfJoinTo');
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
