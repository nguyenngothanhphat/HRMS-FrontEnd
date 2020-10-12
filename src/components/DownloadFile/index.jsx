/* eslint-disable compat/compat */
import React, { Component } from 'react';
import axios from 'axios';

class DownloadFile extends Component {
  downloadFile = () => {
    const { url = '' } = this.props;
    const fileName = url.split('/').pop();
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
      link.click();
    });
  };

  render() {
    const { content = 'Download', url = '' } = this.props;
    return (
      <div onClick={url ? this.downloadFile : () => {}} style={{ cursor: 'pointer' }}>
        {content}
      </div>
    );
  }
}

export default DownloadFile;
