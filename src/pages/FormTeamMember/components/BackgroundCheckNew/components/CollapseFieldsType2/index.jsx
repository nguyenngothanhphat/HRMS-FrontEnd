/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Collapse, Checkbox } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import EmployerComponent from './EmployerComponent';
import styles from './index.less';

const { Panel } = Collapse;

@connect(({ candidateInfo }) => ({
  candidateInfo,
}))
class CollapseFieldsType2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      indeterminate: true,
      checkAll: false,
      orderNumber: 1,
      children: [],
    };
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        componentsNumberCount: [],
      },
    });
  };

  componentDidMount = () => {
    const {
      candidateInfo: {
        componentsNumberCount = [],
        tempData: { previousEmployment: { poe = [] } = {} } = {},
      } = {},
      dispatch,
    } = this.props;

    const checkedList = poe.map((value) => value.checkedList);
    const employerName = poe.map((value) => value.employer);

    const { length } = checkedList;

    const { children, orderNumber } = this.state;
    const {
      checkBoxesData = [],
      processStatus = '',
      handleEmployerName = () => {},
      disabled = false,
    } = this.props; // , item = {}

    const eachComponent = (number) => (
      <div>
        <EmployerComponent
          orderNumber={number}
          checkBoxesData={checkBoxesData}
          checkedList={checkedList[number - 1]}
          employerName={employerName[number - 1]}
          workDuration={poe[number - 1]}
          getDataFromFields={this.getDataFromFields}
          deleteComponent={this.deleteComponent}
          processStatus={processStatus}
          handleEmployerName={handleEmployerName}
          disabled={disabled}
        />
        <hr className={styles.divider} />
      </div>
    );

    const componentsNumberCountAfter = JSON.parse(JSON.stringify(componentsNumberCount));

    const newComponents = children;
    checkedList.forEach((value, index) => {
      newComponents.push(eachComponent(index + 1));
      componentsNumberCountAfter.push(index + 1);
    });

    this.setState({
      children: newComponents,
      orderNumber: orderNumber + length,
    });

    dispatch({
      type: 'candidateInfo/save',
      payload: {
        componentsNumberCount: componentsNumberCountAfter,
      },
    });
  };

  setIndeterminate = (value) => {
    this.setState({
      indeterminate: value,
    });
  };

  setCheckAll = (value) => {
    this.setState({
      checkAll: value,
    });
  };

  onChange = (list, checkBoxesData) => {
    this.setCheckedList(list);
    this.setIndeterminate(!!list.length && list.length < checkBoxesData.length);
    this.setCheckAll(list.length === checkBoxesData.length);
  };

  onCheckAllChange = (e) => {
    e.stopPropagation();
  };

  // eslint-disable-next-line no-unused-vars
  getDataFromFields = (orderNumber, employerName, checkedList) => {
    const { handleChange = () => {} } = this.props;
    handleChange(checkedList, orderNumber, employerName);
  };

  renderHeader = () => {
    const { title = '', disabled = false } = this.props;
    const { indeterminate, checkAll } = this.state;
    return (
      <div className={styles.header}>
        <Checkbox
          checked={checkAll}
          indeterminate={indeterminate}
          onClick={(e) => this.onCheckAllChange(e)}
          disabled={disabled}
        />
        <span className={styles.titleText}>{title}</span>
        <span className={styles.noteText}>
          [All Mandatory documents will need to be submitted. One or more of the optional documents
          can be submitted]
        </span>
      </div>
    );
  };

  // delete component
  deleteComponent = (indexToDelete) => {
    // console.log('indexToDelete', indexToDelete);
    const { children, orderNumber } = this.state;
    const {
      dispatch,
      candidateInfo: { componentsNumberCount = [] } = {},
      deleteBlockD = () => {},
    } = this.props;

    // find child to delete
    let findX = 0;
    componentsNumberCount.forEach((child, index) => {
      if (child === indexToDelete) findX = index + 1;
    });

    // get new children after deleted
    const newComponents = children.filter((child, index) => index + 1 !== findX);

    // updated componentsNumberCount array (which contain the index of each child)
    let componentsNumberCountAfter = JSON.parse(JSON.stringify(componentsNumberCount));
    componentsNumberCountAfter = componentsNumberCountAfter.filter(
      (value) => value !== indexToDelete,
    );

    dispatch({
      type: 'candidateInfo/save',
      payload: {
        componentsNumberCount: componentsNumberCountAfter,
      },
    });

    // change children length
    this.setState({
      children: newComponents,
      orderNumber: orderNumber - 1,
    });

    deleteBlockD(findX);
  };

  // add component
  addComponent = () => {
    this.renderEmployerComponent();
    const { addBlockD = () => {} } = this.props;
    addBlockD();
  };

  // render component
  renderEmployerComponent = () => {
    const { children, orderNumber } = this.state;
    const {
      checkBoxesData = [],
      item = {},
      processStatus = '',
      handleEmployerName = () => {},
      dispatch,
      candidateInfo: { componentsNumberCount = [] } = {},
      disabled = false,
    } = this.props;
    const { data = [] } = item;

    // const index = componentsNumberCount.length + 1;
    const newComponents = [
      ...children,
      <div>
        <EmployerComponent
          orderNumber={orderNumber}
          checkBoxesData={checkBoxesData}
          defaultList={data}
          getDataFromFields={this.getDataFromFields}
          deleteComponent={this.deleteComponent}
          processStatus={processStatus}
          handleEmployerName={handleEmployerName}
          disabled={disabled}
        />
        <hr className={styles.divider} />
      </div>,
    ];

    const componentsNumberCountAfter = JSON.parse(JSON.stringify(componentsNumberCount));
    componentsNumberCountAfter.push(orderNumber);

    dispatch({
      type: 'candidateInfo/save',
      payload: {
        componentsNumberCount: componentsNumberCountAfter,
      },
    });
    this.setState({
      children: newComponents,
      orderNumber: orderNumber + 1,
    });
  };

  render() {
    const { children } = this.state;
    const { disabled = false } = this.props;
    return (
      <div className={styles.CollapseFieldsType2}>
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
          <Panel header={this.renderHeader()} className={styles.collapsePanel} key="1">
            <div>{children.map((child) => child)}</div>

            <div
              className={
                disabled
                  ? `${styles.disableButton} ${styles.addEmployerDetailBtn}`
                  : styles.addEmployerDetailBtn
              }
              onClick={disabled ? () => {} : this.addComponent}
            >
              <PlusOutlined className={styles.plusIcon} />
              <span className={styles.title}>Add Employer Detail</span>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default CollapseFieldsType2;
