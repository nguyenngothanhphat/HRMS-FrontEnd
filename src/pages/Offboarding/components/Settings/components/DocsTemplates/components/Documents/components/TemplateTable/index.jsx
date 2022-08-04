import { message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import DownloadIcon from './images/download.svg';
// import EditIcon from './images/edit.svg';
import CommonTable from '@/components/CommonTable';
import DeleteIcon from './images/delete.svg';
import DocIcon from './images/doc.svg';
import styles from './index.less';

class TemplateTable extends Component {
  generateColumns = () => {
    const { isDefaultTemplate = false } = this.props;
    const columns = [
      {
        title: 'Template Name',
        dataIndex: 'fileInfo',
        key: 'fileInfo',
        width: '30%',
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
              {!isDefaultTemplate && (
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
    history.push(`/offboarding/settings/documents-templates/template-detail/${id}`);
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
    const { loading = false, columnArr, type, inTab } = this.props;
    return (
      <>
        <div className={`${styles.TemplateTable} ${inTab ? styles.inTab : ''}`}>
          <CommonTable
            columns={this.generateColumns(columnArr, type)}
            list={this.parseList()}
            loading={loading}
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
