import React from 'react';
import { Typography, Row, Col, Form, Input } from 'antd';
import style from './index.less';

const InputField = ({
  onValuesChange,
  documentChecklistSetting,
  processStatus,
  // handleValidation,
}) => {
  // const [validation, setValidation] = useState(false);
  const { employer } = documentChecklistSetting[3];
  // const onChange = (e) => {
  //   console.log('e', e.target.value);
  //   if (e.target.value.length > 0) {
  //     setValidation(true);
  //   }
  // };
  return (
    <div className={style.InputField}>
      <Typography.Text className={style.text}>Employer 1 Details</Typography.Text>
      <Row gutter={[48, 0]} className={style.form}>
        <Col span={12} sm={24} md={24} lg={12} xl={12} className={style.colLeft}>
          <Form
            labelCol={24}
            wrapperCol={24}
            layout="vertical"
            onValuesChange={(value) => onValuesChange(value)}
            initialValues={{ employer }}
          >
            <Form.Item
              label="Name of the employer*"
              name="employer"
              rules={[{ required: true, message: `'Please input your full name!'` }]}
            >
              <Input
                className={style.input}
                disabled={processStatus === 'SENT-PROVISIONAL-OFFER'}
                // onChange={onChange}
                // onFocus={onFocus}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={12} sm={24} md={24} lg={12} xl={12} className={style.colRight}>
          <Form labelCol={24} wrapperCol={24} layout="vertical">
            <Form.Item label="Work Duration (In year, months, days)">
              <Input className={style.inputDate} disabled="true" />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Typography.Text className={style.bottomTitle}>Proof of employment</Typography.Text>
    </div>
  );
};

export default InputField;
