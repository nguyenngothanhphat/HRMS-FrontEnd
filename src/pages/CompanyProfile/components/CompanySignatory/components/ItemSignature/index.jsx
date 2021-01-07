import React, { Component } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import UploadImage from '@/components/UploadImage';
import { Input, Image } from 'antd';
import s from './index.less';

class ItemSignature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAddNew: false,
      name: '',
      position: '',
      urlImage: '',
    };
  }

  openAddNew = () => {
    this.setState({
      viewAddNew: true,
    });
  };

  onChangeInput = ({ target: { value, name } }) => {
    this.setState({
      [name]: value,
    });
  };

  handleGetRespone = (resp) => {
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      this.setState({ urlImage: first.url });
    }
  };

  handleDelete = () => {
    this.setState({
      name: '',
      position: '',
      urlImage: '',
    });
  };

  render() {
    const { data } = this.props;
    const { viewAddNew = false, name = '', position = '', urlImage = '' } = this.state;
    const check = name && position && urlImage;
    return (
      <div className={s.root}>
        <div className={s.viewTop} style={viewAddNew ? { marginBottom: '20px' } : {}}>
          <p className={s.viewTop__title}>Title Signature {data}</p>
          <div className={s.viewTop__btnAddNew} onClick={this.openAddNew}>
            <PlusOutlined className={s.viewTop__btnAddNew__icon} />
            <p className={s.viewTop__btnAddNew__text}>Add New</p>
          </div>
        </div>
        {viewAddNew && (
          <div className={s.viewAddNew}>
            <div className={s.viewAddNew__viewInput}>
              <Input
                value={name}
                name="name"
                placeholder="Name"
                onChange={this.onChangeInput}
                style={{ marginBottom: '16px' }}
              />
              <Input
                value={position}
                name="position"
                placeholder="Position"
                onChange={this.onChangeInput}
              />
            </div>
            <div>
              <div className={s.viewAddNew__viewUpload}>
                {urlImage ? (
                  <Image
                    width="165px"
                    height="63px"
                    src={urlImage}
                    style={{ cursor: 'pointer', objectFit: 'contain' }}
                  />
                ) : (
                  <UploadImage
                    content={
                      <div className={s.viewAddNew__viewUpload__upload}>
                        <PlusOutlined className={s.viewAddNew__viewUpload__upload__icon} />
                        <p className={s.viewAddNew__viewUpload__upload__text}>Upload Signature</p>
                      </div>
                    }
                    getResponse={this.handleGetRespone}
                  />
                )}
              </div>
              {urlImage && (
                <UploadImage
                  content={<div className={s.viewAddNew__viewUpload__textChange}>Change</div>}
                  getResponse={this.handleGetRespone}
                />
              )}
            </div>
            <div
              style={!check ? { visibility: 'hidden' } : {}}
              className={s.viewAddNew__viewDelete}
            >
              <div className={s.viewAddNew__viewDelete__icon} onClick={this.handleDelete}>
                <DeleteOutlined />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ItemSignature;
