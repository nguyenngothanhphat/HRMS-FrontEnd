import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';

import { connect, formatMessage } from 'umi';

import styles from './index.less';

class BottomBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pageId: {
        basicInformation: 1,
        jobDetails: 2,
        eligibilityDocuments: 3,
        offerDetails: 4,
        benefits: 5,
        salaryStructure: 6,
        payrollSettings: 7,
        customFields: 8,
        additionalOptions: 9,
      },
    };
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
    const { pageId } = this.state;
    const { basicInformation, jobDetails, offerDetails, salaryStructure, customFields } = pageId;
    const { currentPage, checkMandatory } = this.props;
    const { filledBasicInformation, filledJobDetail, filledCustomField } = checkMandatory;
    if (currentPage === basicInformation) {
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
    if (currentPage === jobDetails) {
      return !filledJobDetail ? (
        <div className={styles.normalText}>
          <div className={styles.redText}>*</div>All mandatory details must be filled to proceed
        </div>
      ) : (
        <div className={styles.greenText}>*All mandatory details have been filled</div>
      );
    }

    if (currentPage === offerDetails) {
      return (
        <div className={styles.greenText}>
          * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
        </div>
      );
    }

    if (currentPage === customFields) {
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
    if (currentPage === salaryStructure) {
      return (
        <div className={styles.greenText}>
          * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
        </div>
      );
    }
    return null;
  };

  _renderBottomButton = () => {
    const { pageId } = this.state;
    const { basicInformation, jobDetails, offerDetails, salaryStructure } = pageId;
    const { currentPage, checkMandatory } = this.props;
    const { filledBasicInformation, filledJobDetail } = checkMandatory;

    if (currentPage === basicInformation) {
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
    if (currentPage === jobDetails) {
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
    if (currentPage === offerDetails) {
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
    if (currentPage === salaryStructure) {
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
    const { pageId } = this.state;
    const { benefits } = pageId;
    const { currentPage, checkMandatory } = this.props;
    const { salaryStatus } = checkMandatory;
    if (salaryStatus === 1 && currentPage !== benefits) {
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
export default connect(({ info: { checkMandatory = {} } = {} }) => ({
  checkMandatory,
}))(BottomBar);
