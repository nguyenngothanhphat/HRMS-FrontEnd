import { Empty, Table } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { connect, formatMessage, history } from 'umi';
import DeleteIcon from './images/delete.svg';
import DocIcon from './images/doc.svg';
import DownloadIcon from './images/download.svg';
import EditIcon from './images/edit.svg';
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
        dataIndex: 'formInfo',
        key: 'formInfo',
        width: '20%',
        render: (formInfo) => {
          return (
            <div className={styles.fileName} onClick={() => this.viewTemplateDetail(formInfo?._id)}>
              <img src={DocIcon} alt="name" />
              <span>{formInfo.name}</span>
            </div>
          );
        },
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        width: '20%',
        render: (department) => {
          return <span>{department.name}</span>;
        },
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'type',
        width: '20%',
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
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '20%',
        render: (status) => {
          return <span>{status}</span>;
        },
      },
      {
        title: 'Actions',
        dataIndex: 'formInfo',
        key: 'actions',
        render: (formInfo) => {
          return (
            <div className={styles.actionsButton}>
              <img
                src={DownloadIcon}
                onClick={() => this.onDownload(formInfo?.url)}
                alt="download"
              />
              <img src={EditIcon} onClick={() => this.onEdit(formInfo?._id)} alt="edit" />
              <img src={DeleteIcon} onClick={() => this.onDelete(formInfo?._id)} alt="delete" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  // ACTIONS
  onDownload = (url) => {
    // eslint-disable-next-line no-alert
    alert(`download${url}`);
    // const fileName = url.split('/').pop();
    // message.loading('Downloading file. Please wait...');
    // axios({
    //   url,
    //   method: 'GET',
    //   responseType: 'blob',
    // }).then((resp) => {
    //   // eslint-disable-next-line compat/compat
    //   const urlDownload = window.URL.createObjectURL(new Blob([resp.data]));
    //   const link = document.createElement('a');
    //   link.href = urlDownload;
    //   link.setAttribute('download', fileName);
    //   document.body.appendChild(link);
    //   link.click();
    // });
  };

  onEdit = (id) => {
    // eslint-disable-next-line no-alert
    history.push(`offboarding/forms/${id}/edit`);
  };

  onDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/removeFormOffBoardingById',
      payload: {
        id,
      },
    });
  };

  viewTemplateDetail = (id) => {
    history.push(`/offboarding/settings/forms/${id}/view`);
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
        department: {
          name: value?.department?.name || '',
        },
        formInfo: {
          name: value.name || '',
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
