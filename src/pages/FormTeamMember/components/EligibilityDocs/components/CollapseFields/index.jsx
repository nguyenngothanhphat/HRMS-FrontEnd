/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import InputField from '../InputField';
import styles from './index.less';

class CollapseField extends PureComponent {
  render() {
    const { item, eligibilityDocs, handleCheckAll, handleChange } = this.props;
    const { identityProof, addressProof, educational, technicalCertification } = eligibilityDocs;
    const { poe } = technicalCertification;
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
                onChange={(e) => handleCheckAll(e, item.items, item.value)}
                checked={
                  item.value === 'typeA'
                    ? identityProof.isChecked
                    : item.value === 'typeB'
                    ? addressProof.isChecked
                    : item.value === 'typeC'
                    ? educational.isChecked
                    : item.value === 'typeD'
                    ? poe.isChecked
                    : null
                }
              >
                {item.title}
              </Checkbox>
            }
            extra="[Can submit any of the below other than (*)mandatory]"
          >
            {item.title === 'Type D: Technical Certifications' ? <InputField /> : <></>}
            <Space direction="vertical">
              {item.defaultItems.map((data) =>
                item.defaultItems.length > 1 ? (
                  <Checkbox
                    checked="true"
                    disabled="true"
                    value={data.name}
                    className={styles.checkboxItem}
                  >
                    {data.name}*
                  </Checkbox>
                ) : null,
              )}
              <Checkbox.Group
                direction="vertical"
                className={styles.checkboxItem}
                options={item.items.map((obj) => obj.name)}
                onChange={(e) => handleChange(e, item.items, item.value)}
                value={
                  item.value === 'typeA'
                    ? identityProof.listSelected
                    : item.value === 'typeB'
                    ? addressProof.listSelected
                    : item.value === 'typeC'
                    ? educational.listSelected
                    : item.value === 'typeD'
                    ? poe.listSelected
                    : []
                }
              />
              {item.title === 'Type D: Technical Certifications' ? (
                <Space direction="horizontal">
                  <PlusOutlined className={styles.plusIcon} />
                  <Typography.Text className={styles.addMore}>Add Employer Details</Typography.Text>
                </Space>
              ) : (
                <></>
              )}
            </Space>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}

export default CollapseField;
