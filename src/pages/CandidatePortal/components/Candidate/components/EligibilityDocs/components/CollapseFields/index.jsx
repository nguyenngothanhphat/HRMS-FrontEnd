/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Collapse, Space, Checkbox, Typography, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import undo from '@/assets/candidatePortal/undo-signs.svg';
import doneIcon from '@/assets/candidatePortal/doneSign.svg';
import UploadImage from '../UploadImage';
import styles from './index.less';

class CollapseField extends Component {
  // uploadText = (status) => {
  //   if(status === 'VERIFIED') {
  //     return 'Uploaded';
  //   }
  //   return 'Reupload'
  // }

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: { outerIndex: '', innerIndex: '' },
    };
  }

  getActionContent = (file = {} || {}) => {
    const status = file.candidateDocumentStatus;

    switch (status) {
      case 'VERIFIED':
        return 'Modify';
      case 'RE-SUBMIT':
        return 'Resubmit';
      case 'PENDING':
        if (!file.attachment) return 'Upload';
        return 'Modify';
      default:
        return '';
    }
  };

  handleSelectedFile = (outerIndex, innerIndex) => {
    this.setState({
      selectedFile: {
        outerIndex,
        innerIndex,
      },
    });
  };

  resetSelectedIndex = () => {
    this.setState({
      selectedFile: {
        outerIndex: '',
        innerIndex: '',
      },
    });
  };

  getResponse = async (res, index, id, docList) => {
    const { handleFile } = this.props;
    handleFile(res, index, id, docList);
    this.resetSelectedIndex();
  };

  renderUnvalidFile = (file, id) => {
    const {
      loading,
      index,
      // handleFile,
      docList,
    } = this.props;

    const { selectedFile } = this.state;

    const fileStatus = file.candidateDocumentStatus;

    return (
      <Row className={styles.checkboxItem}>
        <Col span={19}>
          <Typography.Text>{file.displayName}</Typography.Text>
        </Col>
        <Col span={3} className={styles.Padding}>
          {fileStatus !== 'VERIFIED' && <Typography.Text>{file.attachment?.name}</Typography.Text>}
          <UploadImage
            content={this.getActionContent(file)}
            getResponse={(res) => this.getResponse(res, index, id, docList)}
            loading={loading}
            hideValidation
            typeIndex={index}
            nestedIndex={id}
            getIndexFailed={this.getIndexFailed}
            selectedInner={selectedFile.innerIndex}
            selectedOuter={selectedFile.outerIndex}
            handleSelectedFile={this.handleSelectedFile}
            resetSelectedIndex={this.resetSelectedIndex}
          />
        </Col>
      </Row>
    );
  };

  renderValidFile = (file, id) => {
    const {
      loading,
      index,
      // handleFile,
      docList,
      handleCanCelIcon: handleCancelIcon,
      checkLength,
    } = this.props;

    const { selectedFile } = this.state;
    const fileStatus = file.candidateDocumentStatus;

    return (
      <Row className={styles.checkboxItem}>
        <Col span={14}>
          <Typography.Text>{file.displayName}</Typography.Text>
        </Col>
        <Col span={5} className={styles.textAlign}>
          <a
            href={file.attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewUpLoadDataURL}
          >
            {checkLength(file.attachment.name)}
          </a>
        </Col>

        <Col span={3} className={styles.textAlign}>
          {/* <p className={styles.viewUpLoadDataText}>Uploaded</p> */}
          <UploadImage
            content={this.getActionContent(file)}
            getResponse={(res) => this.getResponse(res, index, id, docList)}
            loading={loading}
            hideValidation
            typeIndex={index}
            nestedIndex={id}
            getIndexFailed={this.getIndexFailed}
            selectedInner={selectedFile.innerIndex}
            selectedOuter={selectedFile.outerIndex}
            handleSelectedFile={this.handleSelectedFile}
            resetSelectedIndex={this.resetSelectedIndex}
          />
        </Col>
        <Col span={2} className={styles.textAlignCenter}>
          <img
            src={fileStatus === 'VERIFIED' ? doneIcon : cancelIcon}
            alt=""
            onClick={
              fileStatus === 'VERIFIED' ? () => {} : () => handleCancelIcon(index, id, docList)
            }
            className={styles.viewUpLoadDataIconCancel}
          />
        </Col>
      </Row>
    );
  };

  renderErrorFile = (file, id) => {
    const {
      index,
      // handleFile,
      docList,
      handleCanCelIcon: handleCancelIcon,
    } = this.props;

    // const fileStatus = file.candidateDocumentStatus;

    return (
      <Row className={styles.checkboxItemError}>
        <Col span={8}>
          <Typography.Text>{file.displayName}</Typography.Text>
        </Col>
        <Col span={11} className={styles.textLeft}>
          <Typography.Text>File must be under 5Mb</Typography.Text>
        </Col>
        <Col
          span={3}
          className={styles.textAlign}
          onClick={() => handleCancelIcon(index, id, docList)}
        >
          <Typography.Text className={styles.boldText}>Retry</Typography.Text>
        </Col>
        <Col span={2} className={styles.textAlignCenter}>
          <img
            src={undo}
            alt=""
            onClick={() => handleCancelIcon(index, id, docList)}
            className={styles.viewUpLoadDataIconCancel}
          />
        </Col>
      </Row>
    );
  };

  render() {
    const { item = {} } = this.props;

    return (
      <div className={styles.CollapseField}>
        {item.data.length > 0 || item.type === 'E' ? (
          <Collapse
            defaultActiveKey="1"
            accordion
            expandIconPosition="right"
            expandIcon={(props) => {
              return props.isActive ? <MinusOutlined /> : <PlusOutlined />;
            }}
          >
            <Collapse.Panel
              key="1"
              header={
                <span style={{ display: 'inline-block', marginRight: '20px' }}>
                  Type {item.type}: {item.name}
                </span>
              }
              // extra="[Can submit any of the below other than (*)mandatory]"
            >
              <Space direction="vertical" className={styles.Space}>
                <div className={styles.Upload}>
                  {item.data.map((file, id) => {
                    return (
                      <div key={id}>
                        {!file.attachment && file.isValidated
                          ? this.renderUnvalidFile(file, id)
                          : file.attachment && file.isValidated
                          ? this.renderValidFile(file, id)
                          : !file.isValidated
                          ? this.renderErrorFile(file, id)
                          : ''}
                      </div>
                    );
                  })}
                </div>
              </Space>
            </Collapse.Panel>
          </Collapse>
        ) : null}
      </div>
    );
  }
}

export default CollapseField;
