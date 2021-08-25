import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import HRIcon2 from '@/assets/candidatePortal/HRViolet.svg';
import HRIcon3 from '@/assets/candidatePortal/HRRed.svg';
import ActiveChat from './components/ActiveChat';
import MessageList from './components/MessageList';

import styles from './index.less';

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
      activeId: '',
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
          this.setState({ activeId: res1.data[0]._id });
        }
      } else {
        this.setState({ activeId: res.data[0]._id });
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
