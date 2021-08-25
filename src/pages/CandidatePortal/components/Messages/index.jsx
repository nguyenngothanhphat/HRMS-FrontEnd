import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
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
      {
        _id: 4,
        sender: false,
        content: `I know`,
      },
      {
        _id: 5,
        sender: false,
        content: `I know`,
      },
      {
        _id: 6,
        sender: false,
        content: `I know`,
      },
      {
        _id: 7,
        sender: true,
        content: `I know`,
      },
      {
        _id: 8,
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
@connect(
  ({
    conversation: { conversationList = [] } = {},
    // user: { currentUser: { candidate = {} } } = {},
    candidatePortal: { candidate = '', data: { assignTo = {} } } = {},
    candidatePortal = {},
  }) => ({
    conversationList,
    candidate,
    assignTo,
    candidatePortal,
  }),
)
class Messages extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeId: messages[0]?._id || '',
    };
  }

  componentDidUpdate = (prevProps) => {
    const { candidate = '' } = this.props;
    if (prevProps.candidate !== candidate) {
      this.fetchConversations();
    }
  };

  // fetch data
  fetchConversations = async () => {
    const { dispatch, candidate: candidateId = '', assignTo: { _id: hrId = '' } = {} } = this.props;
    const getConversationList = () => {
      return dispatch({
        type: 'conversation/getUserConversationsEffect',
        payload: {
          userId: candidateId,
        },
      });
    };
    const res = await getConversationList();
    if (res.statusCode === 200) {
      if (res.data.length === 0) {
        const res1 = await dispatch({
          type: 'conversation/addNewConversationEffect',
          payload: {
            senderId: candidateId,
            receiverId: hrId,
          },
        });
        if (res1.statusCode === 200) {
          getConversationList();
        }
      }
    }
  };

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
    const { conversationList = [] } = this.props;
    return (
      <div className={styles.Messages}>
        <Row type="flex" gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <MessageList
              messages={conversationList}
              activeId={activeId}
              onChangeActiveId={this.onChangeActiveId}
            />
          </Col>
          <Col xs={24} lg={16}>
            <ActiveChat activeId={activeId} />
          </Col>
        </Row>
      </div>
    );
  }
}
export default Messages;
