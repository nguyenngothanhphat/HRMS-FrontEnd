/* eslint-disable consistent-return */
/* eslint-disable react/button-has-type */
import { Button, Col, Row, Spin } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import BasicInformation from '../../pages/NewCandidateForm/components/BasicInformation';
import ItemMenu from './components/ItemMenu';
// import BottomBar from '../BottomBar';
import s from './index.less';
import WithdrawOfferModal from '@/pages/NewCandidateForm/components/PreviewOffer/components/WithdrawOfferModal';
import ExtendOfferModal from '@/pages/NewCandidateForm/components/PreviewOffer/components/ExtendOfferModal';
import ModalContent from '@/pages/NewCandidateForm/components/PreviewOffer/components/ModalContent';
import { getCurrentTenant } from '@/utils/authority';
import CustomModal from '../CustomModal';

@connect(
  ({
    loading,
    newCandidateForm: {
      currentStep = 0,
      displayComponent = {},
      tempData: {
        skip = 0,
        backgroundRecheck: { allDocumentVerified = false } = {},
        hidePreviewOffer,
        disablePreviewOffer,
        checkStatus = {},
        processStatus = '',
      } = {},
      tempData = {},
      checkMandatory = {},
      data,
    } = {},
  }) => ({
    loadingUpdateByHr: loading.effects['newCandidateForm/updateByHR'],
    currentStep,
    loadingWithdrawOffer: loading.effects['newCandidateForm/withdrawOfferEffect'],
    loadingExtendOfferDate: loading.effects['newCandidateForm/extendOfferLetterEffect'],
    displayComponent,
    processStatus,
    data,
    tempData,
    skip,
    allDocumentVerified,
    hidePreviewOffer,
    disablePreviewOffer,
    checkMandatory,
    checkStatus,
  }),
)
class LayoutAddCandidateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemId: '',
      displayComponent: '',
      extendOfferModalVisible: false,
      withdrawOfferModalVisible: false,
      openModal3: false,
      openModal: false,
      openModal2: false,
      openModal4: false,
      openModal5: false,
    };
  }

  componentDidMount() {
    this.fetchTab();
  }

  componentDidUpdate(prevProps) {
    const { tabName = '' } = this.props;
    if (prevProps.tabName !== tabName) {
      this.fetchTab();
    }
  }

  fetchTab = () => {
    const { listMenu = [], tabName = '' } = this.props;

    const findTab = listMenu.find((menu) => menu.link === tabName) || listMenu[0];
    this.setState({
      selectedItemId: findTab.id || 1,
      displayComponent: findTab.component || <BasicInformation />,
    });
  };

  _handlePreviewOffer = () => {
    const { reId = '' } = this.props;
    history.push(`/onboarding/list/view/${reId}/${ONBOARDING_FORM_LINK.OFFER_LETTER}`);
  };

  _handleClick = (item) => {
    const { reId = '' } = this.props;
    history.push(`/onboarding/list/view/${reId}/${item.link}`);
  };

  handleSentForApproval = () => {
    const {
      dispatch,
      data,
      tempData,
      tempData: { hrSignature: hrSignatureProp } = {},
    } = this.props;
    const { data: { processStatus } = {} } = this.props;
    const isNeedsChanges = processStatus === NEW_PROCESS_STATUS.NEEDS_CHANGES;

    if (!dispatch) {
      return;
    }

    const { id } = hrSignatureProp;
    const { candidate } = data;
    const { skip = 0 } = tempData;
    // let option = 1;
    // if (valueToFinalOffer === 1) {
    //   option = 2;
    // } else {
    //   option = 1;
    // }
    // call API
    dispatch({
      type: 'newCandidateForm/sentForApprovalEffect',
      payload: { hrSignature: id, candidate, options: skip, tenantId: getCurrentTenant() },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        if (isNeedsChanges) {
          this.setState({ openModal5: true });
        } else {
          this.setState({ openModal2: true });
        }
      }
    });
  };

  handleSendFinalOffer = () => {
    const { dispatch, data, tempData: { hrSignature: hrSignatureProp } = {} } = this.props;
    if (!dispatch) {
      return;
    }
    const { id } = hrSignatureProp;
    const { candidate } = data;
    // call API
    dispatch({
      type: 'newCandidateForm/approveFinalOfferEffect',
      payload: { hrManagerSignature: id, candidate, options: 1, tenantId: getCurrentTenant() },
      action: 'accept',
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState({ openModal: true });
      }
    });
  };

  handleWithdrawOffer = async (reason) => {
    const { dispatch, data } = this.props;
    const { candidate } = data;
    const res = await dispatch({
      type: 'newCandidateForm/withdrawOfferEffect',
      payload: {
        candidate,
        reasonForWithdraw: reason,
      },
    });
    if (res.statusCode === 200) {
      this.setState({ withdrawOfferModalVisible: false });
      this.setState({ openModal4: true });
    }
  };

  onPrimaryButtonClick = () => {
    this.setState({ withdrawOfferModalVisible: true });
  };

  handleExtendOfferDate = async (newDate) => {
    const { dispatch, data, tempData: { expiryDate: expiryDateProp = '' } = {} } = this.props;

    const { candidate } = data;
    const res = await dispatch({
      type: 'newCandidateForm/extendOfferLetterEffect',
      payload: {
        candidate,
        expiryDate: newDate,
        oldExpiryDate: expiryDateProp,
      },
    });
    if (res.statusCode === 200) {
      this.setState({ extendOfferModalVisible: false });
    }
  };

  closeModal = () => {
    this.setState({ openModal: false });

    history.push(`/onboarding/list/offer-released`);
  };

  closeModal2 = () => {
    this.setState({ openModal2: false });
    history.push(`/onboarding/list/awaiting-approvals`);
  };

  closeModal4 = () => {
    this.setState({ openModal4: false });
    history.push(`/onboarding/list/withdrawn-offers`);
  };

  closeModal3 = () => {
    this.setState({ openModal3: false });
    const { data: { processStatus } = {} } = this.props;
    const isNeedsChanges = processStatus === NEW_PROCESS_STATUS.NEEDS_CHANGES;

    if (isNeedsChanges) {
      history.push(`/onboarding/list/needs-changes`);
    } else {
      history.push(`/onboarding/list/rejected-offer`);
    }
  };

  onSecondaryButtonClick = () => {
    const { data: { processStatus } = {}, tempData: { ticketID = '' } = {} } = this.props;
    const isSentOffer = processStatus === NEW_PROCESS_STATUS.OFFER_RELEASED;
    if (isSentOffer) {
      this.setState({ extendOfferModalVisible: true });
    } else {
      history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.OFFER_DETAILS}`);
    }
  };

  // checkDisableSecondButton = () => {
  //   const {
  //     tempData: { hrSignature, hrManagerSignature } = {},
  //     data: { processStatus = '' } = {},
  //   } = this.props;
  //   const isNewOffer = processStatus === NEW_PROCESS_STATUS.SALARY_NEGOTIATION;
  //   const isNeedsChanges = processStatus === NEW_PROCESS_STATUS.NEEDS_CHANGES;
  //   const isProfile = processStatus === NEW_PROCESS_STATUS.PROFILE_VERIFICATION;
  //   const isDocument = processStatus === NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION;
  //   const isReferences = processStatus === NEW_PROCESS_STATUS.REFERENCE_VERIFICATION;

  //   if (isNewOffer || isNeedsChanges || isReferences || isProfile || isDocument) {
  //     // if (!hrManagerSignature.url || !hrSignature.url) {
  //     return true;
  //     // }
  //   }

  //   return false;
  // };

  checkDisablePrimaryButton = () => {
    const {
      tempData: { hrSignature, hrManagerSignature } = {},
      data: { processStatus = '' } = {},
    } = this.props;
    const isSentOffer = processStatus === NEW_PROCESS_STATUS.OFFER_RELEASED;

    if (!isSentOffer) {
      // if (!hrManagerSignature.url || !hrSignature.url) {
      return true;
      // }
    }

    return false;
  };

  render() {
    const {
      listMenu = [],
      currentPage = '',
      // processStatus = '',
      currentStep,
      loading = false,
      loadingWithdrawOffer = false,
      loadingExtendOfferDate,
      tempData: { expiryDate: expiryDateProp = '' } = {},
      tempData = {},
      data: { privateEmail: mail = '' } = {},
    } = this.props;

    const {
      displayComponent,
      selectedItemId,
      withdrawOfferModalVisible,
      extendOfferModalVisible,
      openModal3,
      openModal,
      openModal4,
      openModal2,
      openModal5,
    } = this.state;
    const listMenuWithoutOfferLetter = listMenu.filter((l) => l.key !== 'offerLetter');

    return (
      <>
        <Row className={s.containerLayoutAddCandidateForm} gutter={[0, 24]}>
          <Col xs={24} md={6} xl={4} className={s.viewLeft}>
            <div className={s.viewLeft__menu}>
              {listMenuWithoutOfferLetter.map((item, index) => (
                <ItemMenu
                  key={item.id}
                  item={item}
                  handelClick={this._handleClick}
                  selectedItemId={selectedItemId}
                  isDisabled={currentStep < index}
                  isCompleted={currentStep > index}
                />
              ))}

              <div className={s.viewLeft__menu__btn}>
                <Button
                  type="secondary"
                  onClick={this.onSecondaryButtonClick}
                  className={[this.checkDisablePrimaryButton() ? s.disabled : '']}
                  disabled={this.checkDisablePrimaryButton()}
                >
                  Extend Offer Date
                </Button>
                <Button type="primary" onClick={this.onPrimaryButtonClick}>
                  Offer Withdrawn
                </Button>
              </div>
            </div>
          </Col>
          <Col sm={24} md={18} xl={20} style={currentPage === 'settings' ? { padding: 0 } : {}}>
            <Spin spinning={loading}>
              {' '}
              <div className={s.viewRight}>{displayComponent}</div>
            </Spin>
          </Col>
        </Row>

        <CustomModal
          open={openModal3}
          closeModal={this.closeModal3}
          content={
            <ModalContent
              closeModal={this.closeModal3}
              tempData={tempData}
              candidateEmail={mail}
              // type="reject"
              type="needs-changes"
            />
          }
        />
        <CustomModal
          open={openModal4}
          closeModal={this.closeModal4}
          content={
            <ModalContent
              closeModal={this.closeModal4}
              tempData={tempData}
              candidateEmail={mail}
              type="withdraw"
            />
          }
        />
        <CustomModal
          open={openModal}
          closeModal={this.closeModal}
          content={
            <ModalContent
              closeModal={this.closeModal}
              tempData={tempData}
              candidateEmail={mail}
              type="release"
            />
          }
        />

        <CustomModal
          open={openModal2}
          closeModal={this.closeModal2}
          content={
            <ModalContent
              closeModal={this.closeModal2}
              tempData={tempData}
              candidateEmail={mail}
              type="send-for-approval"
            />
          }
        />

        <CustomModal
          open={openModal5}
          closeModal={this.closeModal2}
          content={
            <ModalContent
              closeModal={this.closeModal2}
              tempData={tempData}
              candidateEmail={mail}
              type="needs-changes-for-approval"
            />
          }
        />
        <WithdrawOfferModal
          title="Offer Withdraw"
          visible={withdrawOfferModalVisible}
          onClose={() => this.setState({ withdrawOfferModalVisible: false })}
          loading={loadingWithdrawOffer}
          onFinish={this.handleWithdrawOffer}
        />

        {/* EXTEND OFFER  */}
        <ExtendOfferModal
          title="Extend offer letter date"
          visible={extendOfferModalVisible}
          onClose={() => this.setState({ extendOfferModalVisible: false })}
          onFinish={this.handleExtendOfferDate}
          currentExpiryDate={expiryDateProp}
          loading={loadingExtendOfferDate}
        />
      </>
    );
  }
}

export default LayoutAddCandidateForm;
