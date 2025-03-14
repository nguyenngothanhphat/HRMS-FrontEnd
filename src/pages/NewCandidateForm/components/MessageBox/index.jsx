import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Skeleton } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import MessageIcon from '@/assets/candidatePortal/messageIcon.svg';
import { CHAT_EVENT } from '@/constants/socket';
import { getCurrentCompany } from '@/utils/authority';
import { socket } from '@/utils/socket';
import styles from './index.less';

const { TextArea } = Input;

@connect(
  ({
    conversation: {
      conversationList = [],
      activeConversationMessages = [],
      activeConversationUnseen = [],
    } = {},
    // user: { currentUser: { candidate = {} } } = {},
    newCandidateForm: {
      data: {
        candidate = '',
        assignTo = '',
        firstName: candidateFN = '',
        middleName: candidateMN = '',
        lastName: candidateLN = '',
        privateEmail: candidateEmail = '',
      },
    } = {},
    conversation = {},
    loading,
    user: { companiesOfUser = [] },
  }) => ({
    conversation,
    conversationList,
    candidate,
    candidateFN,
    candidateMN,
    candidateLN,
    candidateEmail,
    activeConversationUnseen,
    assignTo,
    activeConversationMessages,
    companiesOfUser,
    loadingMessages: loading.effects['conversation/getConversationMessageEffect'],
    loadingAddMessage: loading.effects['conversation/addNewMessageEffect'],
  }),
)
class MessageBox extends PureComponent {
  formRef = React.createRef();

  formRefEmptyChat = React.createRef();

  constructor(props) {
    super(props);
    this.state = { activeId: '', contentVisible: true };
    this.mesRef = React.createRef();
  }

  componentDidMount = async () => {
    this.scrollToBottom();

    const { dispatch, candidate, assignTo: hrId } = this.props;

    if (candidate) {
      const getConversationList = () => {
        return dispatch({
          type: 'conversation/getUserConversationsEffect',
          payload: {
            userId: candidate,
          },
        });
      };

      const res = await getConversationList();
      const { statusCode, data = [] } = res || {};
      if (statusCode === 200) {
        if (data.length > 0) {
          const find = data.find((d) => d.isReplyable) || data[data.length - 1];
          this.setState({
            activeId: find._id,
          });
          this.fetchMessages(find._id);
        } else {
          const addNewConversation = (isReplyable, title) => {
            return dispatch({
              type: 'conversation/addNewConversationEffect',
              payload: {
                senderId: hrId,
                receiverId: candidate,
                title,
                isReplyable,
                isSeen: false,
              },
            });
          };

          const { companiesOfUser = [] } = this.props;
          // get company name
          const currentCompany = companiesOfUser.find((c) => c._id === getCurrentCompany()) || {};
          const { name: companyName = '' } = currentCompany;

          const titleList = [`Welcome to ${companyName} !`, `HR ${companyName} !`];
          const res1 = await addNewConversation(false, titleList[0]);
          const res2 = await addNewConversation(true, titleList[1]);
          if (res1.statusCode === 200 && res2.statusCode === 200) {
            await getConversationList();
            this.setState({ activeId: res2.data?._id });
          }
        }
      }
    }
  };

  componentDidUpdate = (prevProps) => {
    const { activeConversationMessages = [] } = this.props;
    if (
      JSON.stringify(activeConversationMessages) !==
      JSON.stringify(prevProps.conversation.activeConversationMessages)
    ) {
      this.scrollToBottom();
    }
  };

  componentWillUnmount = () => {
    // socket.on(CHAT_EVENT.DISCONNECT);
    const { dispatch } = this.props;
    dispatch({
      type: 'conversation/clearState',
    });
  };

  handleCollapse = () => {
    this.setState(({ contentVisible }) => ({
      contentVisible: !contentVisible,
    }));
  };

  saveNewMessage = (message) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'conversation/saveNewMessage',
      payload: message,
    });
  };

  scrollToBottom = () => {
    if (this.mesRef.current) {
      this.mesRef.current.scrollTop = this.mesRef.current.scrollHeight;
    }
  };

  fetchMessages = async (activeId) => {
    const { dispatch } = this.props;
    if (activeId) {
      await dispatch({
        type: 'conversation/getConversationMessageEffect',
        payload: {
          conversationId: activeId,
        },
      });
      this.scrollToBottom();
    }
  };

  // chat container
  renderSender = () => {
    const { contentVisible } = this.state;
    return (
      <div
        className={styles.senderContainer}
        style={contentVisible ? {} : { borderBottom: 'none' }}
      >
        <div className={styles.titleContainer}>
          <div className={styles.avatar}>
            <img src={MessageIcon} alt="message" />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>Messages</span>
          </div>
        </div>
        <div className={styles.collapse} onClick={this.handleCollapse}>
          {contentVisible ? (
            <MinusOutlined className={styles.collapseIcon} />
          ) : (
            <PlusOutlined className={styles.collapseIcon} />
          )}
        </div>
      </div>
    );
  };

  renderChatContent = (chat = []) => {
    const { candidate = '' } = this.props;
    const { candidateFN = '', candidateLN = '' } = this.props;
    const candidateMessage = (item, index) => {
      return (
        <div key={index} className={styles.candidateMessage}>
          <div className={styles.above}>
            <div className={styles.textAvatar}>
              {`${candidateFN ? candidateFN.charAt(0) : 'U'}${
                candidateLN ? candidateLN.charAt(0) : 'S'
              }`}
            </div>
            <div className={styles.messageBody}>
              <span className={styles.name}>{item.text || ''}</span>
            </div>
          </div>
          <div className={styles.seenDate}>
            <span className={styles.name}>{moment(item.createdAt).locale('en').format('LT')}</span>
          </div>
        </div>
      );
    };
    const senderMessage = (item, index) => {
      return (
        <div key={index} className={styles.senderMessage}>
          <div className={styles.above}>
            <div className={styles.avatar}>
              <img src={HRIcon1} alt="sender-avatar" />
            </div>
            <div className={styles.messageBody}>
              <span className={styles.name}>{item.text || ''}</span>
            </div>
          </div>
          <div className={styles.seenDate}>
            <span className={styles.name}>{moment(item.createdAt).locale('en').format('LT')}</span>
          </div>
        </div>
      );
    };

    return (
      <div className={styles.contentContainer} ref={this.mesRef}>
        {chat.map((item, index) => {
          if (item.sender === candidate || item.senderId === candidate) {
            return candidateMessage(item, index);
          }
          return senderMessage(item, index);
        })}
      </div>
    );
  };

  onSeenMessage = () => {
    const {
      dispatch,
      assignTo: { _id: userId },
      activeConversationUnseen,
    } = this.props;
    const { activeId: conversationId } = this.state;
    activeConversationUnseen.forEach(async (item) => {
      if (item._id === conversationId) {
        await dispatch({
          type: 'conversation/seenMessageEffect',
          payload: {
            userId,
            conversationId,
          },
        });
        await dispatch({
          type: 'conversation/getConversationUnSeenEffect',
          payload: {
            userId,
          },
        });
      }
    });
  };

  // chat input
  renderInput = () => {
    const { loadingMessages } = this.props;
    const { activeId } = this.state;

    return (
      <div className={styles.inputContainer}>
        <Form ref={this.formRef} name="inputChat" onFinish={this.onSendClick}>
          <Form.Item name="message">
            <Input.TextArea
              onFocus={this.onSeenMessage}
              autoSize={{ minRows: 1, maxRows: 4 }}
              maxLength={255}
              placeholder="Type a message..."
              disabled={loadingMessages || !activeId}
            />
          </Form.Item>
          <Form.Item>
            <Button disabled={loadingMessages || !activeId} htmlType="submit">
              Reply
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  onSendClick = async (values) => {
    const {
      dispatch,
      assignTo: hrId,
      candidate = '',
      candidateEmail = '',
      candidateFN = '',
      candidateMN = '',
      candidateLN = '',
    } = this.props;
    const { activeId } = this.state;
    const { message } = values;
    if (activeId && message) {
      socket.emit(CHAT_EVENT.SEND_MESSAGE, {
        conversationId: activeId,
        senderId: hrId?._id || hrId || '',
        receiverId: candidate,
        text: message,
      });

      let candidateName = `${candidateFN} ${candidateLN}`;
      if (candidateMN) candidateName = `${candidateFN} ${candidateMN} ${candidateLN}`;
      dispatch({
        type: 'conversation/addNewMessageEffect',
        payload: {
          conversationId: activeId,
          sender: hrId,
          text: message,
          candidateEmail,
          candidateName,
        },
      });

      if (this.formRef?.current) {
        this.formRef.current.setFieldsValue({
          message: '',
        });
      }
      if (this.formRefEmptyChat?.current) {
        this.formRefEmptyChat.current.setFieldsValue({
          message: '',
        });
      }
    }
    this.scrollToBottom();
  };

  // for empty chat
  renderEmptyChat = () => {
    const { contentVisible } = this.state;
    return (
      <div className={styles.senderContainer} style={{ borderBottom: 'none' }}>
        <div className={styles.titleContainer}>
          <div className={styles.avatar}>
            <img src={MessageIcon} alt="message" />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>Send a note</span>
          </div>
        </div>
        <div className={styles.collapse} onClick={this.handleCollapse}>
          {contentVisible ? (
            <MinusOutlined className={styles.collapseIcon} />
          ) : (
            <PlusOutlined className={styles.collapseIcon} />
          )}
        </div>
      </div>
    );
  };

  renderFirstMessageTextArea = () => {
    const { loadingAddMessage = false } = this.props;
    return (
      <div className={styles.queryContent}>
        <span className={styles.describeText}>Message</span>

        <Form ref={this.formRef1} name="inputChatEmpty" onFinish={this.onSendClick}>
          <Form.Item name="message">
            <TextArea placeholder="Type a message..." autoSize={{ minRows: 4, maxRows: 10 }} />
          </Form.Item>
          <div className={styles.emptySendButton}>
            <Form.Item>
              <Button loading={loadingAddMessage} htmlType="submit" type="primary">
                Send
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  };

  render() {
    const { activeConversationMessages: messages = [], loadingMessages = false } = this.props;
    const { contentVisible } = this.state;
    if (loadingMessages) {
      return (
        <div className={styles.MessageBox}>
          <div style={{ margin: '32px' }}>
            <Skeleton />
          </div>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className={styles.MessageBox} style={contentVisible ? { minHeight: '300px' } : {}}>
          <div className={styles.chatContainer}>
            {this.renderEmptyChat()}
            {contentVisible && this.renderFirstMessageTextArea()}
          </div>
        </div>
      );
    }
    return (
      <div className={styles.MessageBox} style={contentVisible ? { minHeight: '300px' } : {}}>
        <div className={styles.chatContainer}>
          {this.renderSender(messages)}
          {contentVisible && this.renderChatContent(messages)}
        </div>
        {contentVisible && this.renderInput()}
      </div>
    );
  }
}

export default MessageBox;
