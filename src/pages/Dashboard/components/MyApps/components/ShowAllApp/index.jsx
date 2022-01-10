import { Modal, Row } from 'antd';
import React, { PureComponent } from 'react';
import AppCard from '../AppCard';
import styles from './index.less';
import styleMyApp from '../../index.less';

class ShowAllApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {};

  renderModalHeader = () => {
    const { title = '' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  renderModalContent = () => {
    const { myApps } = this.props;
    return (
      <div className={styleMyApp.content}>
        <Row gutter={[24, 24]}>
          {myApps.map((app) => (
            <AppCard app={app} />
          ))}
        </Row>
      </div>
    );
  };

  render() {
    const { visible = false } = this.props;

    return (
      <>
        <Modal
          className={styles.ShowAllApp}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={null}
          title={this.renderModalHeader()}
          centered
          visible={visible}
          width={750}
        >
          {this.renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default ShowAllApp;
