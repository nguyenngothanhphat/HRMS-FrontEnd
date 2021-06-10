import React, { Component } from 'react';
import { Radio, Row, Col } from 'antd';
import styles from './index.less';

class HireProbation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newHire: true,
    };
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    this.setState({
      newHire: e.target.value,
    });
    const data = {
      newHire: e.target.value,
    };
    onChangeValue(data);
  };

  render() {
    // const { newHire } = this.state;
    const {
      hireProbation: { newHire },
    } = this.props;
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
                value={newHire}
                buttonStyle="solid"
                className={styles.radioGroup}
              >
                <Radio.Button value>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default HireProbation;
