import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';

import styles from './index.less';

export default class BottomBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onClickNext = () => {
    const { onClickNext } = this.props;
    onClickNext();
  };

  _renderBottomButton = () => {
    const { currentPage } = this.props;
    if (currentPage === 1) {
      return (
        <Button
          type="primary"
          onClick={this.onClickNext}
          className={styles.bottomBar__button__primary}
        >
          Next
        </Button>
      );
    }
    if (currentPage === 4) {
      return (
        <Button
          type="primary"
          onClick={this.onClickNext}
          className={styles.bottomBar__button__primary}
        >
          Proceed
        </Button>
      );
    }
    return null;
  };

  render() {
    const { className } = this.props;
    return (
      <div className={`${styles.bottomBar} ${className}`}>
        <Row>
          <Col span={16}>
            <div className={styles.bottomBar__status}>*All mandatory fields have been filled.</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>{this._renderBottomButton()}</div>
          </Col>
        </Row>
      </div>
    );
  }
}
