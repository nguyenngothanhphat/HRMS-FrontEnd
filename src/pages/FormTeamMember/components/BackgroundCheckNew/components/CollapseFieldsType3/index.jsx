/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Collapse, Checkbox, Input } from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

@connect(({ candidateInfo }) => ({
  candidateInfo,
}))
class CollapseFieldsType3 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      documentName: '',
    };
  }

  // componentDidMount = () => {
  //   const { candidateInfo: { tempData: { documentChecklistSetting = [] } } = {}, item = {} } =
  //     this.props;

  //   const find = documentChecklistSetting.find((val) => val.type === 'D');
  //   const { data = [] } = item;

  //   // handle check all checkbox
  //   let checkAll = false;
  //   if (data.length === find.data.length) {
  //     checkAll = true;
  //   }

  //   this.setState({
  //     checkedList: data,
  //     indeterminate: false,
  //     checkAll,
  //   });
  // };

  handleAddDocumentName = () => {
    const { documentName } = this.state;
    const { addDocumentName = () => {} } = this.props;
    addDocumentName(documentName);
    this.setState({
      documentName: '',
    });
  };

  handleRemoveDocumentName = (index) => {
    const { removeDocumentName = () => {} } = this.props;
    removeDocumentName(index);
  };

  // onChange = (list) => {
  //   console.log('list', list);
  //   const { handleChange = () => {}, item = {} } = this.props;
  //   this.setState({
  //     checkedList: list,
  //     indeterminate: !!list.length && list.length < item.data.length,
  //     checkAll: list.length === item.data.length,
  //   });
  //   handleChange(list, item);
  // };

  renderHeader = () => {
    const { title = '', disabled = false } = this.props;
    return (
      <div className={styles.header}>
        <Checkbox
          checked
          disabled={disabled}
          // onClick={(event) => this.onCheckAllChange(event)}
        />
        <span className={styles.titleText}>{title}</span>
        <span className={styles.noteText}>
          [All Mandatory documents will need to be submitted. One or more of the optional documents
          can be submitted]
        </span>
      </div>
    );
  };

  render() {
    const { item: { data = [] } = {}, disabled = false } = this.props;
    const { documentName } = this.state;

    const checkAll = data.map((val) => val.alias);
    return (
      <div className={styles.CollapseFieldsType3}>
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
            {data.length > 0 && (
              <CheckboxGroup
                direction="vertical"
                // onChange={this.onChange}
                value={checkAll}
                disabled={disabled}
                onChange={() => {}}
                className={styles.checkBoxesGroup}
              >
                {data.map((val, index) => (
                  <Checkbox value={val.alias}>
                    {val.alias}

                    {!disabled && (
                      <DeleteOutlined
                        onClick={() => this.handleRemoveDocumentName(index)}
                        className={styles.removeIcon}
                      />
                    )}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            )}
            {!disabled && (
              <div className={styles.addDocumentName}>
                <Input
                  onChange={(e) => {
                    this.setState({ documentName: e.target.value });
                  }}
                  placeholder="Document Name"
                  value={documentName}
                />
                <PlusOutlined
                  onClick={documentName ? this.handleAddDocumentName : () => {}}
                  className={styles.plusIcon}
                />
              </div>
            )}
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default CollapseFieldsType3;
