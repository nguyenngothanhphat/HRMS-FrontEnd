import React, { Component } from 'react';
import { Radio, Row, Col } from 'antd';
import styles from './index.less';

class HireProbation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minimumIncrements: '',
      select: 'yes',
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { minimumIncrements } = this.state;
    this.setState({
      select: e.target.value,
    });
    const data = {
      select: e.target.value,
      minimumIncrements,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { select } = this.state;
    this.setState({
      minimumIncrements: value,
    });
    const data = {
      select,
      minimumIncrements: value,
    };
    onChangeValue(data);
  };

  render() {
    const { minimumIncrements, select } = this.state;
    return (
      <div className={styles.contentHireProration}>
        <div className={styles.title}>New hire proration</div>
        <div className={styles.borderStyles} />
        <div className={styles.formBody}>
          <Row gutter={[20, 0]}>
            <Col span={10}>
              <div className={styles.titleText}>
                Should new hires have their casual leave balance prorated for the 1st year?
              </div>
            </Col>
            <Col span={12}>
              <Radio.Group
                onChange={this.onChangeRadio}
                value={select}
                buttonStyle="solid"
                className={styles.radioGroup}
              >
                <Radio.Button value="yes">Yes</Radio.Button>
                <Radio.Button value="no">No</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default HireProbation;
