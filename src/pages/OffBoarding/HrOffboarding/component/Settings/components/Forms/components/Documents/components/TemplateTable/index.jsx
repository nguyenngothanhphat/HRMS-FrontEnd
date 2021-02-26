import React, { Component } from 'react';
import { Table, Empty, message } from 'antd';
import { formatMessage, connect, history } from 'umi';
import moment from 'moment';
import axios from 'axios';
import DownloadIcon from './images/download.svg';
// import EditIcon from './images/edit.svg';
import DeleteIcon from './images/delete.svg';
import DocIcon from './images/doc.svg';
import styles from './index.less';

class TemplateTable extends Component {
  constructor(props) {
    super(props);
    this.state = { pageSelected: 1 };
  }

  generateColumns = () => {
    const columns = [
      {
        title: 'Template Name',
        dataIndex: 'fileInfo',
        key: 'fileInfo',
        width: '20%',
        render: (fileInfo) => {
          return (
            <div className={styles.fileName} onClick={() => this.viewTemplateDetail(fileInfo?._id)}>
              <img src={DocIcon} alt="name" />
              <span>{fileInfo?.title}</span>
            </div>
          );
        },
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: '40%',
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '20%',
        render: (createdAt) => {
          return <span>{moment(createdAt).locale('en').format('MM.DD.YY')}</span>;
        },
      },
      {
        title: 'Actions',
        dataIndex: 'fileInfo',
        key: 'actions',
        render: (fileInfo) => {
          return (
            <div className={styles.actionsButton}>
              <img
                src={DownloadIcon}
                onClick={() => this.onDownload(fileInfo?.url)}
                alt="download"
              />
              {/* <img src={EditIcon} onClick={() => this.onEdit(fileInfo?._id)} alt="edit" /> */}
              <img src={DeleteIcon} onClick={() => this.onDelete(fileInfo?._id)} alt="delete" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  // ACTIONS
  onDownload = (url) => {
    const fileName = url.split('/').pop();
    message.loading('Downloading file. Please wait...');
    axios({
      url,
      method: 'GET',
      responseType: 'blob',
    }).then((resp) => {
      // eslint-disable-next-line compat/compat
      const urlDownload = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = urlDownload;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  };

  onEdit = () => {
    // eslint-disable-next-line no-alert
    alert('Edit');
  };

  onDelete = async (id) => {
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'employeeSetting/removeTemplateById',
      payload: {
        id,
      },
    });
    if (statusCode === 200) {
      dispatch({
        type: 'employeeSetting/fetchDefaultTemplateListOffboarding',
      });
      dispatch({
        type: 'employeeSetting/fetchCustomTemplateListOffboarding',
      });
    }
  };

  viewTemplateDetail = (id) => {
    history.push(`/offboarding-template-details/${id}`);
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  parseList = () => {
    const { list = [] } = this.props;
    return list.map((value) => {
      return {
        ...value,
        fileInfo: {
          title: value.title || '',
          _id: value._id || '',
          url: value.attachment?.url || '',
        },
      };
    });
  };

  render() {
    const { pageSelected } = this.state;
    const { list = [], loading = false } = this.props;
    const rowSize = 10;

    const rowSelection = {
      // onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
      }),
    };

    const pagination = {
      position: ['bottomLeft'],
      total: list.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    const { columnArr, type, inTab, hasCheckbox } = this.props;
    return (
      <>
        <div className={`${styles.TemplateTable} ${inTab ? styles.inTab : ''}`}>
          <Table
            size="small"
            rowSelection={
              hasCheckbox && {
                type: 'checkbox',
                ...rowSelection,
              }
            }
            locale={{
              emptyText: (
                <Empty
                  description={formatMessage(
                    { id: 'component.onboardingOverview.noData' },
                    { format: 0 },
                  )}
                />
              ),
            }}
            columns={this.generateColumns(columnArr, type)}
            dataSource={this.parseList()}
            loading={loading}
            // pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
            pagination={{ ...pagination, total: list.length }}
            // scroll={{ x: 1000, y: 'max-content' }}
          />
        </div>
      </>
    );
  }
}

// export default TemplateTable;
export default connect(({ candidateInfo }) => ({
  candidateInfo,
}))(TemplateTable);
