import React, { PureComponent } from 'react';
import { Upload, message, Button } from 'antd';
import { connect } from 'umi';
import { UploadOutlined } from '@ant-design/icons';

@connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
}))
class DraggerUpLoad extends PureComponent {
  beforeUpload = (file) => {
    const checkType =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
    return checkType && isLt5M;
  };

  handleUpload = (file) => {
    const { dispatch, getResponse = () => {} } = this.props;

    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((resp) => {
      getResponse(resp);
    });
  };

  render() {
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
    };
    const { loading } = this.props;
    return (
      <div>
        <Upload
          {...props}
          beforeUpload={this.beforeUpload}
          action={(file) => this.handleUpload(file)}
        >
          <Button icon={<UploadOutlined />} loading={loading}>
            Click to Upload
          </Button>
        </Upload>
      </div>
    );
  }
}

export default DraggerUpLoad;
