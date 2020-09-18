import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row, Col } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

class IndiaEmployeeComponent extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { IndiaEmployeesCheckbox, headerText } = this.props;
    const { title, name, checkBox } = IndiaEmployeesCheckbox;
    const { subCheckBox } = checkBox;

    return (
      <div className={styles.IndiaEmployeeComponent}>
        <Typography.Title level={5} className={styles.headerPadding}>
          {name}
        </Typography.Title>
        {checkBox.map((item) =>
          item.subCheckBox.length > 1 ? (
            <div className={styles.checkBoxHeader}>
              <Checkbox
                className={
                  item.value === 'Paytm Wallet' ? styles.checkboxPaytm : styles.checkBoxHeaderTop
                }
              >
                <Typography.Text className={styles.checkBoxTitle}>{item.value}</Typography.Text>
              </Checkbox>
              <div className={styles.paddingLeft}>
                <Typography.Title className={styles.headerText} level={5}>
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
            </div>
          ) : (
            <div className={styles.paddingLeft}>
              <Typography.Paragraph className={styles.checkBoxTitle}>
                {item.value}
              </Typography.Paragraph>
              <Typography.Title className={styles.headerText} level={5}>
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

export default IndiaEmployeeComponent;
