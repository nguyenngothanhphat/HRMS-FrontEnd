import React, { Component } from 'react';
import { Checkbox, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import styles from './index.less';

const dateFormat = 'MM-DD-YYYY';
class AnnualReset extends Component {
  constructor(props) {
    const { annualReset } = props;
    super(props);
    this.state = {
      resetDate: moment(annualReset.resetDate).locale('en').format(dateFormat),
      resetAnnually: false,
    };
  }

  componentDidMount() {
    const {
      annualReset: { resetAnnually, resetDate },
    } = this.props;
    this.setState({
      resetDate,
      resetAnnually,
    });
  }

  onChangeSelect = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { resetAnnually } = this.state;
    this.setState({
      resetAnnually: value,
    });
    const data = {
      resetAnnually,
      resetDate: value,
    };
    onChangeValue(data);
  };

  onChangeCheck = (e) => {
    e.preventDefault();
    const { onChangeValue } = this.props;
    const { resetDate } = this.state;
    this.setState({
      resetAnnually: e.target.checked,
    });
    const data = {
      resetAnnually: e.target.checked,
      resetDate,
    };
    onChangeValue(data);
  };

  render() {
    const { resetDate, resetAnnually } = this.state;
    return (
      <div className={styles.contentAnnual}>
        <div className={styles.title}>Annual reset</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>Employees Casual leave balance resets to 0 on</div>
              <Checkbox
                defaultChecked={resetAnnually}
                className={styles.checkbox}
                onChange={(e) => this.onChangeCheck(e)}
              >
                Reset annually
              </Checkbox>
            </Col>
            <Col span={12}>
              {/* <Select className={styles.select} placeholder="Select a reset date" /> */}
              <DatePicker
                className={styles.select}
                format={dateFormat}
                defaultValue={moment(resetDate, dateFormat)}
                onChange={this.onChangeSelect}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default AnnualReset;
