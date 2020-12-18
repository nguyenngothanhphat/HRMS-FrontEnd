import React, { PureComponent } from 'react';
import { Steps } from 'antd';
import styles from './index.less';

const { Step } = Steps;
class RightContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderIcon = (url) => {
    return <img className={styles.avatar} src={url} alt="avatar" />;
  };

  render() {
    const people = [
      {
        id: 1,
        body: '',
        text: 'Rose Mary',
        avatar:
          'https://i1.wp.com/nicholegabrielle.com/wp-content/uploads/2019/04/sample-avatar-003.jpg',
      },
      {
        id: 2,
        body: '',
        text: 'Aditya Venkatesan',
        avatar:
          'https://i1.wp.com/nicholegabrielle.com/wp-content/uploads/2019/04/sample-avatar-003.jpg',
      },
      {
        id: 3,
        body: '',
        text: 'Thammu Ayappa',
        avatar:
          'https://i1.wp.com/nicholegabrielle.com/wp-content/uploads/2019/04/sample-avatar-003.jpg',
      },
    ];

    return (
      <div className={styles.RightContent}>
        <div className={styles.content}>
          <span className={styles.title}>Chain of approval</span>
          <Steps current={0} labelPlacement="vertical">
            {people.map((value, index) => {
              const { avatar = '', text = '' } = value;
              return <Step key={`${index + 1}`} icon={this.renderIcon(avatar)} title={text} />;
            })}
          </Steps>
        </div>
      </div>
    );
  }
}

export default RightContent;
