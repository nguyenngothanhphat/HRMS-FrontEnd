/* eslint-disable no-nested-ternary */
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Checkbox, Collapse, Space } from 'antd';
import React, { PureComponent } from 'react';
import InputField from '../InputField';
import styles from './index.less';

class CollapseField extends PureComponent {
  render() {
    const {
      item = {},
      handleCheckAll,
      handleChange,
      tempData,
      onValuesChange,
      documentChecklistSetting,
      processStatus,
      handleValidation,
      checkValidation,
      disabled,
    } = this.props;
    const { identityProof, addressProof, educational, technicalCertification } = tempData;
    const { poe } = technicalCertification;
    const checkedArr = item.data
      ? item.data.length
        ? item.data.filter(
            (data) =>
              data.key === 'aadharCard' ||
              data.key === 'panCard' ||
              data.key === 'sslc' ||
              data.key === 'intermediateDiploma' ||
              data.key === 'graduation',
          )
        : null
      : null;
    const defaultArr = item.data.filter(
      (data) =>
        data.key !== 'aadharCard' &&
        data.key !== 'panCard' &&
        data.key !== 'sslc' &&
        data.key !== 'intermediateDiploma' &&
        data.key !== 'graduation',
    );
    return (
      <div className={styles.CollapseField}>
        <Collapse
          accordion
          expandIconPosition="right"
          expandIcon={(props) => {
            return props.isActive ? <MinusOutlined /> : <PlusOutlined />;
          }}
        >
          <Collapse.Panel
            header={
              <Checkbox
                className={styles.checkbox}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleCheckAll(e, defaultArr, item)}
                // disabled={processStatus === 'SENT-PROVISIONAL-OFFER'}
                disabled={disabled}
                checked={
                  item.type === 'A'
                    ? identityProof.isChecked
                    : item.type === 'B'
                    ? addressProof.isChecked
                    : item.type === 'C'
                    ? educational.isChecked
                    : item.type === 'D'
                    ? poe.isChecked
                    : null
                }
              >
                Type {item.type}: {item.name}
              </Checkbox>
            }
            extra="[All Mandatory documents will need to be submitted. One or more of the optional documents can be submitted]"
          >
            {item.type === 'D' ? (
              <InputField
                onValuesChange={onValuesChange}
                documentChecklistSetting={documentChecklistSetting}
                processStatus={processStatus}
                handleValidation={handleValidation}
                checkValidation={checkValidation}
                tempData={tempData}
              />
            ) : (
              <></>
            )}
            <Space direction="vertical">
              {checkedArr.map((data) => (
                <Checkbox
                  checked="true"
                  disabled="true"
                  value={data.alias}
                  className={styles.checkboxItem}
                >
                  {data.alias}
                </Checkbox>
              ))}

              <Checkbox.Group
                direction="vertical"
                className={styles.checkboxItem}
                options={defaultArr.map((data) => data.alias)}
                onChange={(checkedList) => handleChange(checkedList, defaultArr, item)}
                // disabled={processStatus === 'SENT-PROVISIONAL-OFFER'}
                disabled={disabled}
                value={
                  item.type === 'A'
                    ? identityProof.checkedList
                    : item.type === 'B'
                    ? addressProof.checkedList
                    : item.type === 'C'
                    ? educational.checkedList
                    : item.type === 'D'
                    ? poe.checkedList
                    : []
                }
              />
              {/* {item.type === 'D' ? (
                <Space direction="horizontal">
                  <PlusOutlined className={styles.plusIcon} />
                  <Typography.Text className={styles.addMore}>Add Employer Details</Typography.Text>
                </Space>
              ) : (
                <></>
              )} */}
            </Space>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}

export default CollapseField;
