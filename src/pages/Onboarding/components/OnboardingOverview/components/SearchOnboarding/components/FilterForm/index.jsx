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
    value: 'ALL',
  },
  {
    name: 'Draft',
    value: NEW_PROCESS_STATUS.DRAFT,
  },
  {
    name: 'Profile Verification',
    value: NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
  },
  {
    name: 'Document Verification',
    value: NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
  },
  {
    name: 'Salary Negotiation',
    value: NEW_PROCESS_STATUS.SALARY_NEGOTIATION,
  },
  {
    name: 'Awaiting approvals',
    value: NEW_PROCESS_STATUS.AWAITING_APPROVALS,
  },
  {
    name: 'Offer Released',
    value: NEW_PROCESS_STATUS.OFFER_RELEASED,
  },
  {
    name: 'Offer Accepted',
    value: NEW_PROCESS_STATUS.OFFER_ACCEPTED,
  },
  {
    name: 'Offer Rejected',
    value: NEW_PROCESS_STATUS.OFFER_REJECTED,
  },
  {
    name: 'Offer Withdraw',
    value: NEW_PROCESS_STATUS.OFFER_WITHDRAWN,
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

    if (type === 'from') {
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

  onChangeDate = (value, type) => {
    switch (type) {
      case 'from':
        if (value === null) {
          this.setState({
            durationFrom: '',
          });
        } else {
          this.setState({
            durationFrom: value,
          });
        }
        break;

      case 'to':
        if (value === null) {
          this.setState({
            durationTo: '',
          });
        } else {
          this.setState({
            durationTo: value,
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
    console.log(value);
  };

  render() {
    const { jobTitleList = [], locationList = [] } = this.props;
    const { isFilter } = this.state;
    const dateFormat = 'MMM DD, YYYY';

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
            <Form.Item label="BY PENDING STATUS" name="pendingStatus">
              <Select
                allowClear
                filterOption={(input, option) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showArrow
                showSearch
                placeholder="Select pending status"
                mode="multiple"
                tagRender={this.tagRender}
              >
                {arrStatus.map((status) => {
                  return (
                    <Option key={status.value} value={status.value}>
                      <Checkbox
                        value={status.value}
                        checked={this.checkBoxStatusChecked(status.value, 'pendingStatus')}
                      />
                      <span>{status.name}</span>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="BY OTHER STATUS" name="otherStatus">
              <Select
                allowClear
                filterOption={(input, option) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showArrow
                showSearch
                placeholder="Select other status"
                mode="multiple"
                tagRender={this.tagRender}
              >
                {arrStatus.map((status) => (
                  <Option key={status.value} value={status.value}>
                    <Checkbox
                      value={status.value}
                      checked={this.checkBoxStatusChecked(status.value, 'otherStatus')}
                    />
                    <span>{status.name}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="BY POSITION" name="title">
              <Select
                mode="multiple"
                allowClear
                filterOption={(input, option) => {
                  const getOptionChildren = option.props.children;
                  return (
                    getOptionChildren[1].props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                showArrow
                showSearch
                placeholder="Select position"
                tagRender={this.tagRender}
              >
                {jobTitleList.map((title) => (
                  <Option key={title._id} value={title._id}>
                    <Checkbox
                      value={title._id}
                      checked={this.checkBoxStatusChecked(title._id, 'title')}
                    />
                    <span>{title.name}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="BY LOCATION" name="location">
              <Select
                mode="multiple"
                filterOption={(input, option) => {
                  const getOptionChildren = option.props.children;
                  return (
                    getOptionChildren[1].props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                allowClear
                showArrow
                showSearch
                placeholder="Select location"
                tagRender={this.tagRender}
              >
                {locationList.map((location) => (
                  <Option key={location._id} value={location._id}>
                    <Checkbox
                      value={location._id}
                      checked={this.checkBoxStatusChecked(location._id, 'location')}
                    />
                    <span>{location.name}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div className={styles.doj}>
              <div className={styles.doj__label}>
                <div className={styles.labelText}>DOJ</div>
              </div>
              <div className={styles.doj__date}>
                <Form.Item name="dateOfJoinFrom">
                  <DatePicker
                    disabledDate={(currentDate) => this.disabledDate(currentDate, 'from')}
                    format={dateFormat}
                    placeholder="From Date"
                    onChange={(value) => {
                      this.onChangeDate(value, 'from');
                    }}
                    suffixIcon={
                      <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                    }
                  />
                </Form.Item>
                <div className={`${styles.labelText} ${styles.labelTo}`}>to</div>
                <Form.Item name="dateOfJoinTo">
                  <DatePicker
                    disabledDate={(currentDate) => this.disabledDate(currentDate, 'to')}
                    format={dateFormat}
                    placeholder="To Date"
                    onChange={(value) => {
                      this.onChangeDate(value, 'to');
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
