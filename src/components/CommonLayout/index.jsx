import React, { PureComponent } from 'react';
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
      <div className={s.containerCommonLayout}>
        <div className={s.viewLeft}>
          {listMenu.map((item) => (
            <ItemMenu
              key={item.id}
              item={item}
              handelClick={this._handelClick}
              selectedItemId={selectedItemId}
            />
          ))}
        </div>
        <div className={s.viewRight}>{displayComponent}</div>
      </div>
    );
  }
}
