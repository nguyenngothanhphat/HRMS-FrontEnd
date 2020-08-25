import React, { Component } from 'react';
import { Icon, Menu, Dropdown, Modal } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

export default class Review extends Component {
  showConfirm = type => {
    const { dispatch, reId } = this.props;
    const action = {
      approve: {
        title: formatMessage({ id: 'reimbursement.review.approve.confirm' }),
        onOk() {
          dispatch({ type: 'reimbursement/review', payload: { action: 'approve', reId } }).then(
            () => {
              dispatch({ type: 'reimbursement/fetch', payload: { method: 'approval' } });
            }
          );
        },
      },
      complete: {
        title: formatMessage({ id: 'reimbursement.review.complete.confirm' }),
        onOk() {
          dispatch({ type: 'reimbursement/review', payload: { action: 'approve', reId } }).then(
            () => {
              dispatch({ type: 'reimbursement/fetch', payload: { method: 'approval' } });
            }
          );
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

  getBillStatus = (bills, reId) => {
    return bills.find(bill => bill.id === reId).status;
  };

  render() {
    const { reId, type, list } = this.props;
    const billStatus = this.getBillStatus(list[type], reId);

    const actionMenu = (
      <Menu>
        <Menu.Item
          onClick={() => {
            this.showConfirm(billStatus === 'LEAD' ? 'complete' : 'approve');
          }}
        >
          <Icon style={{ color: '#87d068' }} type="check" />
          {billStatus === 'LEAD'
            ? formatMessage({ id: 'common.status.complete' })
            : formatMessage({ id: 'common.approve' })}
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            this.showConfirm('reject');
          }}
        >
          <Icon style={{ color: '#f50' }} type="close" />
          {formatMessage({ id: 'common.status.reject' })}
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={actionMenu} placement="bottomRight">
        <Icon type="ellipsis" style={{ fontSize: '20px', paddingLeft: '10px' }} />
      </Dropdown>
    );
  }
}
