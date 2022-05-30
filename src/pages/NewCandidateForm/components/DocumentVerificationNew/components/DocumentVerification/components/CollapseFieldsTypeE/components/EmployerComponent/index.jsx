/* eslint-disable no-nested-ternary */
import { CloseOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;

const EmployerComponent = (props) => {
  const [form] = Form.useForm();
  const {
    data = [],
    index = 0,
    employer = '',
    onRemove = () => {},
    disabled = false,
    listLength = 0,
    handleChangeEmployer = () => {},
    handleCheck = () => {},
  } = props;

  const [checkedList, setCheckedList] = React.useState([]);

  const handleCheckList = () => {
    let checkedListTemp = data.filter((val) => val.value || val.required);
    checkedListTemp = checkedListTemp.map((val) => val.alias);
    setCheckedList(checkedListTemp);
  };

  useEffect(() => {
    handleCheckList();
  }, [JSON.stringify(data)]);

  const onChangeCheckBox = (list) => {
    setCheckedList(list);
    handleCheck(list, index);
  };

  const onChangeEmployer = (event) => {
    const { value = '' } = event.target;
    handleChangeEmployer(value, index);
  };

  return (
    <div className={styles.EmployerComponent} key={index}>
      <div className={styles.titleBar}>
        <span className={styles.title}>Employer {index + 1} Details</span>
        {!disabled && (
          <CloseOutlined className={styles.deleteIcon} onClick={() => onRemove(index)} />
        )}
      </div>
      <Form
        form={form}
        initialValues={{
          employer,
        }}
      >
        <Row gutter={[5, 0]}>
          <Col span={24}>
            <Form.Item label="Name of the employer*" name="employer">
              <Input
                disabled={disabled}
                onChange={onChangeEmployer}
                className={styles.input}
                placeholder="Name of the employer"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row gutter={[5, 0]}>
        <Col span={24}>
          <div className={styles.title2}>Proof of employment</div>
          <CheckboxGroup
            onChange={(list) => onChangeCheckBox(list)}
            value={checkedList}
            disabled={disabled}
            className={styles.checkBoxesGroup}
          >
            {data.map((x) => (
              <Checkbox disabled={x.required} value={x.alias}>
                {x.alias}
                {x.required && <span className={styles.required}>*</span>}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Col>
      </Row>

      {index + 1 < listLength && <hr className={styles.divider} />}
    </div>
  );
};

export default connect(({ newCandidateForm }) => ({
  newCandidateForm,
}))(EmployerComponent);
