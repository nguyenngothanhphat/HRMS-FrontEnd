/* eslint-disable consistent-return */
/* eslint-disable react/button-has-type */
import { Button, Col, Row } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import BasicInformation from '../../pages/NewCandidateForm/components/BasicInformation';
import ItemMenu from './components/ItemMenu';
// import BottomBar from '../BottomBar';
import s from './index.less';

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
      checkMandatory = {},
    } = {},
  }) => ({
    loadingUpdateByHr: loading.effects['newCandidateForm/updateByHR'],
    currentStep,
    displayComponent,
    processStatus,
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
    };
  }

  componentDidMount() {
    this.fetchTab('init');
  }

  componentDidUpdate(prevProps) {
    const { tabName = '' } = this.props;
    if (prevProps.tabName !== tabName) {
      this.fetchTab('click');
    }
  }

  fetchTab = (key = '') => {
    const { listMenu, currentStep, tabName = '' } = this.props;

    if (key === 'init') {
      const findTab = listMenu.find((menu, index) => currentStep === index) || listMenu[0];
      this.setState({
        selectedItemId: findTab.id || 1,
        displayComponent: findTab.component || <BasicInformation />,
      });
    } else {
      const findTab = listMenu.find((menu) => menu.link === tabName) || listMenu[0];
      this.setState({
        selectedItemId: findTab.id || 1,
        displayComponent: findTab.component || <BasicInformation />,
      });
    }
  };

  _handlePreviewOffer = () => {
    const { reId = '' } = this.props;
    history.push(`/onboarding/list/view/${reId}/offer-letter`);
  };

  _handleClick = (item) => {
    const { reId = '' } = this.props;
    history.push(`/onboarding/list/view/${reId}/${item.link}`);
  };

  disablePhase2 = () => {
    const { processStatus, skip } = this.props;
    return processStatus === 'DRAFT' && skip === 0;
  };

  render() {
    const {
      listMenu = [],
      currentPage = '',
      hidePreviewOffer = false,
      disablePreviewOffer = false,
      processStatus = '',
      currentStep,
    } = this.props;

    const { displayComponent, selectedItemId } = this.state;
    const listMenuWithoutOfferLetter = listMenu.filter((l) => l.key !== 'offerLetter');

    return (
      <Row className={s.containerLayoutAddCandidateForm}>
        <Col xs={24} md={6} xl={4} className={s.viewLeft}>
          <div className={s.viewLeft__menu}>
            {listMenuWithoutOfferLetter.map((item, index) => (
              <ItemMenu
                key={item.id}
                item={item}
                handelClick={this._handleClick}
                selectedItemId={selectedItemId}
                // isDisabled={currentStep < index}
                isCompleted={currentStep > index}
              />
            ))}
            <div className={s.viewLeft__menu__btnPreviewOffer}>
              {currentPage !== 'settings' && !hidePreviewOffer && (
                <Button
                  type="primary"
                  className={disablePreviewOffer ? s.disabled : ''}
                  ghost
                  onClick={() => {
                    if (disablePreviewOffer) {
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
        </Col>
        <Col
          sm={24}
          md={18}
          xl={20}
          className={s.viewRight}
          style={currentPage === 'settings' ? { padding: '0' } : {}}
        >
          {displayComponent}
        </Col>
      </Row>
    );
  }
}

export default LayoutAddCandidateForm;
