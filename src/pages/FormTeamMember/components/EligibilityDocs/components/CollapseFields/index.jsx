/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import InputField from '../InputField';
import styles from './index.less';

class CollapseField extends PureComponent {
  handleChange = (e) => {
    console.log(e.target.checked);
  };

  render() {
    const {
      item,
      handleCheckAll,
      handleChange,
      testEligibility,
      listTypeASelected,
      listTypeBSelected,
      listTypeCSelected,
      listTypeDSelected,
      typeAIsChecked,
      typeBIsChecked,
      typeCIsChecked,
      typeDIsChecked,
    } = this.props;

    const defaultValueArr = item.data.filter(
      (obj) => obj.key === 'aaharCard' || obj.key === 'panCard',
    );
    console.log(defaultValueArr);

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
                onChange={(e) => handleCheckAll(e, item.data, item.type)}
                checked={
                  item.type === 'A'
                    ? typeAIsChecked
                    : item.type === 'B'
                    ? typeBIsChecked
                    : item.type === 'C'
                    ? typeCIsChecked
                    : item.type === 'D'
                    ? typeDIsChecked
                    : null
                }
              >
                {item.type}
              </Checkbox>
            }
            extra="[Can submit any of the below other than (*)mandatory]"
          >
            {item.type === 'D' ? <InputField /> : <></>}
            <Space direction="vertical">
              {
                // /* {item.defaultItems.map((data) =>
                // item.defaultItems.length > 1 ? (
                //   <Checkbox
                //     checked="true"
                //     disabled="true"
                //     value={data.name}
                //     className={styles.checkboxItem}
                //   >
                //     {data.name}*
                //   </Checkbox>
                // ) : null, */
                null
              }

              <Checkbox.Group
                direction="vertical"
                className={styles.checkboxItem}
                options={item.data.map((obj) => obj.alias)}
                onChange={(e) => handleChange(e, item.data, item.type)}
                value={
                  item.type === 'A'
                    ? listTypeASelected
                    : item.type === 'B'
                    ? listTypeBSelected
                    : item.type === 'C'
                    ? listTypeCSelected
                    : item.type === 'D'
                    ? listTypeDSelected
                    : []
                }
              />
              {item.type === 'D' ? (
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
