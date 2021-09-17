import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import styles from './index.less';

const { Option } = Select;
class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
    return (
      <div className={styles.filterForm}>
        <Form layout="horizontal" className={styles.form}>
          <Form.Item label="BY STATUS">
            <Select
              allowClear
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showArrow
              showSearch
            >
              {arrStatus.map((status) => (
                <Option value={status.value}>{status.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="BY POSITION">
            <Select mode="multiple">
              <Option>All</Option>
            </Select>
          </Form.Item>
          <Form.Item label="BY LOCATION">
            <Select mode="multiple">
              <Option>All</Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default FilterForm;
