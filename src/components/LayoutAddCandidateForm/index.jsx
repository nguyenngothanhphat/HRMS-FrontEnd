/* eslint-disable consistent-return */
/* eslint-disable react/button-has-type */
import { Button, Col, Row, Spin } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { ONBOARDING_FORM_LINK } from '@/utils/onboarding';
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

  render() {
    const {
      listMenu = [],
      currentPage = '',
      hidePreviewOffer = false,
      disablePreviewOffer = false,
      // processStatus = '',
      currentStep,
      loading = false
    } = this.props;

    const { displayComponent, selectedItemId } = this.state;
    const listMenuWithoutOfferLetter = listMenu.filter((l) => l.key !== 'offerLetter');

    return (
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
        <Col sm={24} md={18} xl={20} style={currentPage === 'settings' ? { padding: 0 } : {}}>
          <Spin spinning={loading}>
            {' '}
            <div className={s.viewRight}>{displayComponent}</div>
          </Spin>
        </Col>
      </Row>
    );
  }
}

export default LayoutAddCandidateForm;
