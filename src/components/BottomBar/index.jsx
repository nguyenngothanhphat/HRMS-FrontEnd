import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';

import { connect, formatMessage } from 'umi';

import styles from './index.less';

class BottomBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

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
    const { filledBasicInformation, filledJobDetail, filledCustomField } = checkMandatory;
    if (currentPage === 1) {
      return !filledBasicInformation ? (
        <div className={styles.normalText}>
          <div className={styles.redText}>*</div>
          {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
        </div>
      ) : (
        <div className={styles.greenText}>
          * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
        </div>
      );
    }
    if (currentPage === 2) {
      return !filledJobDetail ? (
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

    if (currentPage === 8) {
      return !filledCustomField ? (
        <div className={styles.normalText}>
          <div className={styles.redText}>*</div>
          {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
        </div>
      ) : (
        <div className={styles.greenText}>
          * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
        </div>
      );
    }
    if (currentPage === 6) {
      return (
        <div className={styles.greenText}>
          * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
        </div>
      );
    }
    return null;
  };

  _renderBottomButton = () => {
    const { currentPage, checkMandatory } = this.props;
    const { filledBasicInformation, filledJobDetail } = checkMandatory;

    if (currentPage === 1) {
      return (
        <Button
          type="primary"
          onClick={this.onClickNext}
          className={`${styles.bottomBar__button__primary} ${
            !filledBasicInformation ? styles.bottomBar__button__disabled : ''
          }`}
          disabled={!filledBasicInformation}
        >
          Next
        </Button>
      );
    }
    if (currentPage === 2) {
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
            className={`${styles.bottomBar__button__primary} ${
              !filledJobDetail ? styles.bottomBar__button__disabled : ''
            }`}
            disabled={!filledJobDetail}
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
    if (currentPage === 6) {
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
    return null;
  };

  _renderBottomBar = () => {
    const { currentPage, checkMandatory } = this.props;
    const { salaryStatus } = checkMandatory;
    if ((currentPage === 4 && salaryStatus === 1) || currentPage !== 5) {
      return (
        <div className={styles.bottomBar}>
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
    return null;
  };

  render() {
    return <>{this._renderBottomBar()}</>;
  }
}

// export default BottomBar;
export default connect(({ info: { offerDetailField = {}, checkMandatory = {} } = {} }) => ({
  offerDetailField,
  checkMandatory,
}))(BottomBar);
