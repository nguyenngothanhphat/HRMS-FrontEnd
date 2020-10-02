import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import img1 from './images/modal_img_1.png';

const CONTENT_LIST = [
  {
    header: 'The form has been successfully sent to Landonorris@gmail.com ',
    body: 'The copy of the form has also been mailed to you and the HR manager',
    image: img1,
    button: 'Ok',
    buttonType: 'sendEmail',
  },
  {
    header: 'The form has been successfully been shared',
    body: 'The copy of the form has also been mailed to you and the HR manager',
    image: img1,
    button: 'Ok',
    buttonType: 'markAsDone',
  },
];

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
    const { isSentEmail, isMarkAsDone } = this.props;
    if (isSentEmail) {
      this.setState({
        content: CONTENT_LIST[0],
      });
    } else if (isMarkAsDone) {
      this.setState({
        content: CONTENT_LIST[1],
      });
    }
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
