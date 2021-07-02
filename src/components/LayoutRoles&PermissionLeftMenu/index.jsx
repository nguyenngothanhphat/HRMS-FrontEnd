import React, { PureComponent } from 'react';
import { Row, Col, Modal, Affix } from 'antd';
import { connect } from 'umi';
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
    const { listMenu } = this.props;
    const getName = localStorage.getItem('Rolesname');
    const listMenuFilter = listMenu.filter((item) => item.name === getName);
    this.setState({
      selectedItemId: listMenuFilter[0].id,
      displayComponent: listMenuFilter[0].component,
    });
  }

  handleCLickItemMenu = (item) => {
    this.setState({
      selectedItemId: item.id,
      displayComponent: item.component,
    });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
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
