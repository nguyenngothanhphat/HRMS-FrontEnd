/* eslint-disable no-nested-ternary */
import React from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import InputField from '../InputField';
import styles from './index.less';

@connect(({ info: { eligibilityDocs } = {} }) => ({
  eligibilityDocs,
}))
class CollapseField extends React.Component {
  static getDerivedStateFromProps(props) {
    if ('eligibilityDocs' in props) {
      return { eligibilityDocs: props.eligibilityDocs || {} };
    }
    return null;
  }

  handleChange = (checkedList, arr, value) => {
    const { dispatch } = this.props;
    const { eligibilityDocs } = this.state;
    const { identityProof, addressProof, educational, technicalCertification } = eligibilityDocs;
    const { poe } = technicalCertification;
    if (value === 'typeA') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            identityProof: {
              ...identityProof,
              listSelected: checkedList,
              isChecked: checkedList.length === arr.length,
            },
          },
        },
      });
    } else if (value === 'typeB') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            addressProof: {
              ...addressProof,
              listSelected: checkedList,
              isChecked: checkedList.length === arr.length,
            },
          },
        },
      });
    } else if (value === 'typeC') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            educational: {
              ...educational,
              listSelected: checkedList,
              isChecked: checkedList.length === arr.length,
            },
          },
        },
      });
    } else if (value === 'typeD') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            technicalCertification: {
              ...technicalCertification,
              poe: {
                ...poe,
                listSelected: checkedList,
                isChecked: checkedList.length === arr.length,
              },
            },
          },
        },
      });
    }
  };

  handleCheckAll = (e, arr, value) => {
    const { eligibilityDocs } = this.state;
    const { dispatch } = this.props;
    const { identityProof, addressProof, educational, technicalCertification } = eligibilityDocs;
    const { poe } = technicalCertification;
    if (value === 'typeA') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            identityProof: {
              ...identityProof,
              listSelected: e.target.checked ? arr.map((data) => data.name) : [],
              isChecked: e.target.checked,
            },
          },
        },
      });
    } else if (value === 'typeB') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            addressProof: {
              ...addressProof,
              listSelected: e.target.checked ? arr.map((data) => data.name) : [],
              isChecked: e.target.checked,
            },
          },
        },
      });
    } else if (value === 'typeC') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            educational: {
              ...educational,
              listSelected: e.target.checked ? arr.map((data) => data.name) : [],
              isChecked: e.target.checked,
            },
          },
        },
      });
    } else if (value === 'typeD') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            technicalCertification: {
              ...technicalCertification,
              poe: {
                ...poe,
                listSelected: e.target.checked ? arr.map((data) => data.name) : [],
                isChecked: e.target.checked,
              },
            },
          },
        },
      });
    }
  };

  render() {
    const { item } = this.props;
    const { eligibilityDocs } = this.state;
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
                onChange={(e) => this.handleCheckAll(e, item.items, item.value)}
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
                onChange={(e) => this.handleChange(e, item.items, item.value)}
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
