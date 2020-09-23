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
    const { defaultCheckListContainer } = this.props;
    this.state = {
      checkList: defaultCheckListContainer,
      isCheckAll: false,
      indeterminate: true,
    };
  }

  static getDerivedStateFromProps(props) {
    if ('eligibilityDocs' in props) {
      return { eligibilityDocs: props.eligibilityDocs || {} };
    }
    return null;
  }

  handleChange(checkList) {
    const { defaultCheckListContainer } = this.props;
    this.setState({
      checkList,
      indeterminate: !!checkList.length && checkList.length < defaultCheckListContainer.length,
      isCheckAll: checkList.length === defaultCheckListContainer.length,
    });
    console.log(this.state);
  }

  handleCheckAllChange(e) {
    const { defaultCheckListContainer } = this.props;
    this.setState({
      checkList: e.target.checked ? defaultCheckListContainer : [],
      indeterminate: false,
      isCheckAll: e.target.checked,
    });
    console.log(this.state);
  }

  render() {
    const { item, handleCheckBox, defaultCheckListContainer } = this.props;
    // const {}
    const {
      // eligibilityDocs,
      indeterminate,
      isCheckAll,
      checkList,
    } = this.state;

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
                indeterminate={indeterminate}
                onChange={this.handleCheckAllChange}
                checked={isCheckAll}
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
                options={item.items.map((obj) => obj.name)}
                name={item.items.map((obj) => obj.name)}
                onChange={() => this.handleChange(checkList)}
                value={item.items.map((obj) => obj.isRequired)}
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
