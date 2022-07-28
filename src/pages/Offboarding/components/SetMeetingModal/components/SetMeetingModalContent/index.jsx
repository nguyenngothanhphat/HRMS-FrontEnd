import { Col, DatePicker, Form, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import { DATE_FORMAT_YMD } from '@/constants/dateFormat';
import { DATE_FORMAT } from '@/constants/offboarding';
import { getEmployeeName } from '@/utils/offboarding';
import styles from './index.less';

const SetMeetingModalContent = ({
  dispatch,
  employee = {},
  partnerRole = '',
  onFinish = () => {},
  offboarding = {},
  selectedDate = '',
  loadingFetchTimeInDateEffect = false,
}) => {
  const [form] = Form.useForm();
  const { generalInfoInfo = {}, titleInfo = {} } = employee || {};
  const { hourList = [] } = offboarding;

  const disabledDate = (current) => {
    const customDate = moment().format(DATE_FORMAT_YMD);
    return current && current < moment(customDate, DATE_FORMAT_YMD);
  };

  const disablePastHour = (obj) => {
    return (
      moment(obj.startTime).day() === moment().day() &&
      moment(obj.startTime).hour() <= moment().hour()
    );
  };

  const onDateChange = (date) => {
    form.setFieldsValue({
      time: null,
    });
    dispatch({
      type: 'offboarding/getTimeInDateEffect',
      payload: {
        date: moment(date).format(DATE_FORMAT_YMD),
      },
    });
  };

  useEffect(() => {
    if (selectedDate) {
      onDateChange(selectedDate || moment());
      form.setFieldsValue({
        date: moment(selectedDate || moment()),
      });
    }
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
                format={DATE_FORMAT}
                placeholder="Select the date"
                onChange={onDateChange}
                disabledDate={disabledDate}
                allowClear={false}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="time" label="Time" rules={[{ required: true }]}>
              <Select
                placeholder="Select the time"
                loading={loadingFetchTimeInDateEffect}
                disabled={loadingFetchTimeInDateEffect}
              >
                {hourList
                  .filter((x) => !disablePastHour(x))
                  .map((x) => (
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

export default connect(({ offboarding, loading }) => ({
  offboarding,
  loadingFetchTimeInDateEffect: loading.effects['offboarding/getTimeInDateEffect'],
}))(SetMeetingModalContent);
