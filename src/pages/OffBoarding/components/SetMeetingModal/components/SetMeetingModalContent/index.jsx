import { Col, DatePicker, Form, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { dateFormat, getEmployeeName } from '@/utils/offboarding';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import styles from './index.less';

const SetMeetingModalContent = ({
  dispatch,
  employee = {},
  partnerRole = '',
  onFinish = () => {},
  offboarding = {},
  selectedDate = '',
}) => {
  const [form] = Form.useForm();
  const { generalInfoInfo = {}, titleInfo = {} } = employee || {};
  const { hourList = [] } = offboarding;

  const disabledDate = (current) => {
    const customDate = moment().format('YYYY-MM-DD');
    return current && current < moment(customDate, 'YYYY-MM-DD');
  };

  const onDateChange = (date) => {
    dispatch({
      type: 'offboarding/getTimeInDateEffect',
      payload: {
        date: moment(date).format('YYYY-MM-DD'),
      },
    });
  };

  useEffect(() => {
    onDateChange(selectedDate || moment());
    form.setFieldsValue({
      date: moment(selectedDate || moment()),
    });
  }, [selectedDate]);

  return (
    <div className={styles.SetMeetingModalContent}>
      <div className={styles.employeeName}>
        <p>{partnerRole} Name</p>
        <CustomEmployeeTag
          name={getEmployeeName(generalInfoInfo)}
          title={titleInfo?.name}
          avatar={generalInfoInfo?.avatar}
          userId={generalInfoInfo?.userId}
        />
      </div>
      <Form
        layout="vertical"
        name="basic"
        form={form}
        id="myForm"
        preserve={false}
        onFinish={onFinish}
      >
        <Row align="middle" gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker
                format={dateFormat}
                placeholder="Select the date"
                onChange={onDateChange}
                disabledDate={disabledDate}
                allowClear={false}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="time" label="Time" rules={[{ required: true }]}>
              <Select placeholder="Select the time">
                {hourList.map((x) => (
                  <Select.Option value={x.startTime} disabled={x.disabled}>
                    {x.time}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(({ offboarding }) => ({ offboarding }))(SetMeetingModalContent);
