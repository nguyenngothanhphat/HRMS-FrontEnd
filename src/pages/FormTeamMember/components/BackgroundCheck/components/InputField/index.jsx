/* eslint-disable no-nested-ternary */
import React from 'react';
import { Typography, Row, Col, Form, Input } from 'antd';
import { isUndefined } from 'lodash';
import style from './index.less';

const InputField = ({
  onValuesChange,
  documentChecklistSetting,
  processStatus,
  checkValidation,
  tempData,
  // handleValidation,
}) => {
  // const [validation, setValidation] = useState(false);
  const { employer } = documentChecklistSetting[3];
  // console.log('documentCheck', documentChecklistSetting[3]);
  const employer1 = tempData.employer;
  // console.log('processStatus', processStatus === 'DRAFT', employer1);
  // const onChange = (e) => {
  //   console.log('e', e.target.value);
  //   if (e.target.value.length > 0) {
  //     setValidation(true);
  //   }
  // };
  return (
    <div className={style.InputField}>
      <Typography.Text className={style.text}>Employer Details</Typography.Text>
      <Row gutter={[48, 0]} className={style.form}>
        {processStatus === 'SENT-PROVISIONAL-OFFER' ? (
          <>
            <Col span={12} sm={24} md={24} lg={12} xl={12} className={style.colLeft}>
              <Form
                labelCol={24}
                wrapperCol={24}
                layout="vertical"
                onValuesChange={(value) => onValuesChange(value)}
                initialValues={{ employer }}
              >
                <Form.Item label="Name of the employer*" name="employer">
                  <Input
                    className={
                      isUndefined(checkValidation) || checkValidation === true
                        ? style.input
                        : style.input1
                    }
                    disabled
                  />
                </Form.Item>
                <Typography.Text
                  className={
                    isUndefined(checkValidation) || checkValidation === true ? style.s : style.s1
                  }
                >
                  Please input employer!
                </Typography.Text>
              </Form>
            </Col>
            <Col span={12} sm={24} md={24} lg={12} xl={12} className={style.colRight}>
              <Form labelCol={24} wrapperCol={24} layout="vertical">
                <Form.Item label="Work Duration (In year, months, days)">
                  <Input className={style.inputDate} disabled="true" />
                </Form.Item>
              </Form>
            </Col>
          </>
        ) : processStatus === 'DRAFT' ? (
          <>
            <Col span={12} sm={24} md={24} lg={12} xl={12} className={style.colLeft}>
              <Form
                labelCol={24}
                wrapperCol={24}
                layout="vertical"
                onValuesChange={(value) => onValuesChange(value)}
                initialValues={{ employer: employer1 }}
              >
                <Form.Item label="Name of the employer*" name="employer">
                  <Input
                    className={
                      isUndefined(checkValidation) || checkValidation === true
                        ? style.input
                        : style.input1
                    }
                  />
                </Form.Item>
                <Typography.Text
                  className={
                    isUndefined(checkValidation) || checkValidation === true ? style.s : style.s1
                  }
                >
                  Please input employer!
                </Typography.Text>
              </Form>
            </Col>
            <Col span={12} sm={24} md={24} lg={12} xl={12} className={style.colRight}>
              <Form labelCol={24} wrapperCol={24} layout="vertical">
                <Form.Item label="Work Duration (In year, months, days)">
                  <Input className={style.inputDate} disabled="true" />
                </Form.Item>
              </Form>
            </Col>
          </>
        ) : null}
      </Row>
      <Typography.Text className={style.bottomTitle}>Proof of employment</Typography.Text>
    </div>
  );
};

export default InputField;
