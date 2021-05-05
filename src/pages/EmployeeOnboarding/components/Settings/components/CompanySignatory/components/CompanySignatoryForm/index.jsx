/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Table, Empty, message, Image, notification } from 'antd';
import axios from 'axios';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import EditIcon from './images/edit.svg';
import DownloadIcon from './images/download.svg';
import DeleteIcon from './images/delete.svg';
import EditSignatoryModal from '../EditSignatoryModal';

import styles from './index.less';

@connect(
  ({
    companiesManagement: {
      originData: { companyDetails: { company: { companySignature = [] } = {} } = {} } = {},
    } = {},
    loading,
  }) => ({
    companySignature,
    loadingSignatoryList: loading.effects['companiesManagement/fetchCompanyDetails'],
  }),
)
class CompanySignatoryForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      editModalVisible: false,
      editPack: {},
    };
  }

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
          const { imageUrl } = this.state;
          return (
            <div className={styles.signatory}>
              {!urlImage && imageUrl && <Image src={imageUrl} alt="avatar" width={200} />}
              {urlImage && <Image src={urlImage} alt="avatar" width={200} />}
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

  onEdit = (_id) => {
    const { companySignature = [] } = this.props;
    const editPack = companySignature.find((value) => value._id === _id);
    this.setState({
      editModalVisible: true,
      editPack,
    });
  };

  onDelete = async (_id) => {
    const { companySignature = [], companyId = '', dispatch } = this.props;
    const newList = companySignature.filter((value) => value._id !== _id);
    const payload = {
      id: companyId,
      companySignature: newList,
      tenantId: getCurrentTenant(),
    };
    const res = await dispatch({
      type: 'companiesManagement/updateCompany',
      payload,
      dataTempKept: {},
      isAccountSetup: false,
    });
    if (res?.statusCode === 200) {
      notification.success({
        message: 'Delete signatory successfully',
      });
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

  onSubmitEdit = async ({ name = '', designation = '', urlImage = '' }) => {
    const { editPack } = this.state;
    const { companySignature = [], companyId = '', dispatch } = this.props;
    let index = -1;
    companySignature.forEach((value, idx) => {
      if (value._id === editPack._id) index = idx;
    });
    if (index !== -1) {
      const newList = companySignature.slice();
      newList[index].name = name;
      newList[index].designation = designation;
      newList[index].urlImage = urlImage;
      const payload = {
        id: companyId,
        companySignature: newList,
        tenantId: getCurrentTenant(),
      };
      const res = await dispatch({
        type: 'companiesManagement/updateCompany',
        payload,
        dataTempKept: {},
        isAccountSetup: false,
      });
      if (res?.statusCode === 200) {
        notification.success({
          message: 'Edit signatory successfully',
        });
        this.setState({
          editModalVisible: false,
        });
      }
    }
  };

  onSubmitAdd = async ({ name = '', designation = '', urlImage = '' }) => {
    const {
      companySignature = [],
      companyId = '',
      dispatch,
      showAddSignatoryModal = () => {},
    } = this.props;
    const newList = companySignature.slice();
    newList.push({
      name,
      designation,
      urlImage,
    });
    const payload = {
      id: companyId,
      companySignature: newList,
      tenantId: getCurrentTenant(),
    };
    const res = await dispatch({
      type: 'companiesManagement/updateCompany',
      payload,
      dataTempKept: {},
      isAccountSetup: false,
    });
    if (res?.statusCode === 200) {
      notification.success({
        message: 'Add new signatory successfully',
      });
      showAddSignatoryModal(false);
    }
  };

  render() {
    const { pageSelected, editModalVisible, editPack } = this.state;
    const {
      companySignature = [],
      showAddSignatoryModal = () => {},
      addModalVisible = false,
      companyId = '',
      loadingSignatoryList,
    } = this.props;
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
            loading={loadingSignatoryList}
            columns={this.generateColumns()}
            dataSource={this.parseList()}
            // pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
            pagination={{ ...pagination, total: companySignature.length }}
          />
          {Object.keys(editPack).length !== 0 && (
            <EditSignatoryModal
              action="EDIT"
              visible={editModalVisible}
              editPack={editPack}
              onOk={this.onSubmitEdit}
              companyId={companyId}
              onClose={() => {
                this.setState({
                  editModalVisible: false,
                });
              }}
            />
          )}
          <EditSignatoryModal
            action="ADD"
            visible={addModalVisible}
            onOk={this.onSubmitAdd}
            companyId={companyId}
            onClose={() => showAddSignatoryModal(false)}
          />
        </div>
      </div>
    );
  }
}

export default CompanySignatoryForm;
