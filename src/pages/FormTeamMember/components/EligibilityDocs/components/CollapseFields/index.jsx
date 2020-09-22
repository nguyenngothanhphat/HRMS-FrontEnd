/* eslint-disable no-nested-ternary */
import React from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';
import InputField from '../InputField';
import styles from './index.less';

const listCollapse = [
  {
    id: '1',
    title: formatMessage({ id: 'component.eligibilityDocs.TypeA' }),
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.aadharCard' }),
        isRequired: true,
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.pan' }),
        isRequired: true,
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.passport' }),
        isRequired: false,
      },
      {
        key: '4',
        name: formatMessage({ id: 'component.eligibilityDocs.drivingLicense' }),
        isRequired: false,
      },
      {
        key: '5',
        name: formatMessage({ id: 'component.eligibilityDocs.voterCard' }),
        isRequired: false,
      },
    ],
  },
  {
    id: '2',
    title: formatMessage({ id: 'component.eligibilityDocs.TypeB' }),
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.rentalAgreement' }),
        isRequired: false,
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.electricityUtilityBills' }),
        isRequired: false,
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.telephoneBills' }),
        isRequired: false,
      },
    ],
  },
  {
    id: '3',
    title: formatMessage({ id: 'component.eligibilityDocs.TypeC' }),
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.sslc' }),
        isRequired: true,
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.intermediateDiploma' }),
        isRequired: true,
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.graduation' }),
        isRequired: true,
      },
      {
        key: '4',
        name: formatMessage({ id: 'component.eligibilityDocs.postGraduate' }),
        isRequired: false,
      },
      {
        key: '5',
        name: formatMessage({ id: 'component.eligibilityDocs.phdDoctorate' }),
        isRequired: false,
      },
    ],
  },
  {
    id: '4',
    title: formatMessage({ id: 'component.eligibilityDocs.TypeD' }),
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.offerLetter' }),
        isRequired: false,
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.appraisalLetter' }),
        isRequired: false,
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.paystubs' }),
        isRequired: false,
      },
      {
        key: '4',
        name: formatMessage({ id: 'component.eligibilityDocs.form16' }),
        isRequired: false,
      },
      {
        key: '5',
        name: formatMessage({ id: 'component.eligibilityDocs.relievingCard' }),
        isRequired: false,
      },
    ],
  },
];

const defaultCheckListContainer = listCollapse.map((obj) =>
  obj.items.filter((item) => item.isRequired),
);
const Item = listCollapse.map((obj) => obj.items);
console.log(Item);

@connect(({ info: { eligibilityDocs } = {} }) => ({
  eligibilityDocs,
}))
class CollapseField extends React.Component {
  constructor(props) {
    super(props);
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
    this.setState({
      checkList,
      indeterminate: !!checkList.length && checkList.length < Item.length,
      isCheckAll: checkList.length === Item.length,
    });
    console.log(this.state);
  }

  handleCheckAllChange(e) {
    this.setState({
      checkList: e.target.checked ? Item : [],
      indeterminate: false,
      isCheckAll: e.target.checked,
    });
    console.log(this.state);
  }

  render() {
    const { item, handleCheckBox, defaultCheckListContainer, checkHeader } = this.props;
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
                check={isCheckAll}
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
