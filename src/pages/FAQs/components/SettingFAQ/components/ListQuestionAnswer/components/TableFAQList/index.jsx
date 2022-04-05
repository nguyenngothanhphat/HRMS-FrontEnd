import React, { Component } from 'react';
import { Table, Dropdown, Menu, Divider } from 'antd';
// import { connect } from 'umi';
import moment from 'moment';
// import { isEmpty } from 'lodash';
import DeleteQuestionAnswer from '../DeleteQuestionAnswer';
import EditQuestionAnswer from '../EditQuestionAnswer';
import ViewQuestionAnswer from '../ViewQuestionAnswer';
import MoreIcon from '@/assets/policiesRegulations/more.svg';
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
        <Menu.Item>
          <span onClick={() => this.handleViewQuestion(record)}>View Question</span>
        </Menu.Item>
        <Divider />
        <Menu.Item>
          <span onClick={() => this.handleUpdateQuestion(record)}>Update Question</span>
        </Menu.Item>
        <Divider />
        <Menu.Item>
          <span onClick={() => this.handleDeleteQuestion(record)}>Delete</span>
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
    } = this.props;
    const listQuestion = listFAQ
      ? listFAQ.map((obj) => {
          return {
            id: obj._id,
            question: obj.question || '-',
            answer: obj.answer || '-',
            addBy:
              obj.infoEmployee.length > 0 ? obj.infoEmployee[0].generalInfoInfo.legalName : '-',
            addOn: obj.createdAt ? moment(obj.createdAt).format('DD/MM/YYYY') : '-',
            nameCategory: obj.category.length > 0 ? obj.category[0].category : '-',
          };
        })
      : [];
    const columns = [
      {
        title: 'Category Name',
        dataIndex: 'nameCategory',
        sorter: {
          compare: (a, b) => a.nameCategory.localeCompare(b.nameCategory),
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
          compare: (a, b) => moment(a.addOn).unix() - moment(b.addOn).unix(),
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
      total: listQuestion.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {listQuestion.length}
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
