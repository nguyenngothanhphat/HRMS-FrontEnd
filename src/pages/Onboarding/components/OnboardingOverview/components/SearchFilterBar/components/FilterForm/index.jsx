/* eslint-disable react/jsx-curly-newline */
import { Col, DatePicker, Form, Row, Select } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { removeEmptyFields } from '@/utils/utils';
import {
  NEW_PROCESS_STATUS,
  NEW_PROCESS_STATUS_TABLE_NAME,
  ONBOARDING_TABLE_TYPE,
} from '@/constants/onboarding';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import styles from './index.less';

const { Option } = Select;

const FilterForm = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    activeTab = {},
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

  const disableFromDate = (value, compareVar) => {
    const t = form.getFieldValue(compareVar);
    if (!t) return false;
    return value > moment(t);
  };

  const disableToDate = (value, compareVar) => {
    const t = form.getFieldValue(compareVar);
    if (!t) return false;
    return value < moment(t);
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

  const arrStatus = Object.keys(NEW_PROCESS_STATUS).filter(
    (x) =>
      ![
        NEW_PROCESS_STATUS.JOINED,
        NEW_PROCESS_STATUS.OFFER_WITHDRAWN,
        NEW_PROCESS_STATUS.OFFER_REJECTED,
      ].includes(x),
  );

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
            disabled={activeTab.id !== ONBOARDING_TABLE_TYPE.ALL}
            allowClear
          >
            {arrStatus.map((option) => {
              return (
                <Option key={option} value={option}>
                  {NEW_PROCESS_STATUS_TABLE_NAME[option]}
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
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
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
                  disabledDate={(val) => disableFromDate(val, 'toDate')}
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
                  disabledDate={(val) => disableToDate(val, 'fromDate')}
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
