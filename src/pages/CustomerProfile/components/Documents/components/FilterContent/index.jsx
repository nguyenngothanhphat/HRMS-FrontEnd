import { Col, DatePicker, Form, Row, Select } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import style from './index.less';
import DebounceSelect from '@/components/DebounceSelect';
import { removeEmptyFields } from '@/utils/utils';

const FilterContent = (props) => {
  const { onFilter = () => {}, documentType, filter = {}, dispatch } = props;
  const [startDateState, setStartDateState] = useState('');
  const [endDateState, setEndDateState] = useState('');
  const [form] = Form.useForm();

  const onEmployeeSearch = (value) => {
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return dispatch({
      type: 'customerManagement/fetchEmployeeList',
      payload: {
        name: value,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfo?.legalName,
        value: user.generalInfo?.legalName,
      }));
    });
  };

  const disabledDate = (currentDate, date, type) => {
    if (type === 'toDate') {
      return currentDate && currentDate < moment(date).add(1, 'days');
    }
    return currentDate && currentDate > moment(date);
  };

  const onChangeDate = (value, type) => {
    if (type === 'fromDate') {
      setStartDateState(value);
    } else {
      setEndDateState(value);
    }
  };

  const onFinishDebounce = debounce((values) => {
    onFilter(values);
  }, 800);

  const onValuesChange = (changedValues, allValues) => {
    const valueTemp = removeEmptyFields(allValues);
    onFinishDebounce(valueTemp);
  };

  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

  return (
    <div className={style.FilterContent}>
      <Form layout="vertical" name="filter" form={form} onValuesChange={onValuesChange}>
        <Form.Item label="By Type" name="byType">
          <Select
            // mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select"
          >
            {documentType.map((item) => (
              <Select.Option key={item.id}>{item.type_name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="By uploaded by" name="byUpload">
          <DebounceSelect
            placeholder="Please select"
            fetchOptions={onEmployeeSearch}
            showSearch
            allowClear
            mode="multiple"
          />
        </Form.Item>
        <Form.Item label="By Uploaded On">
          <Row gutter={24}>
            <Col span={11}>
              <Form.Item name="fromDate">
                <DatePicker
                  onChange={(val) => onChangeDate(val, 'fromDate')}
                  disabledDate={(currentDate) =>
                    disabledDate(currentDate, endDateState, 'fromDate')}
                  format={DATE_FORMAT_MDY}
                />
              </Form.Item>
            </Col>
            <Col span={2}>
              <p
                style={{
                  fontSize: 13,
                  marginTop: 10,
                }}
              >
                to
              </p>
            </Col>
            <Col span={11}>
              <Form.Item name="toDate">
                <DatePicker
                  onChange={(val) => onChangeDate(val, 'toDate')}
                  disabledDate={(currentDate) =>
                    disabledDate(currentDate, startDateState, 'toDate')}
                  format={DATE_FORMAT_MDY}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(() => ({}))(FilterContent);
