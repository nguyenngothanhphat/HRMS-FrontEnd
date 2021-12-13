import React, { Component } from 'react';
import { formatMessage, connect } from 'umi';
import { Form, Radio } from 'antd';

import styles from './index.less';

@connect(({ onboard: { settings: { backgroundChecks } = {} } = {} }) => ({
  backgroundChecks,
}))
class BackgroundCheck extends Component {
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
      backgroundChecks: { typeOfBackgroundCheck = '', checksPerform = '', resultViewer = '' },
    } = this.state;
    return (
      <div className={styles.BackgroundCheck}>
        <div className={styles.BackgroundCheck_title}>
          {formatMessage({ id: 'component.backgroundCheck.title' })}
        </div>
        <hr />
        <div className={styles.BackgroundCheck_form}>
          {' '}
          <Form onChange={(e) => this.handleChange(e)}>
            <Form.Item name="typeOfBackgroundCheck" label="Type of background checks:">
              <Radio.Group defaultValue={typeOfBackgroundCheck} name="typeOfBackgroundCheck">
                <Radio value="Premium only">Premium only</Radio>
                <Radio value="Either option">Either option</Radio>
                <Radio value="Standard only">Standard only</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="checksPerform" label="Checks performed">
              <Radio.Group defaultValue={checksPerform} name="checksPerform">
                <Radio value="When some one is hired">When some one is hired</Radio>
                <Radio value="On a case-by-case basis">On a case-by-case basis</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="resultViewer" label="Who can view results">
              <Radio.Group defaultValue={resultViewer} name="resultViewer">
                <Radio value="Company admin & Direct manager">Company admin & Direct manager</Radio>
                <Radio value="Company admin">Company admin</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default BackgroundCheck;
