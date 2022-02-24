/* eslint-disable react/jsx-props-no-spreading */
import { Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import styles from './index.less';

const PollContent = (props) => {
  const { form } = props;

  const disabledStartDate = (current) => {
    return current && moment(current).isAfter(moment(form.getFieldValue('endDateP')), 'day');
  };

  const disabledEndDate = (current) => {
    return current && moment(current).isBefore(moment(form.getFieldValue('startDateP')), 'day');
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
