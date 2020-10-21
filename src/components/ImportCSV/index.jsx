/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Button } from 'antd';
import { dialog } from '@/utils/utils';
import Dropzone from 'react-dropzone';
import FileUploadIcon from '@/assets/uploadFile_icon.svg';
import csvIcon from '@/assets/csv-icon.png';
import styles from './index.less';

const csv = require('csvtojson');

class ImportCSV extends Component {
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
              if (i !== 0) {
                const builtObject = {};
                Object.keys(aCsvRow).map((aKey) => {
                  const valueToAddInBuiltObject = aCsvRow[aKey];
                  const keyToAddInBuiltObject = csvRows[0][aKey];
                  let formatKey = keyToAddInBuiltObject.replace(/\s/g, '');
                  formatKey = formatKey.charAt(0).toLowerCase() + formatKey.slice(1);
                  builtObject[formatKey] = valueToAddInBuiltObject;
                  return null;
                });
                toJson.push(builtObject);
              }
              return null;
            });
            onDrop(toJson);
          });
      };
      reader.onabort = () => dialog('File reading was aborted !');
      reader.onerror = () => dialog('File reading has failed !');
      reader.readAsBinaryString(file);
      return null;
    });
  };

  render() {
    const { fileName } = this.state;
    // const { initImport } = this.props;
    return (
      <div className={styles.dropzone}>
        <Dropzone accept=".csv" onDrop={this.onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className={styles.fileUploadForm}>
              {fileName !== '' ? (
                <div className={styles.fileUploadedContainer}>
                  <p className={styles.previewIcon}>
                    <img src={csvIcon} alt="csv" />
                  </p>
                  <p className={styles.fileName}>
                    Uploaded: <a>{fileName}</a>
                  </p>
                  <Button>Choose an another file</Button>
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
                  <p className={styles.uploadText}>
                    <u>Click to choose file</u>
                  </p>
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
