import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import HRIcon2 from '@/assets/candidatePortal/HRViolet.svg';
import HRIcon3 from '@/assets/candidatePortal/HRRed.svg';
import ActiveChat from './components/ActiveChat';
import MessageList from './components/MessageList';
import styles from './index.less';

const messages = [
  {
    _id: 1,
    sender: 'HR Lolypop',
    title: `What’s next?`,
    time: 'Today',
    chat: [
      {
        _id: 1,
        sender: true,
        content: `Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with...`,
      },
      {
        _id: 2,
        sender: false,
        content: `Thank you for the warm welcome! Looking forward to working 
        with everyone! Thank you for the warm welcome! Looking forward
        to working with everyone! Great meeting you!`,
      },
    ],
    icon: HRIcon1,
  },
  {
    _id: 2,
    sender: 'HR Lolypop',
    title: 'Welcome to Lollypop Design Studio!',
    chat: [
      {
        _id: 1,
        sender: true,
        content: `Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with...`,
      },
      {
        _id: 2,
        sender: false,
        content: `Hhehe`,
      },
      {
        _id: 3,
        sender: false,
        content: `I know`,
      },
    ],
    icon: HRIcon2,
    time: 'July 15th',
  },
  {
    _id: 3,
    sender: 'HR Lolypop',
    title: 'Welcome to Terralogic Family!',
    chat: [
      {
        _id: 1,
        sender: true,
        content: `Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with...`,
      },
      {
        _id: 2,
        sender: true,
        content: `Nice to meet you!`,
      },
      {
        _id: 3,
        sender: false,
        content: `Thank you for the warm welcome! Looking forward to working 
        with everyone! Thank you for the warm welcome! Looking forward
        to working with everyone! Great meeting you!`,
      },
    ],
    icon: HRIcon3,
    time: 'Yesterday',
  },
  {
    _id: 4,
    sender: 'HR Lolypop',
    title: `What’s next?`,
    chat: [
      {
        _id: 1,
        sender: true,
        content: `Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with...`,
      },
      {
        _id: 2,
        sender: false,
        content: `Thank you for the warm welcome! Looking forward to working 
        with everyone! Thank you for the warm welcome! Looking forward
        to working with everyone! Great meeting you!`,
      },
    ],
    icon: HRIcon1,
    time: 'Yesterday',
  },
  {
    _id: 5,
    sender: 'HR Lolypop',
    title: 'Welcome to Lollypop Design Studio!',
    chat: [
      {
        _id: 1,
        sender: true,
        content: `Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with...`,
      },
      {
        _id: 2,
        sender: false,
        content: `Thank you for the warm welcome! Looking forward to working 
        with everyone! Thank you for the warm welcome! Looking forward
        to working with everyone! Great meeting you!`,
      },
    ],
    icon: HRIcon2,
    time: 'Yesterday',
  },
  {
    _id: 6,
    sender: 'HR Lolypop',
    title: 'Welcome to Terralogic Family!',
    chat: [
      {
        _id: 1,
        sender: true,
        content: `Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with...`,
      },
      {
        _id: 2,
        sender: false,
        content: `Thank you for the warm welcome! Looking forward to working 
        with everyone! Thank you for the warm welcome! Looking forward
        to working with everyone! Great meeting you!`,
      },
    ],
    icon: HRIcon3,
    time: 'Yesterday',
  },
];
class Messages extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeId: messages[0]?._id || '',
    };
  }

  onChangeActiveId = (activeId) => {
    this.setState({
      activeId,
    });
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  render() {
    const { activeId } = this.state;
    return (
      <div className={styles.Messages}>
        <Row type="flex" gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <MessageList
              messages={messages}
              activeId={activeId}
              onChangeActiveId={this.onChangeActiveId}
            />
          </Col>
          <Col xs={24} lg={16}>
            <ActiveChat messages={messages} activeId={activeId} />
          </Col>
        </Row>
      </div>
    );
  }
}
export default Messages;
