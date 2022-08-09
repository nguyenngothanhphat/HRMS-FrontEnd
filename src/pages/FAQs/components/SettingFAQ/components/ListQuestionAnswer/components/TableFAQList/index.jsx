import { Divider, Dropdown, Menu, Table } from 'antd';
import React, { Component } from 'react';
// import { connect } from 'umi';
// import { isEmpty } from 'lodash';
import MoreIcon from '@/assets/policiesRegulations/more.svg';
import DeleteQuestionAnswer from '../DeleteQuestionAnswer';
import EditQuestionAnswer from '../EditQuestionAnswer';
import ViewQuestionAnswer from '../ViewQuestionAnswer';
import styles from './index.less';
// import { stubFalse } from 'lodash';

// @connect(({ loading, faqs: { listFAQ = [] } = {} }) => ({
//   loadingGetList: loading.effects['faqs/fetchListFAQ'],
//   //   loadingSearch: loading.effects['faqs/searchNameQuestion'],
//   listFAQ,
// }))
class TableFAQList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteQuestion: false,
      editQuestion: false,
      viewQuestion: false,
      item: {},
    };
  }

  handleDeleteQuestion = (record) => {
    this.setState({ deleteQuestion: true, item: record });
  };

  handleUpdateQuestion = (record) => {
    this.setState({ editQuestion: true, item: record });
  };

  handleViewQuestion = (record) => {
    this.setState({ viewQuestion: true, item: record });
  };

  actionMenu = (record) => {
    return (
      <Menu>
        <Menu.Item onClick={() => this.handleViewQuestion(record)}>
          <span>View Question</span>
        </Menu.Item>
        <Divider />
        <Menu.Item onClick={() => this.handleUpdateQuestion(record)}>
          <span>Update Question</span>
        </Menu.Item>
        <Divider />
        <Menu.Item onClick={() => this.handleDeleteQuestion(record)}>
          <span>Delete</span>
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const { deleteQuestion, editQuestion, viewQuestion, item } = this.state;
    const {
      loadingGetList,
      loadingSearch,
      pageSelected,
      size,
      getPageAndSize = () => {},
      listFAQ = [],
      totalListFAQ,
    } = this.props;
    const fileListTemp = (att) => {
      return att.map((x, i) => {
        return {
          ...x,
          uid: i,
          name: x.name,
          status: 'done',
          url: x.url,
          thumbUrl: x.url,
          id: x.id || x._id,
        };
      });
    };
    const listQuestion = listFAQ
      ? listFAQ.map((obj) => {
          return {
            id: obj._id,
            question: obj.question || '-',
            answer: obj.answer || '-',
            addBy: obj.employeeId ? obj.employeeId?.generalInfoInfo?.legalName : '-',
            addOn: obj.createdAt ? obj.createdAt.substring(0, 10) : '-',
            categoryName: obj.categoryId ? obj.categoryId?.category : '-',
            categoryId: obj.categoryId ? obj.categoryId?._id : '-',
            attachment: obj?.attachment && fileListTemp([obj.attachment]),
          };
        })
      : [];
    const columns = [
      {
        title: 'Category Name',
        dataIndex: 'categoryName',
        sorter: {
          compare: (a, b) => a.categoryName.localeCompare(b.categoryName),
        },
      },
      {
        title: 'Question',
        dataIndex: 'question',
        sorter: {
          compare: (a, b) => a.question.localeCompare(b.question),
        },
      },
      {
        title: 'Added By',
        dataIndex: 'addBy',
        sorter: {
          compare: (a, b) => a.addBy.localeCompare(b.addBy),
        },
      },
      {
        title: 'Added On',
        dataIndex: 'addOn',
        sorter: {
          compare: (a, b) => new Date(a.addOn).getTime() - new Date(b.addOn).getTime(),
        },
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => {
          return (
            <Dropdown
              overlayStyle={{ width: '200px', marginRight: '8px' }}
              overlayClassName="dropdownQuestion"
              overlay={() => this.actionMenu(record)}
              placement="bottomRight"
              arrow
            >
              <div className={styles.MoreIcon}>
                <img src={MoreIcon} alt="MoreIcon" />
              </div>
            </Dropdown>
          );
        },
      },
    ];

    const pagination = {
      position: ['bottomLeft'],
      total: totalListFAQ,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {total}
        </span>
      ),
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
    };
    return (
      <div className={styles.TableFAQList}>
        <Table
          columns={columns}
          dataSource={listQuestion}
          pagination={pagination}
          loading={loadingGetList || loadingSearch}
        />
        <EditQuestionAnswer
          visible={editQuestion}
          onClose={() => this.setState({ editQuestion: false })}
          mode="multiple"
          item={item}
        />
        <DeleteQuestionAnswer
          visible={deleteQuestion}
          onClose={() => this.setState({ deleteQuestion: false })}
          mode="multiple"
          item={item}
        />
        <ViewQuestionAnswer
          visible={viewQuestion}
          onClose={() => this.setState({ viewQuestion: false })}
          mode="multiple"
          item={item}
        />
      </div>
    );
  }
}

export default TableFAQList;
