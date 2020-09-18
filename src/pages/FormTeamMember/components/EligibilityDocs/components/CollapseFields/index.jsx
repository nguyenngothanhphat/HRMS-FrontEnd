/* eslint-disable no-nested-ternary */
import React from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';
import InputField from '../InputField';
import styles from './index.less';

@connect(({ info: { eligibilityDocs } = {} }) => ({
  eligibilityDocs,
}))
class CollapseField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: false,
      isCheckAll: false,
      indeterminate: false
    };
  }
  handleChange(e) {
    this.setState {
      e.target.
    }
  };

  // handleCheckAllChange(e) {

  // };

  static getDerivedStateFromProps(props) {
    if ('eligibilityDocs' in props) {
      return { eligibilityDocs: props.eligibilityDocs || {} };
    }
    return null;
  }

  render() {
    const { item, handleCheckBox, defaultCheckListContainer, checkHeader } = this.props;
    // const {}
    const { eligibilityDocs, isCheck } = this.state;

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
                onChange={this.handleCheckAllChange}
                name={item.title}
                check={isCheck}
              >
                {item.title}
              </Checkbox>
            }
            extra="[Can submit any of the below other than (*)mandatory]"
          >
            {item.title === 'Type D: Technical Certifications' ? <InputField /> : <></>}
            <Space direction="vertical">
              <Checkbox.Group
                direction="vertical"
                className={styles.checkboxItem}
                // eslint-disable-next-line no-nested-ternary
                // defaultChecked={checkHeader.isRequired}
                // value={}
                options={item.items.map((obj) => obj.name)}
                // onChange={handleChange}
              />
              {/* {item.items.map((obj) => (
                <Checkbox
                  key={obj.key}
                  className={styles.checkboxItem}
                  onChange={(e) => this.handleChange(e)}
                  defaultChecked={!!obj.isRequired}
                  // value={}
                  disabled={obj.isRequired}
                >
                  {obj.name}
                  {obj.isRequired ? '*' : <></>}
                </Checkbox>
              ))} */}
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
