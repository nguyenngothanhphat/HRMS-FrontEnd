/* eslint-disable react/jsx-curly-newline */
import { Col, DatePicker, Form, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';

import { debounce, isEmpty } from 'lodash';
import CalendarIcon from '@/assets/calendar_icon.svg';
import { NEW_PROCESS_STATUS } from '@/constants/onboarding';

import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { removeEmptyFields } from '@/utils/utils';
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
    label: 'Reference Verification',
    value: NEW_PROCESS_STATUS.REFERENCE_VERIFICATION,
  },
  {
    label: 'Document Checklist',
    value: NEW_PROCESS_STATUS.DOCUMENT_CHECKLIST_VERIFICATION,
  },
];

const FilterForm = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    currentStatus = '',
    filter = {},
    onFilter = () => {},
    jobTitleList = [],
    locationList = [],
  } = props;

  useEffect(() => {
    dispatch({
      type: 'onboarding/fetchJobTitleList',
      payload: {},
    });

    dispatch({
      type: 'onboarding/fetchLocationList',
      payload: {},
    });
  }, []);

  const onFinishDebounce = debounce((values) => {
    onFilter(values);
  }, 700);

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(removeEmptyFields(allValues));
  };

  // clear values
  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

  const fieldsArray = [
    {
      label: 'BY POSITION',
      name: 'title',
      placeholder: 'Select position',
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
    <div className={styles.FilterForm}>
      <Form layout="vertical" name="filter" onValuesChange={onValuesChange} form={form}>
        <Form.Item label="By status" name="processStatus">
          <Select
            showArrow
            showSearch
            filterOption={(input, option) => {
              return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            mode="multiple"
            placeholder="Select status"
            disabled={currentStatus !== 'ALL'}
            allowClear
          >
            {arrStatus.map((option) => {
              return (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

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
              placeholder={field.placeholder}
            >
              {field.optionArray.map((option) => {
                return (
                  <Option key={option._id} value={option._id}>
                    {option.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        ))}

        <Form.Item label="By Date Of Joining">
          <Row>
            <Col span={11}>
              <Form.Item name="fromDate">
                <DatePicker
                  format={DATE_FORMAT_MDY}
                  placeholder="From Date"
                  suffixIcon={
                    <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                  }
                />
              </Form.Item>
            </Col>
            <Col span={2} className={styles.separator}>
              <span>to</span>
            </Col>
            <Col span={11}>
              <Form.Item name="toDate">
                <DatePicker
                  format={DATE_FORMAT_MDY}
                  placeholder="To Date"
                  suffixIcon={
                    <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(
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
)(FilterForm);
