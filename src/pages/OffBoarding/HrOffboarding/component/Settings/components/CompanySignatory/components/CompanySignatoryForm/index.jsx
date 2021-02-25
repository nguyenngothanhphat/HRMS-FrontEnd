/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Table, Empty, Upload, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { connect } from 'umi';
import EditIcon from './images/edit.svg';
import DownloadIcon from './images/download.svg';
import DeleteIcon from './images/delete.svg';
import EditSignatoryModal from '../EditSignatoryModal';

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

@connect(
  ({
    companiesManagement: {
      originData: { companyDetails: { companySignature = [] } = {} } = {},
    } = {},
  }) => ({
    companySignature,
  }),
)
class CompanySignatoryForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageUrl: '',
      editModalVisible: false,
      editPack: {},
    };
  }

  handleChange = async ({ file = {} }) => {
    const { dispatch, companyId = '' } = this.props;
    if (file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (file.status === 'done') {
      const formData = new FormData();
      formData.append('uri', file.originFileObj);
      await dispatch({
        type: 'upload/uploadFile',
        payload: formData,
      }).then((resp) => {
        this.setState({ loading: false });
        const { statusCode, data = [] } = resp;
        if (statusCode === 200) {
          const [first] = data;
          const link = first?.url || '';
          const payload = {
            id: companyId,
            companySignature: [
              {
                name: 'Signature',
                designation: 'Signature',
                urlImage: link,
              },
            ],
          };
          dispatch({
            type: 'companiesManagement/updateCompany',
            payload,
            dataTempKept: {},
            isAccountSetup: false,
          });

          // Get this url from response in real world.
          getBase64(file.originFileObj, (imageUrl) =>
            this.setState({
              imageUrl,
              loading: false,
            }),
          );
        }
      });
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
        dataIndex: 'urlImage',
        key: 'urlImage',
        width: '40%',
        render: (urlImage) => {
          const { loading, imageUrl } = this.state;
          return (
            <div className={styles.signatory}>
              <Upload
                listType="picture-card"
                onChange={this.handleChange}
                beforeUpload={beforeUpload}
                showUploadList={false}
              >
                {!urlImage && (
                  <>
                    {' '}
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
                  </>
                )}
                {urlImage && <img src={urlImage} alt="avatar" style={{ maxWidth: '200px' }} />}
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
              <img src={EditIcon} onClick={() => this.onEdit(fileInfo?.url)} alt="edit" />
              <img src={DeleteIcon} onClick={() => this.onDelete(fileInfo?.url)} alt="delete" />
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

  onEdit = (url) => {
    const { companySignature = [] } = this.props;
    const editPack = companySignature.find((value) => value.urlImage === url);
    this.setState({
      editModalVisible: true,
      editPack,
    });
  };

  onDelete = async (url) => {
    const { companySignature = [], companyId = '', dispatch } = this.props;
    const newList = companySignature.filter((value) => value.urlImage !== url);
    const payload = {
      id: companyId,
      companySignature: newList,
    };
    const res = await dispatch({
      type: 'companiesManagement/updateCompany',
      payload,
      dataTempKept: {},
      isAccountSetup: false,
    });
    if (res?.statusCode === 200) {
      this.setState({
        editModalVisible: false,
      });
    }
  };

  parseList = () => {
    const { companySignature = [] } = this.props;
    return companySignature.map((value) => {
      return {
        ...value,
        fileInfo: {
          title: value.name || '',
          _id: value._id || '',
          url: value.urlImage || '',
        },
      };
    });
  };

  onSubmitEdit = async ({ name = '', designation = '' }) => {
    const { editPack } = this.state;
    const { companySignature = [], companyId = '', dispatch } = this.props;
    let index = -1;
    companySignature.forEach((value, idx) => {
      if (value.urlImage === editPack.urlImage) index = idx;
    });
    if (index !== -1) {
      const newList = companySignature.slice();
      newList[index].name = name;
      newList[index].designation = designation;
      const payload = {
        id: companyId,
        companySignature: newList,
      };
      const res = await dispatch({
        type: 'companiesManagement/updateCompany',
        payload,
        dataTempKept: {},
        isAccountSetup: false,
      });
      if (res?.statusCode === 200) {
        this.setState({
          editModalVisible: false,
        });
      }
    }
  };

  render() {
    const { pageSelected, editModalVisible, editPack } = this.state;
    const { companySignature = [] } = this.props;
    const rowSize = 10;

    const pagination = {
      position: ['bottomLeft'],
      total: companySignature.length,
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
            pagination={{ ...pagination, total: companySignature.length }}
          />
          {Object.keys(editPack).length !== 0 && (
            <EditSignatoryModal
              visible={editModalVisible}
              editPack={editPack}
              onOk={this.onSubmitEdit}
              onClose={() => {
                this.setState({
                  editModalVisible: false,
                });
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default CompanySignatoryForm;
