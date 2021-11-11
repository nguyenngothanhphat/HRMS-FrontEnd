import { Col, Row } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import ItemMenu from './components/ItemMenu';
import ViewInformation from './components/ViewInformation';
import s from './index.less';

@connect(({ loading }) => ({
  loadingUpdateByHr: loading.effects['newCandidateForm/updateByHR'],
}))
class LayoutProjectInformation extends Component {
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
      displayComponent: findTab.component,
    });
  };

  _handleClick = (item) => {
    const { reId = 'id' } = this.props;
    history.push(`/project-management/list/${reId}/${item.link}`);
  };

  render() {
    const { listMenu = [] } = this.props;
    const { displayComponent, selectedItemId } = this.state;

    return (
      <Row className={s.LayoutProjectInformation}>
        <Col xs={24} md={6} xl={4} className={s.viewLeft}>
          <div className={s.viewLeft__menu}>
            {listMenu.map((item) => (
              <ItemMenu
                key={item.id}
                item={item}
                handleClick={this._handleClick}
                selectedItemId={selectedItemId}
              />
            ))}
          </div>
        </Col>
        <Col xs={24} md={18} xl={20} className={s.viewRight}>
          <Row gutter={[24, 24]}>
            <Col xs={24} xl={18}>
              {displayComponent}
            </Col>
            <Col xs={24} xl={6}>
              <ViewInformation />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default LayoutProjectInformation;
