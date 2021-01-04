import React, { Component } from 'react';
import { Checkbox, Row, Col, Select } from 'antd';
import styles from './index.less';

class AnnualReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      annualReset: '',
      resetAnnually: false,
    };
  }

  onChangeSelect = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { annualReset } = this.state;
    this.setState({
      resetAnnually: e.target.checked,
    });
    const data = {
      annualReset,
      unlimited: e.target.checked,
    };
    onChangeValue(data);
  };

  render() {
    const { resetAnnually } = this.state;
    return (
      <div className={styles.contentAnnual}>
        <div className={styles.title}>Annual reset</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                During the employee’s 1st year of employment, total casual leave accrued
              </div>
              <Checkbox className={styles.checkbox} onChange={this.onChangeSelect}>
                Unlimited causal leave
              </Checkbox>
            </Col>
            <Col span={12}>
              <Select className={styles.select} placeholder="Select a reset date" />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default AnnualReset;
