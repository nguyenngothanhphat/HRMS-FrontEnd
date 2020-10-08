/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Collapse, Space, Checkbox, Typography, Upload } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
// import InputField from '../InputField';
import styles from './index.less';

class CollapseField extends PureComponent {
  render() {
    const { item = {} } = this.props;
    // const { identityProof, addressProof, educational, technicalCertification } = eligibilityDocs;
    // const { poe } = technicalCertification;
    // const checkedArr = item.data
    //   ? item.data.length
    //     ? item.data.filter(
    //         (data) =>
    //           data.key === 'aadharCard' ||
    //           data.key === 'panCard' ||
    //           data.key === 'sslc' ||
    //           data.key === 'intermediateDiploma' ||
    //           data.key === 'graduation',
    //       )
    //     : null
    //   : null;

    // const defaultArr = item.data.filter(
    //   (data) =>
    //     data.key !== 'aadharCard' &&
    //     data.key !== 'panCard' &&
    //     data.key !== 'sslc' &&
    //     data.key !== 'intermediateDiploma' &&
    //     data.key !== 'graduation',
    // );

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
                // onChange={(e) => handleCheckAll(e, defaultArr, item)}
                checked="true"
              >
                Type {item.type}: {item.name}
              </Checkbox>
            }
            extra="[Can submit any of the below other than (*)mandatory]"
          >
            {/* {item.type === 'D' ? <InputField /> : <></>} */}
            <Space direction="vertical">
              {item.data.map((name) => (
                <Typography.Text>{name.name}</Typography.Text>
              ))}
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
