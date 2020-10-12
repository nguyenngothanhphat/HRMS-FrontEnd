/* eslint-disable compat/compat */
import React, { Component, Fragment } from 'react';
import { SyncOutlined } from '@ant-design/icons';
import axios from 'axios';

class DownloadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDownloading: false,
    };
  }

  downloadFile = () => {
    const { url = '' } = this.props;
    const fileName = url.split('/').pop();
    this.setState({ isDownloading: true });
    axios({
      url,
      method: 'GET',
      responseType: 'blob',
    }).then((resp) => {
      const urlDownload = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = urlDownload;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      this.setState({ isDownloading: false });
      link.click();
    });
  };

  render() {
    const { content = 'Download', url = '' } = this.props;
    const { isDownloading } = this.state;
    return (
      <Fragment>
        {isDownloading ? (
          <SyncOutlined spin style={{ color: '#1890ff' }} />
        ) : (
          <div onClick={url ? this.downloadFile : () => {}} style={{ cursor: 'pointer' }}>
            {content}
          </div>
        )}
      </Fragment>
    );
  }
}

export default DownloadFile;
