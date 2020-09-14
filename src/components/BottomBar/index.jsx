import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';

import { connect } from 'umi';

import styles from './index.less';

class BottomBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // componentWillUpdate(newProp) {
  //   const { offerDetailField, checkMandatory } = newProp;
  //   const { currency } = offerDetailField;
  //   const { filledBasicInformation } = checkMandatory;
  //   if (currency === false) {
  //     console.log('Update');
  //   }
  // }

  onClickNext = () => {
    const { onClickNext } = this.props;
    onClickNext();
  };

  onClickPrev = () => {
    const { onClickPrev } = this.props;
    onClickPrev();
  };
  _renderStatus = () => {
    const { currentPage, offerDetailField, checkMandatory } = this.props;
    const { filledBasicInformation } = checkMandatory;
    if (currentPage === 1) {
      return !filledBasicInformation ? (
        <div className={styles.normalText}>
          <div className={styles.redText}>*</div>All mandatory details must be filled to proceed
        </div>
      ) : (
        <div className={styles.greenText}>*All mandatory details have been filled</div>
      );
    }
    if (currentPage === 4) {
      return offerDetailField.currency === true
        ? '*All mandatory fields have been filled.'
        : `Currency field must be 'Dollar'`;
    }
    return null;
  };

  _renderBottomButton = () => {
    const { currentPage, checkMandatory } = this.props;
    const { filledBasicInformation } = checkMandatory;

    if (currentPage === 1) {
      return (
        <Button
          type="primary"
          onClick={this.onClickNext}
          className={`${styles.bottomBar__button__primary} ${
            !filledBasicInformation ? styles.bottomBar__button__disabled : ''
          }`}
          // { filledBasicInformation ? disabled : null }
          disabled={!filledBasicInformation}
        >
          Next
        </Button>
      );
    } else if (currentPage === 2) {
      return (
        <>
          <Button
            type="secondary"
            onClick={this.onClickPrev}
            className={styles.bottomBar__button__secondary}
          >
            Previous
          </Button>
          <Button
            type="primary"
            onClick={this.onClickNext}
            className={styles.bottomBar__button__primary}
          >
            Next
          </Button>
        </>
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
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>{this._renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>{this._renderBottomButton()}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

// export default BottomBar;
export default connect(({ info: { offerDetailField = {}, checkMandatory = {} } = {} }) => ({
  offerDetailField,
  checkMandatory,
}))(BottomBar);
