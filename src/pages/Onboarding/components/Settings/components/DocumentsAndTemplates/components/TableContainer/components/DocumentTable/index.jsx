import { message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import DeleteIcon from './images/delete.svg';
import DocIcon from './images/doc.svg';
import DownloadIcon from './images/download.svg';

import CommonTable from '@/components/CommonTable';
import styles from './index.less';

class DocumentTable extends Component {
  constructor(props) {
    super(props);
    this.state = { viewingDocumentModalVisible: false, viewingDocumentUrl: '' };
  }

  generateColumns = () => {
    const { isDefaultDocument = false } = this.props;
    const columns = [
      {
        title: 'Document Name',
        dataIndex: 'fileInfo',
        key: 'fileInfo',
        width: '30%',
        render: (fileInfo) => {
          return (
            <div className={styles.fileName} onClick={() => this.viewDocumentDetail(fileInfo?.url)}>
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
        width: '30%',
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
        key: 'fileInfo',
        render: (fileInfo) => {
          return (
            <div className={styles.actionsButton}>
              <img
                src={DownloadIcon}
                onClick={() => this.onDownload(fileInfo?.url)}
                alt="download"
              />
              {!isDefaultDocument && (
                <img src={DeleteIcon} onClick={() => this.onDelete(fileInfo?._id)} alt="delete" />
              )}
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

  onDelete = async (id) => {
    const { dispatch, refreshData = () => {} } = this.props;
    const tenantId = getCurrentTenant();
    const statusCode = await dispatch({
      type: 'employeeSetting/removeDocumentSettingById',
      payload: {
        id,
        tenantId,
      },
    });
    if (statusCode === 200) {
      refreshData();
    }
  };

  viewDocumentDetail = (url) => {
    this.setState({
      viewingDocumentUrl: url,
      viewingDocumentModalVisible: true,
    });
  };

  parseList = () => {
    const { list = [] } = this.props;
    return list.map((value) => {
      return {
        ...value,
        type: value.module,
        fileInfo: {
          title: value.key || '',
          _id: value._id || '',
          url: value.attachmentInfo?.url || '',
        },
      };
    });
  };

  render() {
    const { viewingDocumentModalVisible, viewingDocumentUrl } = this.state;
    const { loading = false } = this.props;
    const { columnArr, type } = this.props;
    return (
      <>
        <div className={styles.DocumentTable}>
          <CommonTable
            columns={this.generateColumns(columnArr, type)}
            list={this.parseList()}
            loading={loading}
            // pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
          />
          <ViewDocumentModal
            visible={viewingDocumentModalVisible}
            url={viewingDocumentUrl}
            onClose={() => {
              this.setState({ viewingDocumentModalVisible: false });
            }}
          />
        </div>
      </>
    );
  }
}

// export default DocumentTable;
export default connect(({ newCandidateForm }) => ({
  newCandidateForm,
}))(DocumentTable);
