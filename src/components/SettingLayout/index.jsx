/* eslint-disable react/button-has-type */
import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { history } from 'umi';
import ItemMenu from './components/ItemMenu';
// import PreviewOffer from '../../pages/NewCandidateForm/components/PreviewOffer/index';
import BasicInformation from '../../pages/NewCandidateForm/components/BasicInformation';
// import BottomBar from '../BottomBar';

import s from './index.less';

class SettingLayout extends PureComponent {
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
    // history.push(`/onboarding/list/review/preview-offer`);
  };

  _handleClick = (item) => {
    const { route = '' } = this.props;
    history.push(`/${route}/settings/${item.link}`);
  };

  render() {
    const { listMenu = [], currentPage = '' } = this.props;
    const { displayComponent, selectedItemId } = this.state;
    return (
      <div className={s.containerCommonLayout}>
        <div className={s.viewLeft} style={currentPage === 'settings' ? { width: '300px' } : {}}>
          <div className={s.viewLeft__menu}>
            {listMenu.map((item) => (
              <ItemMenu
                key={item.id}
                item={item}
                handelClick={this._handleClick}
                selectedItemId={selectedItemId}
              />
            ))}
            <div className={s.viewLeft__menu__btnPreviewOffer}>
              {currentPage !== 'settings' && (
                <Button type="primary" ghost onClick={this._handlePreviewOffer}>
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

export default SettingLayout;
