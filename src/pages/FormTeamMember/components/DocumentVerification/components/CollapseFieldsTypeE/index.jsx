/* eslint-disable no-nested-ternary */
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Checkbox, Collapse, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import EmployerComponent from './EmployerComponent';
import styles from './index.less';

const { Panel } = Collapse;

@connect(({ candidateInfo }) => ({
  candidateInfo,
}))
class CollapseFieldsType2 extends PureComponent {
  renderHeader = () => {
    const { disabled = false, previousEmployment = [] } = this.props;
    const title =
      previousEmployment.length > 0
        ? `Type ${previousEmployment[0].type}: ${previousEmployment[0].name}`
        : 'Type E: Previous Employment';
    // const { indeterminate, checkAll } = this.state;
    return (
      <div className={styles.header}>
        <Checkbox
          // checked={checkAll}
          // indeterminate={indeterminate}
          // onClick={(e) => this.onCheckAllChange(e)}
          checked
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

  // add component
  addComponent = () => {
    // this.renderEmployerComponent();
    const { addBlockE = () => {} } = this.props;
    addBlockE();
  };

  render() {
    const {
      disabled = false,
      previousEmployment = [],
      removeBlockE = () => {},
      handleChangeName = () => {},
      handleCheck = () => {},
      refresh = false,
    } = this.props;

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
            <div>
              {refresh && (
                <div style={{ padding: '24px' }}>
                  <Skeleton />
                </div>
              )}
              {!refresh &&
                previousEmployment.length > 0 &&
                previousEmployment.map((child = {}, index) => {
                  const { data = [], employer = '' } = child;
                  if (data.length > 0 || previousEmployment.length !== 1)
                    return (
                      <EmployerComponent
                        index={index}
                        employer={employer}
                        data={data}
                        remove={removeBlockE}
                        handleChange={handleChangeName}
                        handleCheck={handleCheck}
                        listLength={previousEmployment.length}
                      />
                    );
                  return '';
                })}
            </div>

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
