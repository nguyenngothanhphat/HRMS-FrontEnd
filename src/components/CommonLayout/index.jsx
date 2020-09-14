import React, { PureComponent } from 'react';
import { Button } from 'antd';
import ItemMenu from './components/ItemMenu';
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
              <Button type="primary" ghost>
                Preview offer letter
              </Button>
            </div>
          </div>
        </div>
        <div className={s.viewRight}>{displayComponent}</div>
      </div>
    );
  }
}
