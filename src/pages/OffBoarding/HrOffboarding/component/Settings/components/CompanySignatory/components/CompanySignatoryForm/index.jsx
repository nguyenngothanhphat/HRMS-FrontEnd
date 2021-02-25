/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Table, Empty, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import EditIcon from './images/edit.svg';
import DownloadIcon from './images/download.svg';
import DeleteIcon from './images/delete.svg';

import styles from './index.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class CompanySignatoryForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageUrl: '',
    };
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Name of the signatory',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        render: (name) => {
          return (
            <div className={styles.fileName}>
              <span>{name}</span>
            </div>
          );
        },
      },
      {
        title: 'Signature',
        dataIndex: 'attachment',
        key: 'attachment',
        width: '40%',
        render: (attachment) => {
          const { url = '' } = attachment;
          const { loading, imageUrl } = this.state;

          return (
            <div className={styles.signatory}>
              <Upload
                listType="picture-card"
                // onPreview={this.handlePreview}
                onChange={this.handleChange}
                beforeUpload={beforeUpload}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                showUploadList={false}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ maxWidth: '200px' }} />
                ) : (
                  <>
                    {loading ? (
                      <LoadingOutlined />
                    ) : (
                      <span style={{ fontSize: '12px' }}>Upload</span>
                    )}
                  </>
                )}
              </Upload>
            </div>
          );
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
              <img src={EditIcon} onClick={() => this.onEdit(fileInfo?._id)} alt="edit" />
              <img src={DeleteIcon} onClick={() => this.onDelete(fileInfo?._id)} alt="delete" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  // ACTIONS
  onDownload = () => {
    // eslint-disable-next-line no-alert
    alert('Download');
  };

  onEdit = () => {
    // eslint-disable-next-line no-alert
    alert('Edit');
  };

  onDelete = () => {
    // eslint-disable-next-line no-alert
    alert('Delete');
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
    const { list = [] } = this.props;

    // const uploadButton = (
    //   <div>
    //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
    //   </div>
    // );

    const rowSize = 10;

    // const rowSelection = {
    //   // onChange: (selectedRowKeys, selectedRows) => {
    //   // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   // },
    //   getCheckboxProps: (record) => ({
    //     disabled: record.name === 'Disabled User',
    //     // Column configuration not to be checked
    //     name: record.name,
    //   }),
    // };

    const pagination = {
      position: ['bottomLeft'],
      total: list.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    return (
      <div className={styles.CompanySignatoryForm}>
        <div className={styles.CompanySignatoryForm_form}>
          <Table
            size="large"
            locale={{
              emptyText: <Empty description="No signatory" />,
            }}
            columns={this.generateColumns()}
            dataSource={this.parseList()}
            // pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
            pagination={{ ...pagination, total: list.length }}
          />
          {/* 
         
              <Upload
                listType="picture-card"
                // fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleUpload}
                beforeUpload={beforeUpload}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                showUploadList={false}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ minWidth: '200px' }} />
                ) : (
                  uploadButton
                )}
              </Upload>

          */}
        </div>
      </div>
    );
  }
}

export default CompanySignatoryForm;
