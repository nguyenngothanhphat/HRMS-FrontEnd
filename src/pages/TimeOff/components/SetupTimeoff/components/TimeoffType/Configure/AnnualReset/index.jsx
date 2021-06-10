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
    const { annualReset } = this.props;
    return (
      <div className={styles.contentAnnual}>
        <div className={styles.title}>Annual reset</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>Employees Casual leave balance resets to 0 on</div>
              <Checkbox
                checked={annualReset.resetAnnually}
                className={styles.checkbox}
                onChange={this.onChangeSelect}
              >
                Reset annually
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
