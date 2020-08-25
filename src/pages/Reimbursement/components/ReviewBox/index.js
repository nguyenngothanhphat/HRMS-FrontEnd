import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Menu, Icon, Dropdown, Button, Drawer } from 'antd';
import MessageBox from '../MessageBox';
import AssignBox from '../AssignBox';

@connect(({ user, loading, reimbursement: { item, errors, action: actionReimbursement } }) => ({
  user: user.currentUser,
  loading: loading.models.reimbursement,
  item,
  errors,
  actionReimbursement,
}))
class ReviewBox extends Component {
  state = { visible: false, visibleComment: false };

  showAssign = () => {
    this.setState({
      visible: true,
    });
  };

  hideAssign = () => {
    this.setState({
      visible: false,
    });
  };

  showDrawerComment = () => {
    this.setState({
      visibleComment: true,
    });
  };

  onCloseComment = () => {
    this.setState({
      visibleComment: false,
    });
  };

  showConfirm = type => {
    const { dispatch, reId } = this.props;
    const action = {
      approve: {
        title: formatMessage({ id: 'reimbursement.review.approve.confirm' }),
        onOk() {
          dispatch({ type: 'reimbursement/review', payload: { action: 'approve', reId } });
        },
      },
      complete: {
        title: formatMessage({ id: 'reimbursement.review.complete.confirm' }),
        onOk() {
          dispatch({ type: 'reimbursement/review', payload: { action: 'approve', reId } });
        },
      },
      reject: {
        title: formatMessage({ id: 'reimbursement.review.reject.confirm' }),
        onOk() {
          dispatch({ type: 'reimbursement/review', payload: { action: 'reject', reId } });
        },
      },
    };

    Modal.confirm({
      ...action[type],
    });
  };

  render() {
    const { status, commentDetai, user } = this.props;
    const { visible, visibleComment } = this.state;

    const menu = (
      <Menu>
        <Menu.Item
          onClick={() => {
            this.showConfirm(status === 'LEAD' ? 'complete' : 'approve');
          }}
        >
          <Icon style={{ color: '#87d068' }} type="check" />
          {status === 'LEAD'
            ? formatMessage({ id: 'common.status.complete' })
            : formatMessage({ id: 'common.approve' })}
        </Menu.Item>
        <Menu.Item onClick={() => this.showDrawerComment()}>
          <Icon style={{ color: '#eb2f96' }} type="form" />
          {formatMessage({ id: 'reimbursement.comment' })}
        </Menu.Item>
        {status === 'PENDING' && (
          <Menu.Item
            onClick={() => {
              this.showAssign();
            }}
          >
            <Icon style={{ color: '#5cdbd3' }} type="user" />
            {formatMessage({ id: 'common.assign' })}
          </Menu.Item>
        )}
        {status !== 'LEAD' && (
          <Menu.Item
            onClick={() => {
              this.showConfirm('reject');
            }}
          >
            <Icon style={{ color: '#f50' }} type="close" />
            {formatMessage({ id: 'common.status.reject' })}
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <div>
        <Dropdown overlay={menu}>
          <Button type="ghost" style={{ width: '120px' }}>
            {formatMessage({ id: 'common.action' })} <Icon type="down" />
          </Button>
        </Dropdown>
        {status === 'PENDING' && <AssignBox visible={visible} hideAssign={this.hideAssign} />}
        <Drawer
          title={formatMessage({ id: 'reimbursement.comment-detail' })}
          placement="right"
          onClose={this.onCloseComment}
          visible={visibleComment}
          width={500}
          afterVisibleChange={this.handlerAfterVisibleChange}
        >
          <MessageBox isReview comments={commentDetai} user={user} />
        </Drawer>
      </div>
    );
  }
}

export default ReviewBox;
