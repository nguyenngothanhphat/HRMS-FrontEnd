/* eslint-disable no-nested-ternary */
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Collapse, Spin } from 'antd';
import React from 'react';
import { connect } from 'umi';
import EmployerComponent from './components/EmployerComponent';
import styles from './index.less';

const { Panel } = Collapse;

const CollapseFieldsType2 = (props) => {
  const {
    disabled = false,
    previousEmployment = [],
    removeBlockE = () => {},
    handleChangeName = () => {},
    handleCheck = () => {},
    refresh = false,
    addBlockE = () => {},
  } = props;

  const renderHeader = () => {
    const title =
      previousEmployment.length > 0
        ? `Type ${previousEmployment[0].type}: ${previousEmployment[0].name}`
        : 'Type E: Previous Employment';

    return (
      <div className={styles.header}>
        <span className={styles.titleText}>{title}</span>
      </div>
    );
  };

  // add component
  const addComponent = () => {
    addBlockE();
  };

  return (
    <Col span={24}>
      <div className={styles.CollapseFieldsTypeE}>
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
          <Panel header={renderHeader()} className={styles.collapsePanel} key="1">
            <Spin spinning={refresh}>
              {previousEmployment.length > 0 && (
                <div className={styles.items}>
                  {previousEmployment
                    .filter((x) => {
                      const { data = [] } = x;
                      return data.length > 0 || previousEmployment.length !== 1;
                    })
                    .map((x = {}, index) => {
                      const { data = [], employer = '' } = x;
                      return (
                        <div key={`${index + 0}`}>
                          <EmployerComponent
                            index={index}
                            employer={employer}
                            data={data}
                            remove={removeBlockE}
                            handleChange={handleChangeName}
                            handleCheck={handleCheck}
                            listLength={previousEmployment.length}
                            disabled={disabled}
                          />
                        </div>
                      );
                    })}
                </div>
              )}

              {!disabled && (
                <div
                  className={styles.buttonContainer}
                  style={previousEmployment.length > 0 ? null : { border: 'none' }}
                >
                  <div
                    className={
                      disabled
                        ? [styles.disableButton, styles.addEmployerDetailBtn]
                        : styles.addEmployerDetailBtn
                    }
                    onClick={disabled ? () => {} : addComponent}
                  >
                    <PlusOutlined className={styles.plusIcon} />
                    <span className={styles.title}>Add Employer Detail</span>
                  </div>
                </div>
              )}
            </Spin>
          </Panel>
        </Collapse>
      </div>
    </Col>
  );
};

export default connect(({ newCandidateForm }) => ({
  newCandidateForm,
}))(CollapseFieldsType2);
