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
    remove = () => {},
    // processStatus = '',
    disabled = false,
    listLength = 0,
    // workDuration = {},
    dispatch,
    handleChange = () => {},
    handleCheck = () => {},
  } = props;

  const [checkedList, setCheckedList] = React.useState([]);

  const handleCheckList = () => {
    let checkedListTemp = data.filter((val) => val.alias && val.value === true);
    checkedListTemp = checkedList.map((val) => val.alias);
    setCheckedList(checkedListTemp);
  };

  useEffect(() => {
    if (employer) {
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          checkValidation: true,
        },
      });
    }

    handleCheckList();
  }, []);

  useEffect(() => {
    handleCheckList();
  }, [JSON.stringify(data)]);

  const onChange = (list) => {
    setCheckedList(list);
    handleCheck(data, list, index);
  };

  const employerNameHandle = (event) => {
    const { value = '' } = event.target;
    handleChange(value, index);
  };

  return (
    <div className={styles.EmployerComponent} key={index}>
      <div className={styles.titleBar}>
        <span className={styles.title}>Employer {index + 1} Details</span>
        {!disabled && <CloseOutlined className={styles.deleteIcon} onClick={() => remove(index)} />}
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
                onChange={employerNameHandle}
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
            onChange={(list) => onChange(list)}
            // options={data.map((data) => data.alias)}
            value={checkedList}
            disabled={disabled}
            className={styles.checkBoxesGroup}
          >
            {data.map((field) => (
              <Checkbox
                disabled={field.alias.substr(field.alias.length - 1) === '*'}
                value={field.alias}
              >
                {field.alias}
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
