import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect, history } from 'umi';
import CustomModal from '@/components/CustomModal/index';
import RelievingTables from './components/RelievingTables';
import RelievingTemplates from './components/RelievingTemplates';
import ModalContent from './components/ModalContent';

import styles from './index.less';

@connect(
  ({
    offboarding: {
      defaultExitPackage = [],
      defaultClosingPackage = [],
      customExitPackage = [],
      customClosingPackage = [],
    } = {},
    user: { currentUser: { company: { _id = '' } = {}, company = {} } = {} } = {},
  }) => ({
    _id,
    company,
    defaultExitPackage,
    defaultClosingPackage,
    customExitPackage,
    customClosingPackage,
  }),
)
class RelievingFormalities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateId: '',
      isOpenModal: false,
    };
  }

  componentDidMount = () => {
    const { dispatch, _id } = this.props;
    dispatch({
      type: 'offboarding/getOffBoardingPackages',
      payload: {
        company: _id,
        packageType: 'CLOSING-PACKAGE',
        templateType: 'DEFAULT',
      },
    });
    dispatch({
      type: 'offboarding/getOffBoardingPackages',
      payload: {
        company: _id,
        packageType: 'EXIT-PACKAGE',
        templateType: 'DEFAULT',
      },
    });
    dispatch({
      type: 'offboarding/getOffBoardingPackages',
      payload: {
        company: _id,
        packageType: 'EXIT-PACKAGE',
        templateType: 'CUSTOM',
      },
    });
    dispatch({
      type: 'offboarding/getOffBoardingPackages',
      payload: {
        company: _id,
        packageType: 'CLOSING-PACKAGE',
        templateType: 'CUSTOM',
      },
    });
  };

  onOpenModal = (id) => {
    this.setState({
      isOpenModal: true,
      templateId: id,
    });
  };

  onCloseModal = () => {
    this.setState({
      isOpenModal: false,
    });
  };

  onReload = (type) => {
    const { dispatch, _id } = this.props;
    const exitPackageType = 'OFF_BOARDING-EXIT_PACKAGE';
    const customPackageType = 'OFF_BOARDING-CUSTOM_PACKAGE';
    switch (type) {
      case exitPackageType:
        dispatch({
          type: 'offboarding/getCustomExitPackage',
          payload: {
            company: _id,
            type: 'OFF_BOARDING-EXIT_PACKAGE',
          },
        });
        break;
      case customPackageType:
        dispatch({
          type: 'offboarding/getCustomExitPackage',
          payload: {
            company: _id,
            type: 'OFF_BOARDING-EXIT_PACKAGE',
          },
        });
        break;
      default:
        break;
    }
  };

  _renderModal = () => {
    const { isOpenModal, templateId } = this.state;
    return (
      <CustomModal
        open={isOpenModal}
        closeModal={this.onCloseModal}
        content={
          <ModalContent
            onReload={this.onReload}
            closeModal={this.onCloseModal}
            templateId={templateId}
          />
        }
      />
    );
  };

  handleViewingRelieving = async (id) => {
    const { dispatch, company } = this.props;
    const res = await dispatch({
      type: 'offboarding/fetchRelievingDetailsById',
      payload: {
        id,
        company,
        packageType: '',
      },
    });
    if (res) {
      // console.log(res);
      history.push(`/offboarding/relieving-detail/${id}`);
    }
  };

  render() {
    const {
      defaultExitPackage,
      defaultClosingPackage,
      customExitPackage,
      customClosingPackage,
    } = this.props;
    return (
      <div className={styles.relievingFormalities}>
        <a
          style={{ padding: '24px' }}
          onClick={() => this.handleViewingRelieving('5fc8b69a3b0978eb36da231d')}
        >
          Relieving Details
        </a>
        {this._renderModal()}
        {/* <p style={{ padding: '24px' }}>Content Relieving Formalities</p> */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={24} lg={17} xl={17}>
            <RelievingTables />
          </Col>
          <Col xs={24} sm={24} md={24} lg={7} xl={7}>
            <RelievingTemplates
              isOpenModal={this.onOpenModal}
              listTitle="Templates"
              exitPackageTemplates={defaultExitPackage}
              closingPackageTemplates={defaultClosingPackage}
            />
            <RelievingTemplates
              isOpenModal={this.onOpenModal}
              listTitle="Custom Templates"
              exitPackageTemplates={customExitPackage}
              closingPackageTemplates={customClosingPackage}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default RelievingFormalities;
