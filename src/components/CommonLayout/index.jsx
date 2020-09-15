/* eslint-disable react/button-has-type */
import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import ItemMenu from './components/ItemMenu';
<<<<<<< HEAD
import PreviewOffer from '../../pages/FormTeamMember/components/PreviewOffer/index';
=======
import BottomBar from '../BottomBar';

>>>>>>> master
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

  handleClick = (item) => {
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
    const { listMenu = [] } = this.props;
    const { displayComponent, selectedItemId } = this.state;

    return (
      <div className={s.containerCommonLayout}>
        <div className={s.viewLeft}>
          <div className={s.viewLeft__menu}>
            {listMenu.map((item) => (
              <ItemMenu
                key={item.id}
                item={item}
                handelClick={this.handleClick}
                selectedItemId={selectedItemId}
              />
            ))}
            <div className={s.viewLeft__menu__btnPreviewOffer}>
              <Button
                type="primary"
                ghost
                onClick={() =>
                  this.setState({
                    displayComponent: <PreviewOffer />,
                  })
                }
              >
                Preview offer letter
              </Button>
              {/* <button onClick={this.handleNext}> next </button> */}
            </div>
          </div>
        </div>
        <div className={s.viewRight}>
          {displayComponent}
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <BottomBar
                onClickPrev={this.handlePrev}
                onClickNext={this.handleNext}
                currentPage={selectedItemId}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
