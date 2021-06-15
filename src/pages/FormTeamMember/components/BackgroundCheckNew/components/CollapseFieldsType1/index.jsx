/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Collapse, Checkbox } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

@connect(({ candidateInfo }) => ({
  candidateInfo,
}))
class CollapseFieldsType1 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
      indeterminate: true,
      checkAll: false,
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

  render() {
    const { checkedList } = this.state;
    const { checkBoxesData = [], disabled = false } = this.props;
    const checkBoxes1 = checkBoxesData.filter(
      (data) => data.alias.substr(data.alias.length - 1) === '*',
    );
    const checkBoxes2 = checkBoxesData.filter(
      (data) => data.alias.substr(data.alias.length - 1) !== '*',
    );

    return (
      <div className={styles.CollapseFieldsType1}>
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
              {checkBoxes1.map((data) => (
                <Checkbox
                  disabled={data.alias.substr(data.alias.length - 1) === '*'}
                  value={data.alias}
                >
                  {data.alias}
                </Checkbox>
              ))}
              {checkBoxes2.map((data) => (
                <Checkbox value={data.alias}>{data.alias}</Checkbox>
              ))}
            </CheckboxGroup>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default CollapseFieldsType1;
