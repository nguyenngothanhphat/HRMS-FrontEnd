/* eslint-disable consistent-return */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'umi';
import ItemMenu from './components/ItemMenu';
import PreviewOffer from '../../pages/FormTeamMember/components/PreviewOffer/index';
import BasicInformation from '../../pages/FormTeamMember/components/BasicInformation';
import BackgroundRecheck from '../../pages/FormTeamMember/components/BackgroundRecheck';
import BackgroundCheck from '../../pages/FormTeamMember/components/BackgroundCheckNew';
// import BottomBar from '../BottomBar';

import s from './index.less';

const PROCESS_STATUS = {
  PROVISIONAL_OFFER_DRAFT: 'DRAFT',
  FINAL_OFFERS_DRAFT: 'FINAL-OFFERS-DRAFT',

  SENT_PROVISIONAL_OFFERS: 'SENT-PROVISIONAL-OFFER',
  ACCEPTED_PROVISIONAL_OFFERS: 'ACCEPT-PROVISIONAL-OFFER',
  RENEGOTIATE_PROVISIONAL_OFFERS: 'RENEGOTIATE-PROVISONAL-OFFER',

  PENDING: 'PENDING-BACKGROUND-CHECK',
  ELIGIBLE_CANDIDATES: 'ELIGIBLE-CANDIDATE',
  INELIGIBLE_CANDIDATES: 'INELIGIBLE-CANDIDATE',

  SENT_FOR_APPROVAL: 'PENDING-APPROVAL-FINAL-OFFER',
  APPROVED_OFFERS: 'APPROVED-FINAL-OFFER',

  SENT_FINAL_OFFERS: 'SENT-FINAL-OFFERS',
  ACCEPTED_FINAL_OFFERS: 'ACCEPT-FINAL-OFFER',
  RENEGOTIATE_FINAL_OFFERS: 'RENEGOTIATE-FINAL-OFFERS',

  PROVISIONAL_OFFERS: 'DISCARDED-PROVISONAL-OFFER',
  FINAL_OFFERS: 'FINAL-OFFERS',
};

@connect(
  ({
    loading,
    candidateInfo: {
      currentStep = 0,
      displayComponent = {},
      data: { processStatus = '' } = {},
      tempData: {
        skip = 0,
        backgroundRecheck: { allDocumentVerified = false } = {},
        hidePreviewOffer,
        disablePreviewOffer,
      } = {},
      checkMandatory = {},
    } = {},
  }) => ({
    loadingUpdateByHr: loading.effects['candidateInfo/updateByHR'],
    currentStep,
    displayComponent,
    processStatus,
    skip,
    allDocumentVerified,
    hidePreviewOffer,
    disablePreviewOffer,
    checkMandatory,
  }),
)
class CommonLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemId: '',
      displayComponent: '',
      statusStep: {
        basicInfoStep: null,
        jobDetailStep: null,
        salaryStructureStep: null,
        backGroundCheckStep: null,
      },
    };
  }

  // componentDidUpdate(prevProp) {
  //   console.log('ReRender');
  // }

  static getDerivedStateFromProps(props) {
    const { listMenu, currentStep, processStatus = '' } = props;
    const {
      SENT_PROVISIONAL_OFFERS,
      SENT_FOR_APPROVAL,
      PENDING,
      ELIGIBLE_CANDIDATES,
      INELIGIBLE_CANDIDATES,
    } = PROCESS_STATUS;
    // const selectedItemId = listMenu[currentStep]

    // console.log(processStatus);
    // console.log(currentStep);

    // console.log(processStatus);

    if (currentStep !== null) {
      // if (processStatus === PROVISIONAL_OFFER_DRAFT && currentStep === 0) {
      //   console.log('HEEERE');
      //   return {
      //     selectedItemId: listMenu[0].id,
      //     displayComponent: <BasicInformation />,
      //   };
      // }
      if (
        (processStatus === PENDING ||
          processStatus === ELIGIBLE_CANDIDATES ||
          processStatus === INELIGIBLE_CANDIDATES) &&
        currentStep === 3
      ) {
        // console.log('HERE 1');
        return {
          selectedItemId: listMenu[3].id,
          displayComponent: <BackgroundRecheck />,
        };
      }
      if (processStatus === SENT_PROVISIONAL_OFFERS && currentStep === 3) {
        // console.log('Right here');
        return {
          selectedItemId: listMenu[3].id,
          displayComponent: <BackgroundCheck />,
        };
      }
      if (processStatus === SENT_FOR_APPROVAL && currentStep === 7) {
        // console.log('HERE 2');
        return {
          selectedItemId: '',
          displayComponent: <PreviewOffer />,
        };
      }
      if (currentStep === 7) {
        // console.log('HERE 2');
        return {
          selectedItemId: '',
          displayComponent: <PreviewOffer />,
        };
      }
      if (currentStep !== 7) {
        // console.log('HERE 3');
        return {
          selectedItemId: listMenu[currentStep].id,
          displayComponent: listMenu[currentStep].component,
        };
      }
    }

    // console.log('HERE 4');
    return {
      selectedItemId: listMenu[0].id,
      displayComponent: <BasicInformation />,
    };
  }

  componentDidMount() {
    const { listMenu, currentStep = 1, processStatus = '' } = this.props;
    const { SENT_FOR_APPROVAL, PROVISIONAL_OFFER_DRAFT } = PROCESS_STATUS;
    if (processStatus === PROVISIONAL_OFFER_DRAFT) {
      return {
        selectedItemId: listMenu[0].id,
        displayComponent: <BasicInformation />,
      };
    }

    if (processStatus === SENT_FOR_APPROVAL) {
      // console.log('HERE 6');
      return {
        selectedItemId: '',
        displayComponent: <PreviewOffer />,
      };
    }
    if (!listMenu[currentStep]) {
      return null;
    }

    // if (
    //   processStatus === PENDING ||
    //   processStatus === ELIGIBLE_CANDIDATES ||
    //   processStatus === INELIGIBLE_CANDIDATES
    // ) {
    //   console.log(listMenu[3].id);
    //   this.setState({
    //     selectedItemId: listMenu[3].id,
    //     displayComponent: <BackgroundRecheck />,
    //   });
    // }
    // if (processStatus === DRAFT) {
    //   return {
    //     selectedItemId: '',
    //     displayComponent: <BasicInformation />,
    //   };
    // }
    // console.log('HERE 7');
    this.setState({
      selectedItemId: listMenu[currentStep].id || 1,
      displayComponent: listMenu[currentStep].component || <BasicInformation />,
    });
  }

  componentDidUpdate(prevProps) {
    const { currentStep } = this.props;
    if (currentStep !== prevProps.currentStep) {
      this.checkStatusStep();
    }
  }

  _handlePreviewOffer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: 7,
        displayComponent: <PreviewOffer />,
      },
    });
  };

  _handleClick = (item) => {
    const { dispatch } = this.props;
    // console.log(item);
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: item.id - 1,
        displayComponent: item.component,
      },
    });
    this.setState({
      selectedItemId: item.id,
      displayComponent: item.component,
    });
  };

  disablePhase2 = () => {
    const { processStatus, skip } = this.props;
    return processStatus === 'DRAFT' && skip === 0;
  };

  checkStatusStep = () => {
    const {
      currentStep,
      checkMandatory: {
        filledBasicInformation,
        filledJobDetail,
        filledSalaryStructure,
        filledBackgroundCheck,
      } = {},
    } = this.props;
    const { statusStep } = this.state;
    const preIndex = currentStep - 1;
    if (preIndex < 0) {
      return null;
    }

    if (preIndex === 0 && filledBasicInformation) {
      this.setState({
        statusStep: {
          ...statusStep,
          basicInfoStep: preIndex,
        },
      });
    } else if (preIndex === 1 && filledJobDetail) {
      this.setState({
        statusStep: {
          ...statusStep,
          jobDetailStep: preIndex,
        },
      });
    } else if (preIndex === 2 && filledSalaryStructure) {
      this.setState({
        statusStep: {
          ...statusStep,
          salaryStructureStep: preIndex,
        },
      });
    } else if (preIndex === 3 && filledBackgroundCheck) {
      this.setState({
        statusStep: {
          ...statusStep,
          backGroundCheckStep: preIndex,
        },
      });
    }
  };

  isDisabled = (index) => {
    const {
      PROVISIONAL_OFFER_DRAFT,

      SENT_PROVISIONAL_OFFERS,

      // PENDING,
    } = PROCESS_STATUS;

    const {
      // allDocumentVerified,
      processStatus,
      skip,
      currentStep,
    } = this.props;
    const { statusStep } = this.state;
    if (skip === 1) {
      return false;
    }

    switch (processStatus) {
      case PROVISIONAL_OFFER_DRAFT:
      case SENT_PROVISIONAL_OFFERS: {
        if (
          index === currentStep ||
          index === statusStep.basicInfoStep ||
          index === statusStep.jobDetailStep ||
          index === statusStep.salaryStructureStep ||
          index === statusStep.backGroundCheckStep
        ) {
          return false;
        }
        return true;
      }

      // case PENDING: {
      //   if (allDocumentVerified) {
      //     return false;
      //   }

      //   if (index === 0 || index === 1 || index === 2 || index === 3) {
      //     return false;
      //   }

      //   return true;
      // }

      default:
        return false;
    }

    // if (this.disablePhase2()) {
    //   if (index === 4 || index === 5 || index === 6 || index === 7) {
    //     return true;
    //   }
    //   return false;
    // }
    // return false;
  };

  render() {
    const {
      listMenu = [],
      currentPage = '',
      hidePreviewOffer = false,
      disablePreviewOffer = false,
    } = this.props;
    const { displayComponent, selectedItemId } = this.state;
    return (
      <div className={s.containerCommonLayout}>
        <div className={s.viewLeft} style={currentPage === 'settings' ? { width: '300px' } : {}}>
          <div className={s.viewLeft__menu}>
            {listMenu.map((item, index) => (
              <ItemMenu
                key={item.id}
                item={item}
                handelClick={this._handleClick}
                selectedItemId={selectedItemId}
                isDisabled={this.isDisabled(index)}
              />
            ))}
            <div className={s.viewLeft__menu__btnPreviewOffer}>
              {currentPage !== 'settings' && !hidePreviewOffer && (
                <Button
                  type="primary"
                  className={this.isDisabled(8) || disablePreviewOffer ? s.disabled : ''}
                  ghost
                  onClick={() => {
                    if (this.isDisabled(8) || disablePreviewOffer) {
                      return;
                    }
                    this._handlePreviewOffer();
                  }}
                >
                  Preview offer letter
                </Button>
              )}
              {/* <button onClick={this.handleNext}> next </button> */}
            </div>
          </div>
        </div>
        <div className={s.viewRight} style={currentPage === 'settings' ? { padding: '0' } : {}}>
          {displayComponent}
        </div>
      </div>
    );
  }
}

export default CommonLayout;
