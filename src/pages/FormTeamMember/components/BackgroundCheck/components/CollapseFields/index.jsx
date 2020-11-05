/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import InputField from '../InputField';
import styles from './index.less';

const RenderSomething = ({ propsData }) => {
  const {
    item = {},
    onValuesChange = () => {},
    documentChecklistSetting,
    checkedArr,
    defaultArr,
    identityProof,
    handleChange,
    addressProof,
    educational,
    poe,
    addNewEmployerDetail,
  } = propsData;
  return (
    <div>
      {item.type === 'D' ? (
        <InputField
          onValuesChange={onValuesChange}
          documentChecklistSetting={documentChecklistSetting}
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
            {data.alias}*
          </Checkbox>
        ))}

        <Checkbox.Group
          direction="vertical"
          className={styles.checkboxItem}
          options={defaultArr.map((data) => data.alias)}
          onChange={(checkedList) => handleChange(checkedList, defaultArr, item)}
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
      </Space>
    </div>
  );
};
class CollapseField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
    };
  }

  addNewEmployerDetail = (propsData) => {
    const { children } = this.state;
    const newComponents = [
      ...children,
      <div>
        <hr />
        <RenderSomething propsData={propsData} />
      </div>,
    ];
    this.setState({
      children: newComponents,
    });
  };

  render() {
    const {
      item = {},
      handleCheckAll,
      handleChange,
      tempData,
      onValuesChange,
      documentChecklistSetting,
    } = this.props;
    const { children } = this.state;
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

    const renderProps = {
      item,
      documentChecklistSetting,
      checkedArr,
      defaultArr,
      identityProof,
      handleChange,
      addressProof,
      educational,
      poe,
      onValuesChange,
      addNewEmployerDetail: this.addNewEmployerDetail,
    };

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
            extra="[Can submit any of the below other than (*)mandatory]"
          >
            <RenderSomething propsData={renderProps} />
            <div>{children.map((child) => child)}</div>
            {item.type === 'D' ? (
              <Space direction="horizontal" onClick={() => this.addNewEmployerDetail(renderProps)}>
                <PlusOutlined className={styles.plusIcon} />
                <Typography.Text className={styles.addMore}>Add Employer Details</Typography.Text>
              </Space>
            ) : (
              <></>
            )}
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}

export default CollapseField;
