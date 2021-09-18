/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { DatePicker, Form, Select, Tag } from 'antd';
import { connect } from 'umi';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import CloseTagIcon from '@/assets/closeTagIcon.svg';

import moment from 'moment';
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
      durationFrom: '',
      durationTo: '',
    };
  }

  onValuesChange = (value) => {
    const { onFilterChange = () => {} } = this.props;
    onFilterChange(value);
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

  render() {
    const { jobTitleList = [], locationList = [] } = this.props;
    const dateFormat = 'MM.DD.YY';

    return (
      <div className={styles.filterForm}>
        <Form layout="horizontal" className={styles.form} onValuesChange={this.onValuesChange}>
          <Form.Item label="BY PENDING STATUS" name="pendingStatus">
            <Select
              allowClear
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showArrow
              showSearch
            >
              {arrStatus.map((status) => (
                <Option key={status.value} value={status.value}>
                  {status.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="BY OTHER STATUS" name="otherStatus">
            <Select
              allowClear
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showArrow
              showSearch
            >
              {arrStatus.map((status) => (
                <Option key={status.value} value={status.value}>
                  {status.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="BY POSITION" name="title">
            <Select
              mode="multiple"
              allowClear
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showArrow
              showSearch
              tagRender={this.tagRender}
            >
              {jobTitleList.map((title) => (
                <Option key={title._id} value={title._id}>
                  {title.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="BY LOCATION" name="location">
            <Select
              mode="multiple"
              allowClear
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showArrow
              showSearch
              tagRender={this.tagRender}
            >
              {locationList.map((location) => (
                <Option key={location._id} value={location._id}>
                  {location.name}
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
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default FilterForm;
