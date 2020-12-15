import React, { PureComponent } from 'react';
import { Button, Row, Col, Input } from 'antd';
import SideImage from '../../../../../../../public/assets/images/timeOffMan.svg';
import styles from './index.less';

const { TextArea } = Input;

export default class BidAdieu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isGoodbyeClick: false,
      goodbyeContent: '',
    };
  }

  onSayGoodbyeClick = () => {
    this.setState({
      isGoodbyeClick: true,
    });
  };

  onGoodByeContentChange = (event) => {
    const { target: { value = '' } = {} } = event;
    this.setState({
      goodbyeContent: value,
    });
  };

  sendMessage = () => {
    const { goodbyeContent } = this.state;
    console.log('SENT MESSAGE: ', goodbyeContent);
  };

  render() {
    const { isGoodbyeClick } = this.state;
    const {
      title = 'Bid Adieu',
      describe = (
        <p>
          Do not forget to write a small message to all in the company. You might include your
          contact information so people can connect with you.
        </p>
      ),
      buttonText = 'Say Goodbye !',
    } = this.props;
    return (
      <div className={styles.BidAdieu}>
        <Row>
          <Col span={isGoodbyeClick ? 24 : 14}>
            <div className={styles.abovePart}>
              <span className={styles.title}>{title}</span>
              <p className={styles.describe}>{describe}</p>
            </div>

            {!isGoodbyeClick && <Button onClick={this.onSayGoodbyeClick}>{buttonText}</Button>}
            {isGoodbyeClick && (
              <div>
                <TextArea autoSize={{ minRows: 6, maxRows: 12 }} />
                <div className={styles.submitButton}>
                  <Button type="primary" onClick={this.sendMessage}>
                    Send message
                  </Button>
                </div>
              </div>
            )}
          </Col>
          {!isGoodbyeClick && (
            <Col className={styles.sideContainer} span={10}>
              <div className={styles.sideImage}>
                <img src={SideImage} alt="side" />
              </div>
            </Col>
          )}
        </Row>
      </div>
    );
  }
}
