import React, { Component } from 'react';
import { Form, Radio } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

@connect(({ onboard: { settings: { backgroundChecks } = {} } = {} }) => ({
  backgroundChecks,
}))
class MotorVehicleReports extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    if ('backgroundChecks' in props) {
      return { backgroundChecks: props.backgroundChecks || {} };
    }
    return null;
  }

  handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    const { dispatch } = this.props;
    const { backgroundChecks = {} } = this.state;
    backgroundChecks[name] = value;

    dispatch({
      type: 'onboard/save',
      payload: {
        backgroundChecks,
      },
    });
  };

  render() {
    const {
      backgroundChecks: { vehicleReportsRequested = '', vehicleNotObtained = '' },
    } = this.state;
    return (
      <div className={styles.MotorVehicleReports}>
        <div className={styles.MotorVehicleReports_title}>Motor Vehicle Reports</div>
        <hr />
        <div className={styles.MotorVehicleReports_form}>
          {' '}
          <Form onChange={(e) => this.handleChange(e)}>
            <Form.Item name="vehicleReportsRequested" label="Motor vehicle reports requested">
              <Radio.Group defaultValue={vehicleReportsRequested} name="vehicleReportsRequested">
                <Radio value="When some one is hired">When some one is hired</Radio>
                <Radio value="On a case-by-case basis">On a case-by-case basis</Radio>
                <Radio value="Don't include motor vehicle reports">
                  Don't include motor vehicle reports
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="vehicleNotObtained"
              label="When motor vehicle reports can't be obtained"
            >
              <Radio.Group defaultValue={vehicleNotObtained} name="vehicleNotObtained">
                <Radio value="Run background check anyway">Run background check anyway</Radio>
                <Radio value="Cancel background check">Cancel background check</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default MotorVehicleReports;
