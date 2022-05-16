/* eslint-disable no-nested-ternary */
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Collapse, Spin } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { mapType } from '@/utils/newCandidateForm';
import EmployerComponent from './components/EmployerComponent';
import styles from './index.less';

const { Panel } = Collapse;

const CollapseFieldsTypeE = (props) => {
  const {
    dispatch,
    disabled = false,
    layout: { type = '', name = '' } = {},
    layout = {},
    items = [],
    refresh = false,
  } = props;

  const renderHeader = () => {
    const title = `Type ${type}: ${name}`;

    return (
      <div className={styles.header}>
        <span className={styles.titleText}>{title}</span>
      </div>
    );
  };

  const onSaveRedux = (result) => {
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        [mapType[type]]: result,
      },
    });
  };

  // add component
  const onAdd = () => {
    const result = [
      ...items,
      {
        employer: '',
        data: layout.data,
      },
    ];
    onSaveRedux(result);
  };

  const onRemove = (index) => {
    const result = [...items];
    result.splice(index, 1);
    onSaveRedux(result);
  };

  const handleChangeEmployer = (value, index) => {
    const result = [...items];
    result[index].employer = value;
    onSaveRedux(result);
  };

  const handleCheck = (list, index) => {
    const result = items.map((x, i) => {
      if (i !== index) return x;
      const data = x.data.map((y) => {
        return {
          ...y,
          value: list.includes(y.alias),
        };
      });
      return {
        ...x,
        data,
      };
    });
    onSaveRedux(result);
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
              <div className={styles.items} style={items.length > 0 ? {} : { padding: 0 }}>
                {items.map((x = {}, index) => {
                  const { data = [], employer = '' } = x;
                  return (
                    <div key={`${index + 0}`}>
                      <EmployerComponent
                        index={index}
                        employer={employer}
                        data={data}
                        listLength={items.length}
                        disabled={disabled}
                        onRemove={onRemove}
                        handleChangeEmployer={handleChangeEmployer}
                        handleCheck={handleCheck}
                      />
                    </div>
                  );
                })}
              </div>

              {!disabled && (
                <div
                  className={styles.buttonContainer}
                  style={items.length > 0 ? null : { border: 'none' }}
                >
                  <div
                    className={
                      disabled
                        ? [styles.disableButton, styles.addEmployerDetailBtn]
                        : styles.addEmployerDetailBtn
                    }
                    onClick={disabled ? () => {} : onAdd}
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
}))(CollapseFieldsTypeE);
