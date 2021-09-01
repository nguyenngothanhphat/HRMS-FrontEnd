/* eslint-disable consistent-return */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { Button, Col, Row } from 'antd';
import { connect, history } from 'umi';
import { PROCESS_STATUS } from '@/utils/onboarding';
import ItemMenu from './components/ItemMenu';
import PreviewOffer from '../../pages/NewCandidateForm/components/PreviewOffer/index';
import BasicInformation from '../../pages/NewCandidateForm/components/BasicInformation';
import BackgroundRecheck from '../../pages/NewCandidateForm/components/BackgroundRecheck';
import DocumentVerification from '../../pages/NewCandidateForm/components/DocumentVerification';
// import BottomBar from '../BottomBar';
import s from './index.less';

@connect(
  ({
    loading,
    newCandidateForm: {
      currentStep = 0,
      displayComponent = {},
      data: { processStatus = '' } = {},
      tempData: {
        skip = 0,
        backgroundRecheck: { allDocumentVerified = false } = {},
        hidePreviewOffer,
        disablePreviewOffer,
        checkStatus = {},
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
    this.fetchTab();
  }

  componentDidUpdate(prevProps) {
    const { tabName = '' } = this.props;
    if (prevProps.tabName !== tabName) {
      this.fetchTab();
    }
  }

  fetchTab = () => {
    const { listMenu, tabName = '' } = this.props;
    const findTab = listMenu.find((menu) => menu.link === tabName) || listMenu[0];

    this.setState({
      selectedItemId: findTab.id || 1,
      displayComponent: findTab.component || <BasicInformation />,
    });
  };

  _handlePreviewOffer = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'newCandidateForm/save',
    //   payload: {
    //     displayComponent: <PreviewOffer />,
    //   },
    // });
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
    } = this.props;

    const { displayComponent, selectedItemId } = this.state;
    const listMenuWithoutOfferLetter = listMenu.filter((l) => l.key !== 'offerLetter');
    return (
      <Row className={s.containerLayoutAddCandidateForm}>
        <Col sm={24} md={6} xl={4} className={s.viewLeft}>
          <div className={s.viewLeft__menu}>
            {listMenuWithoutOfferLetter.map((item, index) => (
              <ItemMenu
                key={item.id}
                item={item}
                handelClick={this._handleClick}
                selectedItemId={selectedItemId}
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
