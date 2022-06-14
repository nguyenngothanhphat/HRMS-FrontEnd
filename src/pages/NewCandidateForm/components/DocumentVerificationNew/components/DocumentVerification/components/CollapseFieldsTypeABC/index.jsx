import { CloseOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Collapse, Form, Input, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { camelize, mapType } from '@/utils/newCandidateForm';
import styles from './index.less';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

const CollapseFieldsTypeABC = (props) => {
  const { dispatch, layout: { type = '', name = '' } = {}, items = [], disabled = false } = props;

  const [form] = Form.useForm();

  const [checkedList, setCheckedList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    const checkedListTemp = items.filter((x) => x.value).map((x) => x.alias);
    setCheckedList(checkedListTemp);
    setIndeterminate(!!checkedListTemp.length && checkedListTemp.length < items.length);
    setCheckAll(checkedListTemp.length === items.length);
  }, [JSON.stringify(items)]);

  const onSaveRedux = (result) => {
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        [mapType[type]]: result,
      },
    });
  };

  const onCheckBoxChange = (list) => {
    const result = items.map((x) => {
      return {
        ...x,
        value: list.includes(x.alias),
      };
    });
    onSaveRedux(result);
  };

  const onCheckAllChange = (e) => {
    const selectedItemsTemp = items.map((x) => {
      if (x.required) return x;
      return { ...x, value: e.target.checked };
    });
    onSaveRedux(selectedItemsTemp);
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

  const onSubmit = (values) => {
    const result = [
      ...items,
      {
        alias: values.alias,
        key: camelize(values.alias),
        value: true,
        new: true,
      },
    ];

    onSaveRedux(result);
    setVisible(!visible);
    form.resetFields();
  };

  const handleRemove = (key) => {
    const result = items.filter((x) => x.key !== key);
    onSaveRedux(result);
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
            {items.length > 0 && (
              <div className={styles.checkBoxesGroup}>
                {!disabled && (
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                    disabled={disabled}
                  >
                    Select All
                  </Checkbox>
                )}
                <CheckboxGroup
                  direction="vertical"
                  onChange={onCheckBoxChange}
                  value={checkedList}
                  disabled={disabled}
                >
                  {items.map((val) => {
                    return (
                      <Checkbox value={val.alias} disabled={val.required}>
                        {val.alias}
                        {val.required && <span className={styles.starSymbol}>*</span>}
                        {!disabled && val.new && (
                          <Popconfirm
                            onConfirm={() => handleRemove(val.key)}
                            title="Sure to remove?"
                          >
                            <DeleteOutlined className={styles.removeIcon} />
                          </Popconfirm>
                        )}
                      </Checkbox>
                    );
                  })}
                </CheckboxGroup>
              </div>
            )}

            {!disabled && items.length > 0 && <div className={styles.addBtn__divider} />}

            <div
              className={
                !visible || disabled
                  ? `${styles.addNewType} ${styles.hidden}`
                  : `${styles.addNewType}`
              }
            >
              <div className={styles.addTitle}>
                <p>Add New Field</p>
                <CloseOutlined onClick={() => setVisible(false)} />
              </div>
              <Form form={form} onFinish={onSubmit} layout="vertical">
                <Form.Item label="Name of the field" name="alias">
                  <Input placeholder="Enter name of the field" />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit">Submit</Button>
                </Form.Item>
              </Form>
            </div>
            {!disabled && (
              <div
                className={visible ? `${styles.hidden}` : `${styles.addBtn}`}
                onClick={() => setVisible(true)}
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
