import React, { PureComponent } from 'react';
import { Button } from 'antd';
import SendQueryModal from '../SendQueryModal';
import styles from './index.less';

class QueryBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { openModal: false };
  }

  handleModal = (value) => {
    this.setState({
      openModal: value,
    });
  };

  render() {
    const { openModal } = this.state;
    return (
      <div className={styles.QueryBar}>
        <span className={styles.text}>
          Have queries? Send it to us and we’ll get back to you as soon as we can.
        </span>
        <Button type="primary" onClick={() => this.handleModal(true)}>
          Send
        </Button>
        <SendQueryModal visible={openModal} onClose={() => this.handleModal(false)} />
      </div>
    );
  }
}

export default QueryBar;
