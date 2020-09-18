import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row, Col } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

// @connect(({ info: { benefits } = {} }) => ({
//   benefits,
// }))
class GlobalEmpoyeeComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
      checkAll: false,
    };
  }

  // static getDerivedStateFromProps(props) {
  //   if ('benefits' in props) {
  //     return { benefits: props.benefits || {} };
  //   }
  //   return null;
  // }
  handleChange = (checkedList, itemArr) => {
    this.setState({
      checkedList,
      checkAll: checkedList.length === itemArr.length,
    });
    console.log(checkedList);
    console.log(itemArr);
  };

  handleCheckAllChange = (e, itemArr) => {
    const { checkedList } = this.state;
    this.setState({
      checkedList: e.target.checked ? itemArr : [],
      checkAll: e.target.checked,
    });
    console.log(checkedList);
    console.log(itemArr);
  };

  render() {
    const { globalEmployeesCheckbox, headerText } = this.props;
    const { title, name, checkBox } = globalEmployeesCheckbox;
    const CheckboxGroup = Checkbox.Group;
    const { subCheckBox } = checkBox;
    const { checkedList } = this.state;
    return (
      <div className={styles.GlobalEmpoyeeComponent}>
        <Typography.Title level={5} className={styles.headerPadding}>
          {name}
        </Typography.Title>
        {checkBox.map((item) =>
          item.subCheckBox.length > 1 ? (
            <div className={styles.checkBoxHeader}>
              <Checkbox
                className={
                  item.value === 'Medical' ? styles.checkboxMedical : styles.checkBoxHeaderTop
                }
                onChange={(e) => this.handleCheckAllChange(e, item.subCheckBox)}
              >
                <Typography.Text className={styles.checkBoxTitle}>{item.value}</Typography.Text>
              </Checkbox>
              <div className={styles.paddingLeft}>
                <Typography.Title className={styles.headerText} level={4}>
                  {headerText}
                </Typography.Title>
                <CheckboxGroup
                  options={item.subCheckBox.map((data) => data.value)}
                  value={checkedList}
                  onChange={(e) => this.handleChange(e, item.subCheckBox)}
                />
                {/* {item.subCheckBox.map((data) => (
                  <Row>
                    <Checkbox onChange={(e) => this.handleChange(e.target.value)}>
                      <Typography.Text className={styles.subCheckboxTitle}>
                        {data.value}
                      </Typography.Text>
                    </Checkbox>
                  </Row>
                ))} */}
              </div>
            </div>
          ) : (
            <div className={styles.paddingLeft}>
              <Typography.Paragraph className={styles.checkBoxTitle}>
                {item.value}
              </Typography.Paragraph>
              <Typography.Title className={styles.headerText} level={4}>
                {headerText}
              </Typography.Title>
              {item.subCheckBox.map((data) => (
                <Row>
                  <Checkbox>
                    <Typography.Text className={styles.subCheckboxTitle}>
                      {data.value}
                    </Typography.Text>
                  </Checkbox>
                </Row>
              ))}
            </div>
          ),
        )}
      </div>
    );
  }
}

export default GlobalEmpoyeeComponent;
