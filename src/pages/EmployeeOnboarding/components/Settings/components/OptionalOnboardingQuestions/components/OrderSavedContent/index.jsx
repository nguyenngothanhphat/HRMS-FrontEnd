import React, { Component } from 'react';
import { Button } from 'antd';
import savedIcon from './assets/savedIcon.svg';
import styles from './index.less';

class OrderSavedContent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onCloseModal = () => {
    const { closeModal = {} } = this.props;
    closeModal();
  };

  render() {
    const { message = 'Order saved successfuly' } = this.props;
    return (
      <div className={styles.OrderSavedContent}>
        <img src={savedIcon} alt="icon" />
        <div className={styles.OrderSavedContent_title}>{message}</div>
        <Button onClick={this.onCloseModal} type="primary">
          Close
        </Button>
      </div>
    );
  }
}

export default OrderSavedContent;
