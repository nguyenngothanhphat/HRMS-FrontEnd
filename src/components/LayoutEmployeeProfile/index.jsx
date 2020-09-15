import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import ItemMenu from './components/ItemMenu';
import ViewInformation from './components/ViewInformation';
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

  _handelClick = (item) => {
    this.setState({
      selectedItemId: item.id,
      displayComponent: item.component,
    });
  };

  render() {
    const { listMenu = [] } = this.props;
    const { displayComponent, selectedItemId } = this.state;

    return (
      <div className={s.root}>
        <div className={s.viewLeft}>
          <div className={s.viewLeft__menu}>
            {listMenu.map((item) => (
              <ItemMenu
                key={item.id}
                item={item}
                handelClick={this._handelClick}
                selectedItemId={selectedItemId}
              />
            ))}
          </div>
        </div>
        <Row className={s.viewRight} gutter={[24, 0]}>
          <Col span={18}>{displayComponent}</Col>
          <Col span={6}>
            <ViewInformation />
          </Col>
        </Row>
      </div>
    );
  }
}
