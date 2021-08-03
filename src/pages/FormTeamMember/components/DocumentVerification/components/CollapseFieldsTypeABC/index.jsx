/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Collapse, Checkbox, Input, Form, Button, Row, Col, notification } from 'antd';
import { PlusOutlined, MinusOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

@connect(({ candidateInfo }) => ({
  candidateInfo,
}))
class CollapseFieldsTypeABC extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      visible: true,
      typeSelected: '',
    };
  }

  componentDidMount = () => {
    const {
      candidateInfo: { tempData: { identityProof = {}, addressProof = {}, educational = {} } } = {},
      item = {},
    } = this.props;

    const { data = [] } = item;
    let checkedList = [];
    const { type = '' } = item;
    switch (type) {
      case 'A':
        checkedList = identityProof.checkedList;
        break;
      case 'B':
        checkedList = addressProof.checkedList;
        break;
      case 'C':
        checkedList = educational.checkedList;
        break;
      default:
        break;
    }

    // handle check all checkbox
    let checkAll = false;
    if (checkedList.length === data.length) {
      checkAll = true;
    }

    this.setState({
      checkedList,
      indeterminate: false,
      checkAll,
    });
  };

  onChange = (list) => {
    const { checkBoxesData = [], handleChange = () => {}, item = {} } = this.props;
    this.setState({
      checkedList: list,
      indeterminate: !!list.length && list.length < checkBoxesData.length,
      checkAll: list.length === checkBoxesData.length,
    });
    handleChange(list, item);
  };

  onCheckAllChange = (e) => {
    const { checkBoxesData = [], handleCheckAll = () => {}, item = {} } = this.props;
    const checkBoxes1 = checkBoxesData.filter(
      (data) => data.alias.substr(data.alias.length - 1) === '*',
    );
    const checkBoxes2 = checkBoxesData.filter(
      (data) => data.alias.substr(data.alias.length - 1) !== '*',
    );
    e.stopPropagation();

    const checkedList1 = checkBoxes1.map((data) => data.alias);
    const checkedList2 = e.target.checked ? checkBoxes2.map((data) => data.alias) : [];

    const checkedList = checkedList1.concat(checkedList2);

    this.setState({
      checkedList,
      indeterminate: false,
      checkAll: e.target.checked,
    });

    handleCheckAll(e, checkedList, item);
  };

  renderHeader = () => {
    const { title = '', disabled = false } = this.props;

    const { indeterminate, checkAll } = this.state;
    return (
      <div className={styles.header}>
        <Checkbox
          checked={checkAll}
          indeterminate={indeterminate}
          disabled={disabled}
          onClick={(event) => this.onCheckAllChange(event)}
        />
        <span className={styles.titleText}>{title}</span>
        <span className={styles.noteText}>
          [All Mandatory documents will need to be submitted. One or more of the optional documents
          can be submitted]
        </span>
      </div>
    );
  };

  handleClick = (type) => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      typeSelected: type,
    });
  };

  handleCancel = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  camelize = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  };

  onSubmit = (values) => {
    const { visible, typeSelected } = this.state;
    const { addNewField, documentChecklistSetting = [], type = '' } = this.props;
    this.setState({
      visible: !visible,
    });

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
    } else addNewField(values.nameOfField, typeSelected);
    this.formRef.current.resetFields();
  };

  handleRemove = (key, type) => {
    const { handleRemoveDocument = () => {} } = this.props;
    handleRemoveDocument(key, type);
  };

  render() {
    const { checkedList, visible } = this.state;
    const { item: { data = [] } = {}, disabled = false, type } = this.props;
    // const checkBoxes1 = checkBoxesData.filter(
    //   (data) => data.alias.substr(data.alias.length - 1) === '*',
    // );
    // const checkBoxes2 = checkBoxesData.filter(
    //   (data) => data.alias.substr(data.alias.length - 1) !== '*',
    // );

    return (
      <div className={styles.CollapseFieldsTypeABC}>
        <Collapse
          accordion
          expandIconPosition="right"
          defaultActiveKey="1"
          expandIcon={(props) => {
            return props.isActive ? (
              <MinusOutlined className={styles.alternativeExpandIcon} />
            ) : (
              <PlusOutlined className={styles.alternativeExpandIcon} />
            );
          }}
        >
          <Panel header={this.renderHeader()} key="1">
            <CheckboxGroup
              direction="vertical"
              onChange={this.onChange}
              value={checkedList}
              disabled={disabled}
              className={styles.checkBoxesGroup}
            >
              {/* {data.map((data) => (
                <Checkbox
                  disabled={data.alias.substr(data.alias.length - 1) === '*'}
                  value={data.alias}
                >
                  {data.alias}
                </Checkbox>
              ))} */}
              {data.map((val) => {
                return (
                  <Checkbox
                    value={val.alias}
                    disabled={val.alias.substr(val.alias.length - 1) === '*'}
                  >
                    {val.alias}
                    {!disabled && val.new && (
                      <DeleteOutlined
                        onClick={() => this.handleRemove(val.key, type)}
                        className={styles.removeIcon}
                      />
                    )}
                  </Checkbox>
                );
              })}
            </CheckboxGroup>
            <div
              className={
                visible || disabled
                  ? `${styles.addNewType} ${styles.hidden}`
                  : `${styles.addNewType}`
              }
            >
              <div className={styles.addTitle}>
                <p>Add New Field</p>
                <CloseOutlined onClick={this.handleCancel} />
              </div>
              <Form
                ref={this.formRef}
                onFinish={(values) => this.onSubmit(values)}
                layout="vertical"
              >
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
                onClick={() => this.handleClick(type)}
              >
                <PlusOutlined className={styles.plusIcon} />
                <span className={styles.title}>Add New Field</span>
              </div>
            )}
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default CollapseFieldsTypeABC;
