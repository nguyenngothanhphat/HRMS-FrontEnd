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
        tempData: { technicalCertification: { poe = [] } = {} } = {},
      } = {},
      dispatch,
    } = this.props;

    const checkedList = poe.map((value) => value.checkedList);
    const employerName = poe.map((value) => value.employer);
    const workDuration = poe.map((value) => value.workDuration);

    const { length } = checkedList;

    const { children, orderNumber } = this.state;
    const { checkBoxesData = [], processStatus = '', handleEmployerName = () => {} } = this.props; // , item = {}

    const eachComponent = (number) => (
      <div>
        <EmployerComponent
          orderNumber={number}
          checkBoxesData={checkBoxesData}
          checkedList={checkedList[number - 1]}
          employerName={employerName[number - 1]}
          workDuration={workDuration[number - 1]}
          getDataFromFields={this.getDataFromFields}
          deleteComponent={this.deleteComponent}
          processStatus={processStatus}
          handleEmployerName={handleEmployerName}
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
  getDataFromFields = (orderNumber, employerName, workDuration, checkedList) => {
    const { handleChange = () => {} } = this.props;
    handleChange(checkedList, orderNumber, employerName, workDuration);
  };

  renderHeader = () => {
    const { title = '', processStatus = '' } = this.props;
    const { indeterminate, checkAll } = this.state;
    return (
      <div className={styles.header}>
        <Checkbox
          checked={checkAll}
          indeterminate={indeterminate}
          onClick={(e) => this.onCheckAllChange(e)}
          disabled={processStatus === 'SENT-PROVISIONAL-OFFER'}
        />
        <span className={styles.titleText}>{title}</span>
        <span className={styles.noteText}>
          [Can submit any of the below other than (*)mandatory]
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
    const { processStatus = '' } = this.props;
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
                processStatus === 'SENT-PROVISIONAL-OFFER'
                  ? `${styles.disableButton} ${styles.addEmployerDetailBtn}`
                  : styles.addEmployerDetailBtn
              }
              onClick={processStatus === 'SENT-PROVISIONAL-OFFER' ? () => {} : this.addComponent}
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
