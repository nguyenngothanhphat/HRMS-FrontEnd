import React, { PureComponent } from 'react';
import { Row, Col, Modal, Affix } from 'antd';
import { connect } from 'umi';
import ItemMenu from './components/ItemMenu';
import ViewInformation from './components/ViewInformation';
import s from './index.less';

const { confirm } = Modal;

@connect(
  ({
    companiesManagement: {
      isModified,
      originData: { companyDetails: { company: companyDetailsOrigin = {} } = {} },
      tempData: { companyDetails: { company: companyDetails = {} } = {} },
    } = {},
  }) => ({
    isModified,
    companyDetailsOrigin,
    companyDetails,
  }),
)
class LayoutCompanyDetail extends PureComponent {
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
    // const { isModified } = this.props;
    // if (isModified) {
    //   this.showConfirm();
    // } else {
    this.setState({
      selectedItemId: item.id,
      displayComponent: item.component,
    });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // }
  };

  showConfirm = () => {
    const _this = this;
    confirm({
      title: 'Please save form before proceeding !',
      onOk() {
        _this.saveChanges();
      },
      onCancel() {
        _this.onCancel();
      },
    });
  };

  saveChanges = () => {};

  onCancel = () => {};

  render() {
    const { listMenu = [], companyDetailsOrigin } = this.props;
    const { displayComponent, selectedItemId } = this.state;

    return (
      <div className={s.layoutCompanyDetail}>
        <Affix offsetTop={105}>
          <div className={s.viewLeft}>
            <div className={s.viewLeft__menu}>
              {listMenu.map((item) => (
                <ItemMenu
                  key={item.id}
                  item={item}
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
            <ViewInformation companyDetails={companyDetailsOrigin} />
            {/* </Affix> */}
          </Col>
        </Row>
      </div>
    );
  }
}

export default LayoutCompanyDetail;
