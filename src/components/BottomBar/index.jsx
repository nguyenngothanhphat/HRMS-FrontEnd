import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';

import { connect, formatMessage } from 'umi';

import styles from './index.less';

const CANDIDATE = {
  basicInformation: 10,
  jobDetails: 11,
  eligibilityDocuments: 12,
  offerDetails: 13,
  benefits: 14,
  salaryStructure: 15,
  payrollSettings: 16,
  customFields: 17,
  additionalOptions: 18,
};

const HR = {
  basicInformation: 1,
  jobDetails: 2,
  eligibilityDocuments: 3,
  offerDetails: 4,
  benefits: 5,
  salaryStructure: 6,
  payrollSettings: 7,
  customFields: 8,
  additionalOptions: 9,
};

@connect(
  ({
    info: { checkMandatory = {} } = {},
    candidateProfile: { checkCandidateMandatory = {} } = {},
  }) => ({
    // ,
    checkMandatory,
    checkCandidateMandatory,
  }),
)
class BottomBar extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     checkCandidateMandatory: {},
  //   };
  // }

  // static getDerivedStateFromProps(props) {
  //   if ('checkCandidateMandatory' in props) {
  //     return {
  //       checkCandidateMandatory: props.checkCandidateMandatory || {},
  //     };
  //   }
  //   return null;
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
    // const { pageId } = this.state;
    // const {
    //   basicInformation,
    //   jobDetails,
    //   offerDetails,
    //   salaryStructure,
    //   customFields,
    //   candidateBasicInfo,
    //   candidateJobDetails,
    // } = pageId;
    const { currentPage, checkMandatory, checkCandidateMandatory } = this.props;
    const { filledBasicInformation, filledJobDetail, filledCustomField } = checkMandatory;
    const { filledCandidateBasicInformation, filledCandidateJobDetails } = checkCandidateMandatory;
    if (currentPage === HR.basicInformation) {
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
    if (currentPage === CANDIDATE.basicInformation) {
      return !filledCandidateBasicInformation ? (
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

    if (currentPage === HR.jobDetails) {
      return !filledJobDetail ? (
        <div className={styles.normalText}>
          <div className={styles.redText}>*</div>All mandatory details must be filled to proceed
        </div>
      ) : (
        <div className={styles.greenText}>*All mandatory details have been filled</div>
      );
    }

    if (currentPage === CANDIDATE.jobDetails) {
      return !filledCandidateJobDetails ? (
        <div className={styles.normalText}>
          <div className={styles.redText}>*</div>All mandatory details must be filled to proceed
        </div>
      ) : (
        <div className={styles.greenText}>*All mandatory details have been filled</div>
      );
    }
    if (currentPage === HR.offerDetails) {
      return (
        <div className={styles.greenText}>
          * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
        </div>
      );
    }

    if (currentPage === HR.customFields) {
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
    if (currentPage === HR.salaryStructure) {
      return (
        <div className={styles.greenText}>
          * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
        </div>
      );
    }
    return null;
  };

  _renderBottomButton = () => {
    const { currentPage, checkMandatory, checkCandidateMandatory } = this.props;
    const { filledBasicInformation, filledJobDetail, filledCustomField } = checkMandatory;
    const { filledCandidateBasicInformation, filledCandidateJobDetails } = checkCandidateMandatory;
    // console.log('filledCandidateBasicInformation', filledCandidateBasicInformation);

    if (currentPage === HR.basicInformation) {
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
    if (currentPage === CANDIDATE.basicInformation) {
      return (
        <Button
          type="primary"
          onClick={this.onClickNext}
          className={`${styles.bottomBar__button__primary} ${
            !filledCandidateBasicInformation ? styles.bottomBar__button__disabled : ''
          }`}
          disabled={!filledCandidateBasicInformation}
        >
          Next
        </Button>
      );
    }
    if (currentPage === HR.jobDetails) {
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
    if (currentPage === CANDIDATE.jobDetails) {
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
              !filledCandidateJobDetails ? styles.bottomBar__button__disabled : ''
            }`}
            disabled={!filledCandidateJobDetails}
          >
            Next
          </Button>
        </>
      );
    }
    if (currentPage === HR.offerDetails) {
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
    if (currentPage === HR.salaryStructure) {
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
    if (currentPage === HR.customFields) {
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
              !filledCustomField ? styles.bottomBar__button__disabled : ''
            }`}
            disabled={!filledCustomField}
          >
            Next
          </Button>
        </>
      );
    }
    return null;
  };

  _renderBottomBar = () => {
    const { currentPage, checkMandatory: { salaryStatus = 0 } = {} } = this.props;
    if (
      (salaryStatus !== 1 && currentPage === HR.salaryStructure) ||
      currentPage === HR.benefits ||
      currentPage === HR.eligibilityDocuments
    ) {
      return null;
    }
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
  };

  render() {
    console.log('render');
    const { checkCandidateMandatory } = this.props;
    const { filledCandidateBasicInformation } = checkCandidateMandatory;
    return <>{this._renderBottomBar()}</>;
  }
}

export default BottomBar;
