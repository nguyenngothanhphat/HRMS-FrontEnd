import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect, NavLink } from 'umi';
import CustomModal from '@/components/CustomModal/index';
import RelievingTables from './components/RelievingTables';
import RelievingTemplates from './components/RelievingTemplates';
import ModalContent from './components/ModalContent';

import styles from './index.less';

@connect(
  ({
    offboarding: { defaultExitPackage = [] } = {},
    user: { currentuser: { company: { _id = '' } = {} } = {} } = {},
  }) => ({
    _id,
    defaultExitPackage,
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
      type: 'offboarding/getDefaultExitPackage',
      payload: {
        company: _id,
        type: 'OFF_BOARDING-EXIT_PACKAGE',
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

  _renderModal = () => {
    const { isOpenModal, templateId } = this.state;
    return (
      <CustomModal
        open={isOpenModal}
        closeModal={this.onCloseModal}
        content={<ModalContent closeModal={this.onCloseModal} templateId={templateId} />}
      />
    );
  };

  render() {
    const { defaultExitPackage } = this.props;
    return (
      <div className={styles.relievingFormalities}>
        <NavLink
          style={{ padding: '24px' }}
          to="/offboarding/relieving-detail/5fb79777cf47a32790312f46"
        >
          Relieving Details
        </NavLink>
        {this._renderModal()}
        {/* <p style={{ padding: '24px' }}>Content Relieving Formalities</p> */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={24} lg={17} xl={17}>
            <RelievingTables />
          </Col>
          <Col xs={24} sm={24} md={24} lg={7} xl={7}>
            <RelievingTemplates
              isOpenModal={() => this.onOpenModal()}
              listTitle="Templates"
              exitPackageTemplates={defaultExitPackage}
            />
            <RelievingTemplates listTitle="Custom Templates" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default RelievingFormalities;
