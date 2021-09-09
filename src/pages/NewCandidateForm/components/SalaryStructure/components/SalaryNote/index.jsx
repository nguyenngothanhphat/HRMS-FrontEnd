import { Button, Form, Input } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import MessageIcon from '@/assets/candidatePortal/messageIcon.svg';
import styles from './index.less';

const { TextArea } = Input;

@connect(({ newCandidateForm: { data: { candidate = '' } } = {} }) => ({
  candidate,
}))
class SalaryNote extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = { contentVisible: true };
  }

  handleCollapse = () => {
    this.setState(({ contentVisible }) => ({
      contentVisible: !contentVisible,
    }));
  };

  renderHeader = () => {
    const { contentVisible } = this.state;
    return (
      <div className={styles.headerContainer} style={{ borderBottom: 'none' }}>
        <div className={styles.titleContainer}>
          <div className={styles.avatar}>
            <img src={MessageIcon} alt="message" />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>Add a note</span>
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

  renderForm = () => {
    const {
      salaryNoteTemp = '',
      onChange = () => {},
      onSubmit = () => {},
      disabled = false,
    } = this.props;
    return (
      <div className={styles.queryContent}>
        <Form ref={this.formRef} name="inputChatEmpty">
          <Form.Item name="message">
            <TextArea
              defaultValue={salaryNoteTemp}
              onChange={onChange}
              disabled={disabled}
              placeholder="Type a message..."
              autoSize={{ minRows: 6, maxRows: 10 }}
            />
          </Form.Item>
          <div className={styles.emptySendButton}>
            <Form.Item>
              <Button htmlType="submit" disabled={disabled} type="primary" onClick={onSubmit}>
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  };

  render() {
    const { contentVisible } = this.state;
    return (
      <div className={styles.SalaryNote}>
        <div className={styles.chatContainer}>
          {this.renderHeader()}
          {contentVisible && this.renderForm()}
        </div>
      </div>
    );
  }
}

export default SalaryNote;
