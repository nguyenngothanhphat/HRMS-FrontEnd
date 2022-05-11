import { CloseOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Collapse, Form, Input, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

const CollapseFieldsTypeABC = (props) => {
  const {
    newCandidateForm: {
      tempData: { identityProof = {}, addressProof = {}, educational = {} },
    } = {},
    item = {},
    item: { data = [], type = '', name = '' } = {},
    handleChange = () => {},
    // visible = false,
    addNewField,
    documentChecklistSetting = [],
    handleRemoveDocument = () => {},
    disabled = false,
  } = props;

  const [form] = Form.useForm();

  const [checkedList, setCheckedList] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let checkedListTemp = [];
    switch (type) {
      case 'A':
        checkedListTemp = identityProof.checkedList;
        break;
      case 'B':
        checkedListTemp = addressProof.checkedList;
        break;
      case 'C':
        checkedListTemp = educational.checkedList;
        break;
      default:
        break;
    }

    setCheckedList(checkedListTemp);
  }, []);

  const onChange = (list) => {
    setCheckedList(list);
    handleChange(list, item);
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <span className={styles.titleText}>
          Type {type}: {name} ({checkedList.length} selected)
        </span>
      </div>
    );
  };

  const handleClick = () => {
    setVisible(!visible);
  };

  const handleCancel = () => {
    setVisible(!visible);
  };

  const onSubmit = (values) => {
    if (values.nameOfField) {
      setVisible(!visible);

      let check = false;
      documentChecklistSetting.forEach((doc) => {
        if (doc.type === type) {
          const findObj = doc.data.filter((d) => d.alias === values.nameOfField);
          if (findObj.length > 0) {
            check = true;
          }
        }
      });

      if (check) {
        notification.error({ message: 'This field name is duplicated' });
      } else addNewField(values.nameOfField, type);

      form.resetFields();
    }
  };

  const handleRemove = (key) => {
    handleRemoveDocument(key, type);
  };

  return (
    <Col span={24}>
      <div className={styles.CollapseFieldsTypeABC}>
        <Collapse
          accordion
          expandIconPosition="right"
          defaultActiveKey="1"
          expandIcon={({ isActive }) => {
            return isActive ? (
              <MinusOutlined className={styles.alternativeExpandIcon} />
            ) : (
              <PlusOutlined className={styles.alternativeExpandIcon} />
            );
          }}
        >
          <Panel header={renderHeader()} key="1">
            <CheckboxGroup
              direction="vertical"
              onChange={onChange}
              value={checkedList}
              disabled={disabled}
              className={styles.checkBoxesGroup}
            >
              {data.map((val) => {
                return (
                  <Checkbox
                    value={val.alias}
                    disabled={val.alias.substr(val.alias.length - 1) === '*'}
                  >
                    {val.alias}
                    {!disabled && val.new && (
                      <DeleteOutlined
                        onClick={() => handleRemove(val.key, type)}
                        className={styles.removeIcon}
                      />
                    )}
                  </Checkbox>
                );
              })}
            </CheckboxGroup>
            {!disabled && data.length > 0 && <div className={styles.addBtn__divider} />}
            <div
              className={
                visible || disabled
                  ? `${styles.addNewType} ${styles.hidden}`
                  : `${styles.addNewType}`
              }
            >
              <div className={styles.addTitle}>
                <p>Add New Field</p>
                <CloseOutlined onClick={handleCancel} />
              </div>
              <Form form={form} onFinish={onSubmit} layout="vertical">
                <Form.Item label="Name of the field" name="nameOfField">
                  <Input placeholder="Enter name of the field" />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit">Submit</Button>
                </Form.Item>
              </Form>
            </div>
            {!disabled && (
              <div
                className={!visible ? `${styles.hidden}` : `${styles.addBtn}`}
                onClick={() => handleClick()}
              >
                <div className={styles.addBtn__text}>
                  <PlusOutlined className={styles.plusIcon} />
                  <span className={styles.title}>Add New Field</span>
                </div>
              </div>
            )}
          </Panel>
        </Collapse>
      </div>
    </Col>
  );
};

export default connect(({ newCandidateForm }) => ({
  newCandidateForm,
}))(CollapseFieldsTypeABC);
