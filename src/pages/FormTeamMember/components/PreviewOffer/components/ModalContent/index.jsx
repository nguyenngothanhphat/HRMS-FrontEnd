import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import img1 from './images/modal_img_1.png';
import img2 from './images/modal_img_2.png';

const CONTENT_LIST = [
  {
    header: 'The form has been successfully been shared',
    body: 'The copy of the form has also been mailed to you and the HR manager',
    image: img1,
    button: 'Ok',
    buttonType: 'markAsDone',
  },
];

class ModalContent extends PureComponent {
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
    const { isSentEmail, isMarkAsDone, privateEmail = '' } = this.props;
    // if (isSentEmail) {
    //   this.setState({
    //     content: {
    //       header: `The form has been successfully sent to ${privateEmail} `,
    //       body: 'The copy of the form has also been mailed to you and the HR manager',
    //       image: img1,
    //       button: 'Ok',
    //       buttonType: 'sendEmail',
    //     },
    //   });
    // } else if (isMarkAsDone) {
    //   this.setState({
    //     content: CONTENT_LIST[0],
    //   });
    // }
  }

  render() {
    const { closeModal, candidateEmail } = this.props;
    const { content } = this.state;
    const { header, body, image, button } = content;
    return (
      <div className={styles.modalContent}>
        <div className={styles.imgContainer}>
          <img src={img2} alt="send mail" />
        </div>
        <div className={styles.contentContainer}>
          <h2 className={styles.header}>Final offer has been sent to candidate</h2>
          <p className={styles.content}>Final offer has been sent to {candidateEmail}</p>
          <div className={styles.btnContainer}>
            <Button className={styles.btn} onClick={closeModal}>
              OK
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalContent;
