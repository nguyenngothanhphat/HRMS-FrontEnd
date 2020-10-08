/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Row, Col, Modal, Affix } from 'antd';
import { connect } from 'umi';
import ItemMenu from './components/ItemMenu';
import ViewInformation from './components/ViewInformation';
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
    this.setState({
      selectedItemId: listMenu[0].id,
      displayComponent: listMenu[0].component,
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

  saveChanges = (item) => {
    console.log('item', item);
  };

  onCancel = (item) => {
    console.log('item', item);
  };

  render() {
    const { listMenu = [] } = this.props;
    const { displayComponent, selectedItemId } = this.state;

    return (
      <div className={s.root}>
        <Affix offsetTop={90}>
          <div className={s.viewLeft}>
            <div className={s.viewLeft__menu}>
              {listMenu.map((item) => (
                <ItemMenu
                  key={item.id}
                  item={item}
                  // handleClick={!isModified ? this.handleCLickItemMenu : this.showConfirm}
                  handleClick={this.handleCLickItemMenu}
                  selectedItemId={selectedItemId}
                />
              ))}
            </div>
          </div>
        </Affix>
        <Row className={s.viewRight} gutter={[24, 0]}>
          <Col span={18}>{displayComponent}</Col>
          <Col span={6}>
            {/* <Affix offsetTop={115}> */}
            <ViewInformation />
            {/* </Affix> */}
          </Col>
        </Row>
      </div>
    );
  }
}

export default CommonLayout;
