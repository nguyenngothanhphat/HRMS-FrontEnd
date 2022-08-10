import moment from 'moment';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import CommonTable from '@/components/CommonTable';
import DeleteIcon from './images/delete.svg';
import DocIcon from './images/doc.svg';
import DownloadIcon from './images/download.svg';
import EditIcon from './images/edit.svg';
import styles from './index.less';

class TemplateTable extends Component {
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
    history.push(`/offboarding/settings/forms/form-detail/${id}/edit`);
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
    history.push(`/offboarding/settings/forms/form-detail/${id}/view`);
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
    const { loading = false } = this.props;

    const { columnArr, type, inTab } = this.props;
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
