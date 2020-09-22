/* eslint-disable react/button-has-type */
import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import ItemMenu from './components/ItemMenu';
import PreviewOffer from '../../pages/FormTeamMember/components/PreviewOffer/index';
import BottomBar from '../BottomBar';

import s from './index.less';

export default class CommonLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemId: '',
      displayComponent: '',
    };
  }

  componentDidMount() {
    const { listMenu } = this.props;
    this.setState({
      selectedItemId: listMenu[0].id,
      displayComponent: listMenu[0].component,
    });
  }

  _handlePreviewOffer = () => {
    this.setState({
      selectedItemId: '',
      displayComponent: <PreviewOffer />,
    });
  };

  _handleClick = (item) => {
    this.setState({
      selectedItemId: item.id,
      displayComponent: item.component,
    });
  };

  handleNext = () => {
    const { selectedItemId } = this.state;
    const { listMenu = [] } = this.props;
    const nextItem = listMenu.find((element) => element.id === selectedItemId + 1);
    this.setState({
      selectedItemId: nextItem.id,
      displayComponent: nextItem.component,
    });
  };

  handlePrev = () => {
    const { selectedItemId } = this.state;
    const { listMenu = [] } = this.props;
    const prevItem = listMenu.find((element) => element.id === selectedItemId - 1);
    this.setState({
      selectedItemId: prevItem.id,
      displayComponent: prevItem.component,
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
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    this.setState({
                      selectedItemId: '',
                      displayComponent: <PreviewOffer />,
                    });
                  }}
                >
                  Preview offer letter
                </Button>
              )}

              {/* <button onClick={this.handleNext}> next </button> */}
            </div>
          </div>
        </div>
        <div className={s.viewRight}>
          {displayComponent}
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              {currentPage !== 'settings' && (
                <BottomBar
                  onClickPrev={this.handlePrev}
                  onClickNext={this.handleNext}
                  currentPage={selectedItemId}
                />
              )}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
