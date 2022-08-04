import { Divider, Dropdown, Menu, Table } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'umi';

import ViewDocumentModal from '@/components/ViewDocumentModal';
import DeletePolicyModal from '../DeletePolicyModal';
import EditPolicyModal from '../EditPolicyModal';

import MoreIcon from '@/assets/policiesRegulations/more.svg';
import PdfIcon from '@/assets/policiesRegulations/pdf-2.svg';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import styles from './index.less';

@connect(
  ({
    loading,
    policiesRegulations: {
      tempData: { listPolicy = [] },
      originData: { selectedCountry = '' },
    } = {},
  }) => ({
    loadingGetList: loading.effects['policiesRegulations/fetchListPolicy'],
    loadingSearch: loading.effects['policiesRegulations/searchNamePolicy'],
    listPolicy,
    selectedCountry,
  }),
)
class TablePolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deletePolicy: false,
      editPolicy: false,
      modalVisiblePDF: false,
      linkFile: '',
      filePDF: '',
      item: {},
    };
  }

  fetchPolicyRegulationList = (selectedCountry = '') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'policiesRegulations/fetchListPolicy',
      payload: {
        country: [selectedCountry],
      },
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisiblePDF: false,
      linkFile: '',
    });
  };

  handleDelete = (record) => {
    this.setState({ deletePolicy: true, item: record });
  };

  handleUpdateDocument = (record) => {
    const { attachment: { name = '' } = {} } = record;
    this.setState({ editPolicy: true, item: record, filePDF: name });
  };

  handleViewDocument = (record) => {
    const { attachment: { url = '' } = {} } = record;
    this.setState({ modalVisiblePDF: true, linkFile: url });
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
    const { deletePolicy, editPolicy, modalVisiblePDF, linkFile, item, filePDF } = this.state;
    const {
      listPolicy = [],
      loadingGetList,
      loadingSearch,
      pageSelected,
      size,
      getPageAndSize = () => {},
      selectedCountry = '',
    } = this.props;

    const columns = [
      {
        title: 'Policy Name',
        dataIndex: 'namePolicy',
        sorter: {
          compare: (a, b) => a.namePolicy.localeCompare(b.namePolicy),
        },
      },
      {
        title: 'Categories Name',
        dataIndex: 'category',
        sorter: {
          compare: (a, b) => a.category[0].name.localeCompare(b.category[0].name),
        },
        render: (category) => {
          const categoryyName = !isEmpty(category) ? category[0].name : ' _ ';
          return <span>{categoryyName}</span>;
        },
      },
      {
        title: 'Policy Document',
        dataIndex: 'attachment',
        sorter: {
          compare: (a, b) => a.attachment.name.localeCompare(b.attachment.name),
        },
        render: (attachment) => {
          const attachmentSlice = () => {
            if (!isEmpty(attachment) && attachment?.name?.length > 20) {
              return `${attachment?.name.substr(0, 8)}...${attachment?.name.substr(
                attachment?.name.length - 10,
                attachment?.name.length,
              )}`;
            }
            return attachment?.name;
          };
          return (
            <div className={styles.policy}>
              <img src={PdfIcon} alt="PdfIcon" />
              <span style={{ color: '#2c6df9' }}>
                {!isEmpty(attachment) ? attachmentSlice() : ''}
              </span>
            </div>
          );
        },
      },
      {
        title: 'Added By',
        dataIndex: 'infoEmployee',
        sorter: {
          compare: (a, b) =>
            a.infoEmployee[0].generalInfoInfo.legalName.localeCompare(
              b.infoEmployee[0].generalInfoInfo.legalName,
            ),
        },
        render: (infoEmployee) => {
          if (infoEmployee && infoEmployee.length > 0) {
            const { legalName = '' } = infoEmployee[0] || [];
            return <span>{legalName}</span>;
          }
          return '';
        },
      },
      {
        title: 'Added On',
        dataIndex: 'updatedAt',
        sorter: {
          compare: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
        },
        render: (updatedAt) => {
          const date = updatedAt ? moment(updatedAt).format(DATE_FORMAT_MDY) : ' _ ';
          return <span>{date}</span>;
        },
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => {
          return (
            <Dropdown
              overlayStyle={{ width: '200px', marginRight: '8px' }}
              overlayClassName="dropdownPolicies"
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
      total: selectedCountry ? listPolicy.length : [],
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {listPolicy.length}
        </span>
      ),
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
    };
    return (
      <div className={styles.TablePolicy}>
        <Table
          columns={columns}
          dataSource={!selectedCountry ? [] : listPolicy}
          pagination={pagination}
          loading={loadingGetList || loadingSearch}
        />

        <EditPolicyModal
          visible={editPolicy}
          onRefresh={this.fetchPolicyRegulationList}
          onDelete={() => this.setState({ filePDF: '' })}
          onClose={() => this.setState({ editPolicy: false })}
          mode="multiple"
          item={item}
          filePDF={filePDF}
        />
        <DeletePolicyModal
          onRefresh={this.fetchPolicyRegulationList}
          visible={deletePolicy}
          onClose={() => this.setState({ deletePolicy: false })}
          mode="multiple"
          item={item}
        />
        <ViewDocumentModal visible={modalVisiblePDF} onClose={this.handleCancel} url={linkFile} />
      </div>
    );
  }
}

export default TablePolicy;
