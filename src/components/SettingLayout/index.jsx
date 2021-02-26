/* eslint-disable react/button-has-type */
import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { connect } from 'umi';
import ItemMenu from './components/ItemMenu';
import PreviewOffer from '../../pages/FormTeamMember/components/PreviewOffer/index';
import BasicInformation from '../../pages/FormTeamMember/components/BasicInformation';
// import BottomBar from '../BottomBar';

import s from './index.less';

@connect(({ candidateInfo: { settingStep = 0, displayComponent = {} } = {} }) => ({
  settingStep,
  displayComponent,
}))
class SettingLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemId: '',
      displayComponent: '',
    };
  }

  static getDerivedStateFromProps(props) {
    const { listMenu = [], settingStep } = props;
    // const selectedItemId = listMenu[settingStep]
    if (settingStep !== null) {
      return {
        selectedItemId: listMenu[settingStep].id,
        displayComponent: listMenu[settingStep].component,
      };
    }

    return {
      selectedItemId: '',
      displayComponent: <PreviewOffer />,
    };
  }

  componentDidMount() {
    const { listMenu, settingStep = 1 } = this.props;
    if (!listMenu[settingStep]) {
      return;
    }
    this.setState({
      selectedItemId: listMenu[settingStep].id || 1,
      displayComponent: listMenu[settingStep].component || <BasicInformation />,
    });
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        settingStep: 0,
      },
    });
  };

  _handlePreviewOffer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        settingStep: null,
        displayComponent: <PreviewOffer />,
      },
    });
  };

  _handleClick = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        settingStep: item.id - 1,
        displayComponent: item.component,
      },
    });
    this.setState({
      selectedItemId: item.id,
      displayComponent: item.component,
    });
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
