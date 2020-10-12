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
    return (
      <div className={styles.OrderSavedContent}>
        <img src={savedIcon} alt="icon" />
        <div className={styles.OrderSavedContent_title}>Order saved successfuly</div>
        <Button onClick={this.onCloseModal} type="primary">
          Close
        </Button>
      </div>
    );
  }
}

export default OrderSavedContent;
