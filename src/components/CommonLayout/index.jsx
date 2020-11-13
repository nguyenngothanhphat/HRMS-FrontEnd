/* eslint-disable consistent-return */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { connect } from 'umi';
import ItemMenu from './components/ItemMenu';
import PreviewOffer from '../../pages/FormTeamMember/components/PreviewOffer/index';
import BasicInformation from '../../pages/FormTeamMember/components/BasicInformation';
import BackgroundRecheck from '../../pages/FormTeamMember/components/BackgroundRecheck';
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
        valueToFinalOffer = 0,
        backgroundRecheck: { allDocumentVerified = false } = {},
      } = {},
    } = {},
  }) => ({
    loadingUpdateByHr: loading.effects['candidateInfo/updateByHR'],
    currentStep,
    displayComponent,
    processStatus,
    valueToFinalOffer,
    allDocumentVerified,
  }),
)
class CommonLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemId: '',
      displayComponent: '',
    };
  }

  // componentDidUpdate(prevProp) {
  //   console.log('ReRender');
  // }

  static getDerivedStateFromProps(props) {
    const { listMenu, currentStep, processStatus = '' } = props;
    const { SENT_FOR_APPROVAL } = PROCESS_STATUS;
    // const selectedItemId = listMenu[currentStep]
    if (currentStep !== null) {
      if (processStatus === SENT_FOR_APPROVAL && currentStep === 7) {
        return {
          selectedItemId: '',
          displayComponent: <PreviewOffer />,
        };
      }
      if (currentStep !== 7) {
        return {
          selectedItemId: listMenu[currentStep].id,
          displayComponent: listMenu[currentStep].component,
        };
      }
    }

    return {
      selectedItemId: '',
      displayComponent: <PreviewOffer />,
    };
  }

  componentDidMount() {
    const { listMenu, currentStep = 1, processStatus = '' } = this.props;
    const {
      SENT_FOR_APPROVAL,
      PENDING,
      ELIGIBLE_CANDIDATES,
      INELIGIBLE_CANDIDATES,
    } = PROCESS_STATUS;
    if (
      processStatus === PENDING ||
      processStatus === ELIGIBLE_CANDIDATES ||
      processStatus === INELIGIBLE_CANDIDATES
    ) {
      return {
        selectedItemId: '',
        displayComponent: <BackgroundRecheck />,
      };
    }
    if (processStatus === SENT_FOR_APPROVAL) {
      return {
        selectedItemId: '',
        displayComponent: <PreviewOffer />,
      };
    }
    if (!listMenu[currentStep]) {
      return null;
    }
    this.setState({
      selectedItemId: listMenu[currentStep].id || 1,
      displayComponent: listMenu[currentStep].component || <BasicInformation />,
    });
  }

  _handlePreviewOffer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: null,
        displayComponent: <PreviewOffer />,
      },
    });
  };

  _handleClick = (item) => {
    const { dispatch } = this.props;
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
    const { processStatus, valueToFinalOffer } = this.props;
    return processStatus === 'DRAFT' && valueToFinalOffer === 0;
  };

  isDisabled = (index) => {
    const {
      PROVISIONAL_OFFER_DRAFT,
      FINAL_OFFERS_DRAFT,

      SENT_PROVISIONAL_OFFERS,
      ACCEPTED_PROVISIONAL_OFFERS,
      RENEGOTIATE_PROVISIONAL_OFFERS,

      PENDING,
      ELIGIBLE_CANDIDATES,
      INELIGIBLE_CANDIDATES,

      SENT_FOR_APPROVAL,
      APPROVED_OFFERS,

      SENT_FINAL_OFFERS,
      ACCEPTED_FINAL_OFFERS,
      RENEGOTIATE_FINAL_OFFERS,

      PROVISIONAL_OFFERS,
      FINAL_OFFERS,
    } = PROCESS_STATUS;

    const { allDocumentVerified, processStatus } = this.props;

    switch (processStatus) {
      case PROVISIONAL_OFFER_DRAFT:
      case SENT_PROVISIONAL_OFFERS: {
        if (index === 0 || index === 1 || index === 2 || index === 3) {
          return false;
        }
        return true;
      }

      case PENDING: {
        if (allDocumentVerified) {
          return false;
        }

        if (index === 0 || index === 1 || index === 2 || index === 3) {
          return false;
        }

        return true;
      }

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
    const { listMenu = [], currentPage = '' } = this.props;
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
              {currentPage !== 'settings' && (
                <Button
                  type="primary"
                  className={this.isDisabled(7) ? s.disabled : ''}
                  ghost
                  onClick={() => {
                    if (this.isDisabled(7)) {
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
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              {/* {currentPage !== 'settings' && (
                <BottomBar
                  onClickPrev={this.handlePrev}
                  onClickNext={this.handleNext}
                  currentPage={selectedItemId}
                />
              )} */}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CommonLayout;
