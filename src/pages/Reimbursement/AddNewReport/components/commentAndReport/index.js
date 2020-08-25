import React, { PureComponent } from 'react';
import { Row, Col, Tabs, Input, Button, Steps } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import MoreInfo from '@/assets/moreinfo.svg';
import Approve from '@/assets/approve.svg';
import Upload from '@/assets/upload.svg';
import Reject from '@/assets/reject.svg';
import { getMonth } from '@/utils/utils';
import { connect } from 'dva';

import styles from './index.less';

const { TabPane } = Tabs;
const { Step } = Steps;

@connect(({ user: { currentUser = {} } }) => ({
  currentUser,
}))
class CommentBox extends PureComponent {
  state = {
    comments: [],
    message: '',
    commentListRender: [],
    reportFlow: '',
  };

  componentDidMount() {
    const { item = {} } = this.props;
    if (item) {
      if (item.comments && item.comments.length > 0) {
        const arr = this.getDataComment(item.comments);
        this.setState({
          commentListRender: arr,
        });
      }
    }
  }

  onEnter = e => {
    if (e.keyCode === 13) {
      this.addComment();
    }
  };

  addComment = () => {
    const { comments = [], message = '', commentListRender = [] } = this.state;
    const { sendComment = () => {}, currentUser = {}, sendReportedComment = () => {} } = this.props;
    const day = new Date();
    if (message.trim() !== '') {
      this.setState(
        {
          comments: [...comments, message],
          message: '',
          commentListRender: [
            ...commentListRender,
            {
              id: currentUser.id,
              name: formatMessage({ id: 'employee.comment.currentUser' }),
              message,
              createDate: day,
            },
          ],
        },
        () => {
          sendComment([...comments, message]);
          sendReportedComment(message);
        }
      );
    }
  };

  onComment = e => {
    this.setState({
      message: e.target.value || '',
    });
  };

  getDataComment = data => {
    const { currentUser = {}, item = {} } = this.props;
    let arr = [];
    const day = new Date();
    data.map(cItem => {
      arr = [
        ...arr,
        {
          id: cItem.user._id,
          name:
            cItem.user._id === currentUser.id
              ? formatMessage({ id: 'employee.comment.currentUser' })
              : cItem.user.fullName || '',
          message: cItem.content,
          createDate: item.updatedAt || item.createdAt || day,
        },
      ];
      return arr;
    });
    return arr;
  };

  renderComment = (item, index) => {
    const day = new Date(item.createDate);
    const hour = day.getHours() > 12 ? day.getHours() - 12 : day.getHours();
    const min = day.getMinutes() < 10 ? `0${day.getMinutes()}` : day.getMinutes();
    const meridiem = day.getHours() > 12 ? 'PM' : 'AM';
    return (
      <div
        key={index}
        className={`${styles.comment_box_message} ${
          item.name !== formatMessage({ id: 'employee.comment.currentUser' })
            ? styles.comment_box_message_guest
            : ''
        }`}
      >
        <p>{item.name}</p>
        <p>{item.message}</p>
        <p>
          {hour}:{min} {meridiem}
        </p>
      </div>
    );
  };

  renderCommentBox = () => {
    const { item = {}, isNew = false } = this.props;
    const day =
      (Object.keys(item).length > 0 && item.updatedAt && !isNew) ||
      (Object.keys(item).length > 0 && item.createDate && !isNew)
        ? new Date(item.updatedAt || item.createdAt)
        : new Date();
    const date = day.getDate();
    const month = getMonth(day);
    const year = day.getFullYear();
    const { commentListRender = [], message = '' } = this.state;
    let idDisabled = item && item.status !== 'DRAFT' && item.status !== 'INQUIRY' && !isNew;
    if (
      item &&
      item.user &&
      item.status !== 'COMPLETE' &&
      item.status !== 'REJECT'
      // item.user.id !== currentUser.id
    ) {
      idDisabled = false;
    }
    return (
      <div>
        <div className={styles.comment_box_body}>
          {commentListRender.length > 0 ? (
            <div>
              <div className={styles.comment_box_date}>
                <p>
                  {month} {date}, {year}
                </p>
              </div>
              {commentListRender.map((nItem, index) => this.renderComment(nItem, index))}
            </div>
          ) : (
            <div className={styles.comment_box_empty}>
              <p>{formatMessage({ id: 'employee.new.box.empty.line_1' })}</p>
              <p>{formatMessage({ id: 'employee.new.box.empty.line_2' })}</p>
            </div>
          )}
        </div>
        <div className={styles.comment_box_type}>
          <div>
            <Input
              placeholder={formatMessage({ id: 'employee.input.placeholder' })}
              value={message}
              onChange={this.onComment}
              onKeyDown={this.onEnter}
              className={styles.comment_box_input}
              maxLength={160}
              disabled={idDisabled}
            />
            <Button
              type="link"
              disabled={idDisabled}
              onClick={this.addComment}
              className={`${styles.comment_box_button} ${
                idDisabled ? styles.comment_box_button_disabled : ''
              }`}
            >
              {formatMessage({ id: 'employee.new.box.send' })}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  renderIcon = icon => {
    return (
      <div className={styles.comment_box_report_icon}>
        <img alt="" src={icon} />
      </div>
    );
  };

  getDataReportHistory = item => {
    const {
      status = '',
      approvalInquiryHistory = [],
      approvalStep = 0,
      user = {},
      updatedAt = '',
      approvalHistory = [],
    } = item;
    let arr = [];
    if (status === 'DRAFT') return [];
    if (status === 'REJECT') {
      this.setState({
        reportFlow: 'error',
      });
    }
    if (approvalInquiryHistory.length > 0) {
      const submitArr = approvalInquiryHistory.filter(aItem => {
        return aItem.status === 'REPORTED';
      });
      if (submitArr.length <= 0) {
        arr = [
          ...arr,
          {
            id: user.id || user._id || '',
            name: user.fullName || user.firstName || '',
            reviewDate: updatedAt,
            content: '',
            type: 'submit',
          },
        ];
      }
      approvalInquiryHistory.map(nItem => {
        arr = [
          ...arr,
          {
            id: nItem.reviewerId,
            name: nItem.fullName,
            reviewDate: nItem.reviewDate,
            content: '',
            type: 'inquiry',
          },
        ];
        return arr;
      });
    }
    if (approvalStep === 0) {
      arr = [
        ...arr,
        {
          id: user.id || user._id || '',
          name: user.fullName || user.firstName || '',
          reviewDate: updatedAt,
          content: '',
          type: arr.length > 0 ? 'resubmit' : 'submit',
        },
      ];
    } else if (approvalHistory.length > 0) {
      const submitArr = approvalInquiryHistory.filter(aItem => {
        return aItem.status === 'REPORTED';
      });
      if (submitArr.length <= 0) {
        arr = [
          ...arr,
          {
            id: user.id || user._id || '',
            name: user.fullName || user.firstName || '',
            reviewDate: updatedAt,
            content: '',
            type: 'submit',
          },
        ];
      }
      approvalHistory.map(nItem => {
        let nStatus = '';
        switch (nItem.status) {
          case 'REJECT':
            nStatus = 'reject';
            break;
          case 'INQUIRY':
            nStatus = 'inquiry';
            break;
          default:
            nStatus = 'approve';
            break;
        }

        arr = [
          ...arr,
          {
            id: nItem.reviewerId,
            name: nItem.fullName,
            reviewDate: nItem.reviewDate,
            content: '',
            type: nStatus,
          },
        ];
        return arr;
      });
    }
    return arr;
  };

  renderDateStep = (item, index) => {
    const date = new Date(item.reviewDate);
    const month = getMonth(date);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const meridiem = date.getHours() > 12 ? 'PM' : 'AM';
    return (
      <Step
        key={index}
        className={styles.comment_report_step}
        title={`${month} ${day}, ${year}`}
        description={`${hour}:${min} ${meridiem}`}
      />
    );
  };

  renderDataContentStep = (item, index) => {
    let icon = null;
    let title = '';
    switch (item.type) {
      case 'resubmit':
        icon = Upload;
        title = `${item.name} re-submitted the report.`;
        break;
      case 'submit':
        icon = Upload;
        title = `${item.name} submitted the report.`;
        break;
      case 'inquiry':
        icon = MoreInfo;
        title = `${item.name} reviewed the report.`;
        break;
      case 'reject':
        icon = Reject;
        title = `${item.name} rejected the report.`;
        break;
      case 'approve':
        icon = Approve;
        title = `${item.name} approved the report`;
        break;
      default:
        icon = Approve;
        title = `${item.name} approved the report`;
        break;
    }
    return (
      <Step
        key={index}
        className={item.type === 'inquiry' ? styles.comment_report_step : ''}
        title={title}
        description={item.content}
        icon={this.renderIcon(icon)}
      />
    );
  };

  renderHistoryReport = data => {
    const { isNew } = this.props;
    const { reportFlow = '' } = this.state;
    return (
      <div>
        <div className={styles.comment_box_report_component}>
          {!isNew ? (
            <ul>
              <li>
                <Steps current={data.length} status={reportFlow} direction="vertical">
                  {data.map((item, index) => this.renderDateStep(item, index))}
                </Steps>
              </li>
              <li>
                <Steps
                  current={reportFlow !== 'error' ? data.length : data.length - 1}
                  status={reportFlow}
                  direction="vertical"
                  className={styles.comment_report_box_steps}
                >
                  {data.map((item, index) => this.renderDataContentStep(item, index))}
                </Steps>
              </li>
            </ul>
          ) : (
            <div className={styles.comment_box_report_empty}>
              <p>{formatMessage({ id: 'employee.new.box.reportHistory.empty' })}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { item = {} } = this.props;
    const data = this.getDataReportHistory(item);
    return (
      <Row>
        <Col
          span={24}
          style={{
            overflow: 'auto',
            marginBottom: '24px',
            boxShadow: '0 2px 4px 0 rgba(180, 180, 180, 0.5)',
          }}
        >
          <div className={styles.comment_box}>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <div className={styles.comment_box_title}>
                    {formatMessage({ id: 'employee.new.box.comment' })}
                  </div>
                }
                key="1"
              >
                {this.renderCommentBox()}
              </TabPane>
              <TabPane
                tab={
                  <div className={styles.comment_box_title}>
                    {formatMessage({ id: 'employee.new.box.historyReport' })}
                  </div>
                }
                key="2"
              >
                {this.renderHistoryReport(data)}
              </TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    );
  }
}

export default CommentBox;
