/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Button, notification } from 'antd';
import Dropzone from 'react-dropzone';
import FileUploadIcon from '@/assets/uploadFile_icon.svg';
import csvIcon from '@/assets/csv-icon.png';
import csv from 'csvtojson';
import styles from './index.less';

class ImportCSV extends Component {
  static getDerivedStateFromProps(props) {
    if ('disabled' in props && props.disabled) {
      return { fileName: '' };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
    };
  }

  onDrop = (acceptedFiles) => {
    const { onDrop } = this.props;
    acceptedFiles.map((file) => {
      this.setState({
        fileName: file.name,
      });
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsBinaryString = reader.result;
        csv({
          noheader: true,
          output: 'json',
        })
          .fromString(fileAsBinaryString)
          .then((csvRows) => {
            const toJson = [];
            csvRows.map((aCsvRow, i) => {
              const isEmpty = Object.values(aCsvRow).every((x) => x === null || x === '');
              if (!isEmpty) {
                if (i !== 0) {
                  const builtObject = {};
                  Object.keys(aCsvRow).map((aKey) => {
                    const valueToAddInBuiltObject = aCsvRow[aKey];
                    const keyToAddInBuiltObject = csvRows[0][aKey];
                    builtObject[keyToAddInBuiltObject] = valueToAddInBuiltObject;
                    return null;
                  });
                  toJson.push(builtObject);
                }
              }
              return null;
            });
            onDrop(toJson);
          });
      };
      reader.onabort = () => notification.error({ message: 'File reading was aborted !' });
      reader.onerror = () => notification.error({ message: 'File reading has failed !' });
      reader.readAsBinaryString(file);
      return null;
    });
  };

  renderClassName = (disabled) => {
    let className = `${styles.dropzone} `;
    if (disabled) {
      className += `${styles.dropzone__disabled} `;
    }
    return className;
  };

  showMessage = () => {
    notification.success({ message: `Upload file successfully!` });
  };

  showMessageRejected = (rejectedFiles) => {
    rejectedFiles.map((file) => {
      file.errors.map((error) => {
        notification.warning({ message: error.message });
        return null;
      });
      return null;
    });
  };

  render() {
    const { fileName } = this.state;
    const { disabled } = this.props;
    return (
      <div className={this.renderClassName(disabled)}>
        <Dropzone
          multiple={false}
          accept=".csv"
          disabled={disabled}
          noClick
          onDrop={this.onDrop}
          onDropAccepted={this.showMessage}
          onDropRejected={this.showMessageRejected}
        >
          {({ getRootProps, getInputProps, open }) => (
            <div {...getRootProps()} className={styles.fileUploadForm}>
              {fileName !== '' && !disabled ? (
                <div className={styles.fileUploadedContainer}>
                  <p className={styles.previewIcon}>
                    <img src={csvIcon} alt="csv" />
                  </p>
                  <p className={styles.fileName}>
                    Uploaded: <a>{fileName}</a>
                  </p>
                  <Button type="button" onClick={open}>
                    Choose an another file
                  </Button>
                  <input {...getInputProps()} />
                </div>
              ) : (
                <div>
                  <div>
                    <p className={styles.uploadIcon}>
                      <img src={FileUploadIcon} alt="upload" />
                    </p>
                  </div>
                  <p className={styles.uploadText}>
                    <u>Drap and drop the file here</u>
                  </p>
                  <p className={styles.uploadText}>or</p>
                  <Button type="button" onClick={open}>
                    Choose file
                  </Button>
                  <input {...getInputProps()} />
                </div>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    );
  }
}
export default ImportCSV;
