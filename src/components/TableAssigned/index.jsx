import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import ModalAddComment1On1 from '@/components/ModalAddComment1On1';
import moment from 'moment';
import { connect } from 'umi';
import empty from '@/assets/empty.svg';
import s from './index.less';

@connect(({ offboarding: { listAssigned = [] } = {} }) => ({
  listAssigned,
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
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/getListAssigned',
    });
  }

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

  handleSubmit = (values) => {
    console.log('values', values);
    this.closeAddComment();
  };

  render() {
    const { listAssigned: data = [] } = this.props;
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
        dataIndex: 'ticketID',
        render: (ticketID) => {
          return <p>{ticketID}</p>;
        },
      },

      {
        title: <span className={s.title}>Employee ID</span>,
        dataIndex: 'ticketID',
        render: (ticketID) => {
          return <p>{ticketID}</p>;
        },
      },
      {
        title: <span className={s.title}>Created date</span>,
        dataIndex: 'createdAt',
        render: (createdAt) => {
          return <p>{moment(createdAt).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={s.title}>Requ’tee Name </span>,
        dataIndex: 'ticketID',
        render: (ticketID) => {
          return <p>{ticketID}</p>;
        },
      },
      {
        title: <span className={s.title}>1-on-1 date</span>,
        dataIndex: 'ticketID',
        render: (ticketID) => {
          return <p>{ticketID}</p>;
        },
      },
      {
        title: <span className={s.title}>Action</span>,
        dataIndex: '_id',
        render: (_, row) => (
          <div className={s.rowAction}>
            <span onClick={() => this.handleOpenAddComment(row)}>Comment 1-on-1</span>
          </div>
        ),
      },
    ];

    return (
      <Fragment>
        <div className={s.tableAssigned}>
          <Table
            locale={{
              emptyText: (
                <span>
                  <img src={empty} alt="" />
                  <p className={s.textEmpty}>No Result</p>
                </span>
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
            onChange={this.handleChangeTable}
          />
        </div>
        <ModalAddComment1On1
          key={keyModal}
          visible={openModal}
          data={itemSet1On1}
          handleCancel={this.closeAddComment}
          handleSubmit={this.handleSubmit}
          loading={false}
        />
      </Fragment>
    );
  }
}
export default TableAssigned;
