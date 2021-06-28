import React, { useState } from 'react';
import { Typography, Row, Col, Form, Input, DatePicker } from 'antd';
import Checkbox from 'antd/es/checkbox';
import style from './index.less';

const dateFormat = 'MM.DD.YY';

const InputField = ({
  onValuesChange,
  index = '',
  item: { employer = '', startDate = '', endDate = '' } = {},
  currentCompany, // index
  handleToPresent = () => {},
}) => {
  const [toPresent, setToPresent] = useState(false);

  const onCheckboxChange = (e) => {
    const {
      target: { checked = false },
    } = e;
    onValuesChange(checked, 'toPresent');
    setToPresent(checked);
    handleToPresent(index, checked);
  };

  return (
    <div className={style.InputField}>
      <Typography.Text className={style.text}>Employer {index + 1} Details</Typography.Text>

      <Form
        labelCol={24}
        wrapperCol={24}
        layout="vertical"
        initialValues={{ employer, startDate, endDate, toPresent }}
      >
        <Row gutter={[48, 0]} className={style.form}>
          <Col span={24}>
            <Form.Item label="Name of the employer*" name="employer">
              <Input className={style.input} disabled />
            </Form.Item>
          </Col>

          <Col span={24} className={style.checkBox}>
            <Checkbox
              disabled={currentCompany !== index && currentCompany}
              value={toPresent}
              onChange={(val) => onCheckboxChange(val)}
            >
              Currently work in this role
            </Checkbox>
          </Col>

          <Col span={12}>
            <Form.Item label="Start Date*" name="startDate">
              <DatePicker
                placeholder="Start Date"
                format={dateFormat}
                className={style.inputDate}
                onChange={(val) => onValuesChange(val, 'startDate')}
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
                  onChange={(val) => onValuesChange(val, 'endDate')}
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
