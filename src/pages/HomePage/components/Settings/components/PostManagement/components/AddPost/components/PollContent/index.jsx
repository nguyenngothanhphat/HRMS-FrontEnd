/* eslint-disable react/jsx-props-no-spreading */
import { Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import styles from './index.less';

const PollContent = (props) => {
  const { form } = props;
  const dateFormat = 'YYYY-MM-DD'
  const disabledStartDate = (current) => {
    const endDate = form.getFieldValue('endDateP');
    const currentDate = current ? moment(current).format(dateFormat) : moment().format(dateFormat)
    if (endDate) {
      return (
        moment(currentDate).isBefore(moment().format(dateFormat), 'day') ||
        moment(currentDate).isAfter(moment(endDate).format(dateFormat), 'day')
      );
    }
    return moment(currentDate).isBefore(moment().format(dateFormat), 'day');
  };

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue('startDateP');
    const currentDate = current ? moment(current).format(dateFormat) : moment().format(dateFormat)
    if (startDate) {
      return moment(currentDate).isBefore(moment(startDate).format(dateFormat), 'day');
    }
    return moment(currentDate).isBefore(moment().format(dateFormat), 'day');
  };

  return (
    <div className={styles.PollContent}>
      <Form.Item
        label="Question"
        name="questionP"
        rules={[
          {
            required: true,
            message: 'Required field!',
          },
        ]}
      >
        <Input.TextArea
          placeholder="Enter the question"
          autoSize={{
            minRows: 3,
            maxRows: 5,
          }}
          maxLength={144}
          showCount={{
            formatter: ({ count, maxLength }) => {
              return `Character Limit: ${count}/${maxLength}`;
            },
          }}
        />
      </Form.Item>
      <Form.List name="responsesP">
        {(fields) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                key={field.key}
                label={`Response ${index + 1} ${index === 0 ? '(Add upto 3 responses)' : ''}`}
                name={[field.name, 'response']}
                rules={[
                  {
                    required: true,
                    message: 'Required field!',
                  },
                ]}
              >
                <Input.TextArea
                  placeholder={`Enter the response ${index + 1}`}
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                  maxLength={144}
                  showCount={{
                    formatter: ({ count, maxLength }) => {
                      return `Character Limit: ${count}/${maxLength}`;
                    },
                  }}
                />
              </Form.Item>
            ))}
          </>
        )}
      </Form.List>
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={12}>
          <Form.Item
            label="Start Date"
            name="startDateP"
            rules={[
              {
                required: true,
                message: 'Required field!',
              },
            ]}
          >
            <DatePicker
              placeholder="Enter Start Date"
              format="Do MMM YYYY"
              disabledDate={disabledStartDate}
            />
          </Form.Item>
        </Col>
        <Col xs={24} xl={12}>
          <Form.Item
            label="End Date"
            name="endDateP"
            rules={[
              {
                required: true,
                message: 'Required field!',
              },
            ]}
          >
            <DatePicker
              placeholder="Enter End Date"
              format="Do MMM YYYY"
              disabledDate={disabledEndDate}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default PollContent;
