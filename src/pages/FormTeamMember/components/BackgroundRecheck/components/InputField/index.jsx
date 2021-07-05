import React from 'react';
import { Typography, Row, Col, Form, Input, DatePicker } from 'antd';
import Checkbox from 'antd/es/checkbox';
import moment from 'moment';
import style from './index.less';

const dateFormat = 'MM.DD.YY';

const InputField = ({
  index = '',
  item: { employer = '', startDate = '', endDate = '', toPresent = false } = {},
}) => {
  return (
    <div className={style.InputField}>
      <span className={style.text}>Employer {index + 1} Details</span>

      <Form
        labelCol={24}
        wrapperCol={24}
        layout="vertical"
        initialValues={{
          employer,
          startDate: startDate ? moment(startDate) : '',
          endDate: endDate ? moment(endDate) : '',
          toPresent,
        }}
      >
        <Row gutter={[48, 0]} className={style.form}>
          <Col span={24}>
            <Form.Item label="Name of the employer*" name="employer">
              <Input className={style.input} disabled />
            </Form.Item>
          </Col>

          <Col span={24} className={style.checkBox}>
            <Checkbox disabled defaultChecked={toPresent}>
              Currently work in this role
            </Checkbox>
          </Col>

          <Col span={12}>
            <Form.Item label="Start Date*" name="startDate">
              <DatePicker
                placeholder="Start Date"
                format={dateFormat}
                className={style.inputDate}
                disabled
              />
            </Form.Item>
          </Col>
          {!toPresent && (
            <Col span={12}>
              <Form.Item label="End Date*" name="endDate">
                <DatePicker
                  placeholder="End Date"
                  className={style.inputDate}
                  format={dateFormat}
                  disabled
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>

      <Typography.Text className={style.bottomTitle}>Proof of employment</Typography.Text>
    </div>
  );
};

export default InputField;
