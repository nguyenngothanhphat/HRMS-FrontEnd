import React, { Component } from 'react';
import { Table, Dropdown, Menu, Divider } from 'antd';
import { connect } from 'umi';
import moment from 'moment';

import AddPolicyModal from '../AddPolicyModal';
import DeletePolicyModal from '../DeletePolicyModal';
import ModalViewPDF from '@/components/ModalViewPDF';

import MoreIcon from '@/assets/policiesRegulations/more.svg';
import PdfIcon from '@/assets/policiesRegulations/pdf-2.svg';
import styles from './index.less';

connect(({ policiesRegulations: { listPolicy = [] } = {} }) => ({
  listPolicy,
}));
class TablePolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: '',
      deletePolicy: false,
      modalVisiblePDF: false,
      linkFile: '',
      item:{}
    };
  }

  handleCancel = () => {
    this.setState({
      modalVisiblePDF: false,
      linkFile: '',
    });
  };

  handleDelete = (record) => {
    this.setState({ deletePolicy: true , item:{record}});

  };

  handleUpdateDocument = (record) => {
    this.setState({ openModal: 'edit', item:{record} });
  };

  handleViewDocument = (record) => {
    this.setState({ modalVisiblePDF: true , item:{record}});
  };

  actionMenu = (record) => {
    return (
      <Menu>
        <Menu.Item>
          <span onClick={() => this.handleViewDocument(record)}>View Document</span>
        </Menu.Item>
        <Divider />
        <Menu.Item>
          <span onClick={() => this.handleUpdateDocument(record)}>Update Document</span>
        </Menu.Item>
        <Divider />
        <Menu.Item>
          <span onClick={() => this.handleDelete(record)}>Delete</span>
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const { openModal, deletePolicy, modalVisiblePDF, linkFile, item } = this.state;
    const {listPolicy=[]}=this.props
    const columns = [
      {
        title: 'Policy Name',
        dataIndex: 'policyName',
        sorter: {
          compare: (a, b) => a.policyName.localeCompare(b.policyName),
        },
      },
      {
        title: 'Categories Name',
        dataIndex: 'categoriesName',
        sorter: {
          compare: (a, b) => a.categoriesName.localeCompare(b.categoriesName),
        },
      },
      {
        title: 'Policy Document',
        dataIndex: 'policyDocument',
        sorter: {
          compare: (a, b) => a.policyDocument.localeCompare(b.policyDocument),
        },
        render: (policyDocument) => {
          const attachmentSlice = () => {
            if (policyDocument.length > 20) {
              return `${policyDocument.substr(0, 8)}...${policyDocument.substr(
                policyDocument.length - 10,
                policyDocument.length,
              )}`;
            }
            return policyDocument;
          };
          return (
            <div className={styles.policy}>
              <img src={PdfIcon} alt="PdfIcon" />
              <span style={{ color: '#2c6df9' }}> {attachmentSlice()}</span>
            </div>
          );
        },
      },
      {
        title: 'Added By',
        dataIndex: 'addedBy',
        sorter: {
          compare: (a, b) => a.addedBy.localeCompare(b.addedBy),
        },
      },
      {
        title: 'Added On',
        dataIndex: 'addedOn',
        sorter: {
          compare: (a, b) => moment(a.addedOn).unix() - moment(b.addedOn).unix(),
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (record) => {
          return (
            <Dropdown
              overlayStyle={{ width: '200px', marginRight: '8px' }}
              overlayClassName="dropdownPolicies"
              overlay={()=>this.actionMenu(record)}
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
    const data = [
      {
        key: 1,
        policyName: 'Domestic Travel Policy',
        categoriesName: 'Cmployee conduct',
        policyDocument: 'Domestic Travel Policy.pdf',
        addedBy: 'Jakob Korsgaard',
        addedOn: '4/15/17',
      },
      {
        key: 2,
        policyName: 'Aomestic Travel Policy',
        categoriesName: 'Employee conduct',
        policyDocument: 'Domestic Travel Policy.pdf',
        addedBy: 'Jakob Korsgaard',
        addedOn: '5/15/17',
      },
      {
        key: 3,
        policyName: 'Fomestic Travel Policy',
        categoriesName: 'Gmployee conduct',
        policyDocument: 'Domestic Travel Policy.pdf',
        addedBy: 'Jakob Korsgaard',
        addedOn: '7/15/17',
      },
    ];
    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {data.length}
        </span>
      ),
      pageSize: 10,
      current: 1,
      // onChange: (page, pageSize) => {
      //   getPageAndSize(page, pageSize);
      // },
    };
    return (
      <div className={styles.TablePolicy}>
        <Table columns={columns} dataSource={data} pagination={pagination} />
        <AddPolicyModal
          openModal={openModal === 'edit'}
          onClose={() => this.setState({ openModal: '' })}
          mode={openModal}
          item={item}
        />
        <DeletePolicyModal
          visible={deletePolicy}
          onClose={() => this.setState({ deletePolicy: false })}
          mode="multiple"
          item={item}
        />
        <ModalViewPDF
          visible={modalVisiblePDF}
          handleCancel={this.handleCancel}
          link={linkFile}
        />
      </div>
    );
  }
}

export default TablePolicy;
