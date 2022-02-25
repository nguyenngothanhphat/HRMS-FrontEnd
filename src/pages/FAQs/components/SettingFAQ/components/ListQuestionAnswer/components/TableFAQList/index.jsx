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

// @connect(({ loading, policiesRegulations: { listPolicy = [] } = {} }) => ({
//   loadingGetList: loading.effects['policiesRegulations/fetchListPolicy'],
//   loadingSearch: loading.effects['policiesRegulations/searchNamePolicy'],
//   listPolicy,
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
    } = this.props;
    const listQuestion = [
      {
        nameCategory: 'General FAQs',
        question: 'How can I request time off in #tool-name?',
        addBy: 'Jakob Korsgaard',
        addOn: '8/15/17',
      },
      {
        nameCategory: 'Employee Directory',
        question: 'I need to change who sees/approves PTO requests',
        addBy: 'Terry Saris',
        addOn: '4/21/12',
      },
      {
        nameCategory: 'General FAQs',
        question: 'How can I request time off in #tool-name?',
        addBy: 'Jakob Korsgaard',
        addOn: '8/15/17',
      },
      {
        nameCategory: 'Employee Directory',
        question: 'I need to change who sees/approves PTO requests',
        addBy: 'Terry Saris',
        addOn: '4/21/12',
      },
    ];
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
        // render: (category) => {
        //   const categoryyName = !isEmpty(category) ? category[0].name : ' _ ';
        //   return <span>{categoryyName}</span>;
        // },
      },
      {
        title: 'Added By',
        dataIndex: 'addBy',
        sorter: {
          compare: (a, b) => a.addBy.localeCompare(b.addBy),
        },
        // render: (infoEmployee) => {
        //   if (!isEmpty(infoEmployee)) {
        //     const { generalInfoInfo: { legalName = '' } = {} } = infoEmployee[0];
        //     return <span>{legalName}</span>;
        //   }
        //   return '';
        // },
      },
      {
        title: 'Added On',
        dataIndex: 'addOn',
        sorter: {
          compare: (a, b) => moment(a.addOn).unix() - moment(b.addOn).unix(),
        },
        // render: (updatedAt) => {
        //   const date = updatedAt ? moment(updatedAt).format('DD/MM/YYYY') : ' _ ';
        //   return <span>{date}</span>;
        // },
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
