/* eslint-disable react/jsx-props-no-spreading */
import { Col, DatePicker, Form, Input, Row } from 'antd';
import React from 'react';
import styles from './index.less';

const PollContent = () => {
  return (
    <div className={styles.PollContent}>
      <Form.Item label="Question" name="questionP">
        <Input placeholder="Enter the question" />
      </Form.Item>
      <Form.List name="responsesP">
        {(fields) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                label={`Response ${index + 1} ${index === 0 ? '(Add upto 3 responses)' : ''}`}
                name={[field.name, 'response']}
              >
                <Input.TextArea
                  placeholder={`Enter the response ${index + 1}`}
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                />
              </Form.Item>
            ))}
          </>
        )}
      </Form.List>
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={12}>
          <Form.Item label="Start Date" name="startDateP">
            <DatePicker placeholder="Enter Start Date" />
          </Form.Item>
        </Col>
        <Col xs={24} xl={12}>
          <Form.Item label="End Date" name="endDateP">
            <DatePicker placeholder="Enter End Date" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default PollContent;
