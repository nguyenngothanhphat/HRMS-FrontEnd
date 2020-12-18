import React, { Component, Fragment } from 'react';
import { Table, Modal } from 'antd';
import ModalAddComment1On1 from '@/components/ModalAddComment1On1';
import moment from 'moment';
import { checkTime } from '@/utils/utils';
import { connect } from 'umi';
import empty from '@/assets/empty.svg';
import s from './index.less';

@connect(({ loading, offboarding: { listAssigned = [] } = {} }) => ({
  listAssigned,
  loading: loading.effects['offboarding/complete1On1'],
  loadingGetList: loading.effects['offboarding/getListAssigned'],
}))
class TableAssigned extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
      itemSet1On1: {},
      openModal: false,
      keyModal: '',
    };
  }

  componentDidMount() {
    this.getListAssigned();
  }

  getListAssigned = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/getListAssigned',
    });
  };

  modalWarning = () => {
    Modal.warning({
      title: 'Comment after date, time meeting 1 on 1',
    });
  };

  handleOpenAddComment = (item = {}) => {
    this.setState({
      itemSet1On1: item,
      openModal: true,
      keyModal: Date.now(),
    });
  };

  closeAddComment = () => {
    this.setState({
      itemSet1On1: {},
      openModal: false,
      keyModal: '',
    });
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  handleSubmit = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/complete1On1',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.getListAssigned();
        this.closeAddComment();
      }
    });
  };

  render() {
    const { listAssigned: data = [], loading, loadingGetList } = this.props;
    const { pageNavigation, itemSet1On1 = {}, openModal, keyModal = '' } = this.state;
    const rowSize = 10;
    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          total
        </span>
      ),
      pageSize: rowSize,
      current: pageNavigation,
      onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: <span className={s.title}>Ticket ID</span>,
        dataIndex: 'offBoardingRequest',
        render: (offBoardingRequest) => {
          const { ticketID = '' } = offBoardingRequest;
          return <p className={s.text}>{ticketID}</p>;
        },
      },
      {
        title: <span className={s.title}>Created date</span>,
        dataIndex: 'offBoardingRequest',
        render: (offBoardingRequest) => {
          const { createdAt = '' } = offBoardingRequest;
          return <p className={s.text}>{moment(createdAt).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={s.title}>Employee ID</span>,
        dataIndex: 'meetingWith',
        render: (meetingWith) => {
          const { generalInfo: { employeeId = '' } = {} } = meetingWith;
          return <p className={s.text}>{employeeId}</p>;
        },
      },
      {
        title: <span className={s.title}>Requ’tee Name</span>,
        dataIndex: 'meetingWith',
        render: (meetingWith) => {
          const { generalInfo: { firstName = '' } = {} } = meetingWith;
          return <p className={s.text}>{firstName}</p>;
        },
      },
      {
        title: <span className={s.title}>1-on-1 date</span>,
        dataIndex: 'meetingDate',
        render: (meetingDate) => {
          return <p className={s.text}>{moment(meetingDate).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={s.title}>Meeting time</span>,
        dataIndex: 'meetingTime',
        render: (meetingTime) => {
          return <p className={s.text}>{meetingTime}</p>;
        },
      },
      {
        title: <span className={s.title}>Action</span>,
        dataIndex: '_id',
        render: (_, row) => {
          const { meetingDate = '', meetingTime = '' } = row;
          const check = checkTime(meetingDate, meetingTime);
          return (
            <div className={s.rowAction}>
              <span onClick={check ? () => this.handleOpenAddComment(row) : this.modalWarning}>
                Comment 1-on-1
              </span>
            </div>
          );
        },
      },
    ];

    return (
      <>
        <div className={s.tableAssigned}>
          <Table
            locale={{
              emptyText: (
                <div className={s.viewEmpty}>
                  <img src={empty} alt="" />
                  <p className={s.textEmpty}>No resignation request is assigned</p>
                </div>
              ),
            }}
            columns={columns}
            dataSource={data}
            hideOnSinglePage
            pagination={{
              ...pagination,
              total: data.length,
            }}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            loading={loadingGetList}
          />
        </div>
        <ModalAddComment1On1
          key={keyModal}
          visible={openModal}
          data={itemSet1On1}
          handleCancel={this.closeAddComment}
          handleSubmit={this.handleSubmit}
          loading={loading}
        />
      </>
    );
  }
}
export default TableAssigned;
