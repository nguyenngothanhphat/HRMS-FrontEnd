import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import img1 from './images/modal_img_1.png';

class ModalContentComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: {
        header: '',
        body: '',
        image: img1,
        button: '',
        buttonType: '',
      },
    };
  }

  componentDidMount() {
    this.setState({
      content: {
        header: `Thank you!`,
        body: 'The email has been sent!',
        image: img1,
        button: 'Ok',
        buttonType: 'sendEmail',
      },
    });
  }

  render() {
    const { closeModal } = this.props;
    const { content } = this.state;
    const { header, body, image, button } = content;
    return (
      <div className={styles.modalContent}>
        <div className={styles.imgContainer}>
          <img src={image} alt="step" />
        </div>
        <div className={styles.contentContainer}>
          <h2 className={styles.header}>{header}</h2>
          <p className={styles.content}>{body}</p>
          <div className={styles.btnContainer}>
            <Button className={styles.btn} onClick={closeModal}>
              {button}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalContentComponent;
