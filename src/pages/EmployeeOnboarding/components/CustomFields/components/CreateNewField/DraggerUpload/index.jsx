import React, { PureComponent } from 'react';
import { Upload, message } from 'antd';
import imageNone from '@/assets/MaskGroup-customField.svg';

class DraggerUpLoad extends PureComponent {
  render() {
    const { Dragger } = Upload;
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <img src={imageNone} alt="imageNone" />
          </p>
          <p className="ant-upload-text">Drag you file here, or browse</p>
        </Dragger>
      </div>
    );
  }
}

export default DraggerUpLoad;
