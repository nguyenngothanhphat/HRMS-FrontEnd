import React, { PureComponent } from 'react';
import { Row, Col, Modal, Affix } from 'antd';
import { connect, history } from 'umi';
import ItemMenu from './components/ItemMenu';
import s from './index.less';

const { confirm } = Modal;

@connect(({ employeeProfile: { isModified } = {} }) => ({
  isModified,
}))
class CommonLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemId: '',
      displayComponent: '',
    };
  }

  componentDidMount() {
    this.fetchTab();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
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
      displayComponent: findTab.component,
    });
  };

  handleCLickItemMenu = (item) => {
    history.push(`/settings/${item.link}`);
  };

  showConfirm = (item) => {
    const _this = this;
    confirm({
      title: 'Save your changes ?',
      onOk() {
        _this.saveChanges(item);
      },
      onCancel() {
        _this.onCancel(item);
      },
    });
  };

  saveChanges = (item) => {};

  onCancel = (item) => {};

  render() {
    const { listMenu = [], isModified } = this.props;
    const { displayComponent, selectedItemId } = this.state;

    return (
      <div className={s.root}>
        <Affix offsetTop={105}>
          <div className={s.viewLeft}>
            <div className={s.viewLeft__menu}>
              {listMenu.map((item) => (
                <ItemMenu
                  key={item.id}
                  item={item}
                  handleClick={!isModified ? this.handleCLickItemMenu : this.showConfirm}
                  selectedItemId={selectedItemId}
                />
              ))}
            </div>
          </div>
        </Affix>
        <Row className={s.viewRight} gutter={[24, 0]}>
          <Col span={18}>{displayComponent}</Col>
        </Row>
      </div>
    );
  }
}

export default CommonLayout;
