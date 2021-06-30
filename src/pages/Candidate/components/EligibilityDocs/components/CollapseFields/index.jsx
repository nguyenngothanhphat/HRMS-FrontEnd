/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Collapse, Space, Checkbox, Typography, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import undo from '@/assets/undo-signs.svg';
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
      allDocs: [],
      selectedFile: { outerIndex: '', innerIndex: '' },
    };
  }

  componentDidMount() {
    const { docList } = this.props;
    const allDoc = [];
    // let outerIndex = 0;
    docList.map((list, outerIndex) => {
      const { data = [] } = list;
      // let innerIndex = 0;
      data.map((dataItem, innerIndex) => {
        allDoc.push({ ...dataItem, outerIndex, innerIndex });
        // innerIndex++;
        return null;
      });
      // outerIndex++;
      return null;
    });
    this.setState({
      allDocs: allDoc,
    });
  }

  getActionContent = (status) => {
    if (status === 'INELIGIBLE' || status === 'PENDING') {
      return 'Choose file';
    }
    return 'Resubmit';
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

  render() {
    const {
      item = {},
      loading,
      index,
      // handleFile,
      docList,
      handleCanCelIcon: handleCancelIcon,
      checkLength,
    } = this.props;

    const { selectedFile } = this.state;

    return (
      <div className={styles.CollapseField}>
        {item.data.length > 0 || item.type === 'E' ? (
          <Collapse
            accordion
            expandIconPosition="right"
            expandIcon={(props) => {
              return props.isActive ? <MinusOutlined /> : <PlusOutlined />;
            }}
          >
            <Collapse.Panel
              header={
                <Checkbox
                  className={styles.checkbox}
                  onClick={(e) => e.stopPropagation()}
                  // onChange={(e) => handleCheckAll(e, defaultArr, item)}
                  checked
                >
                  Type {item.type}: {item.name}
                </Checkbox>
              }
              extra="[Can submit any of the below other than (*)mandatory]"
            >
              <Space direction="vertical" className={styles.Space}>
                <div className={styles.Upload}>
                  {item.data.map((file, id) => (
                    <div key={id}>
                      {!file.attachment && file.isValidated ? (
                        <Row className={styles.checkboxItem}>
                          <Col span={18}>
                            <Typography.Text>{file.displayName}</Typography.Text>
                          </Col>
                          <Col span={5} className={styles.Padding}>
                            {file.candidateDocumentStatus !== 'VERIFIED' && (
                              <Typography.Text>{file.attachment?.name}</Typography.Text>
                            )}
                            <UploadImage
                              content={this.getActionContent(file.candidateDocumentStatus)}
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
                      ) : file.attachment ? (
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
                          {file.candidateDocumentStatus !== 'VERIFIED' && (
                            <>
                              <Col span={4} className={styles.textAlign}>
                                {/* <p className={styles.viewUpLoadDataText}>Uploaded</p> */}
                                <UploadImage
                                  content={this.getActionContent(file.candidateDocumentStatus)}
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
                              <Col span={1} className={styles.textAlignCenter}>
                                <img
                                  src={cancelIcon}
                                  alt=""
                                  onClick={() => handleCancelIcon(index, id, docList)}
                                  className={styles.viewUpLoadDataIconCancel}
                                />
                              </Col>
                            </>
                          )}
                        </Row>
                      ) : // <div />
                      file.isValidated === false ? (
                        <Row className={styles.checkboxItemError}>
                          <Col span={8}>
                            <Typography.Text>{file.displayName}</Typography.Text>
                          </Col>
                          <Col span={11} className={styles.textLeft}>
                            <Typography.Text>File must be under 5Mb</Typography.Text>
                          </Col>
                          <Col span={3} className={styles.textAlign}>
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
                      ) : (
                        ''
                      )}
                    </div>
                  ))}
                </div>
                {/* {item.type === 'D' ? (
                  <Space direction="horizontal">
                    <PlusOutlined className={styles.plusIcon} />
                    <Typography.Text className={styles.addMore}>
                      Add Employer Details
                    </Typography.Text>
                  </Space>
                ) : (
                  <></>
                )} */}
              </Space>
            </Collapse.Panel>
          </Collapse>
        ) : null}
      </div>
    );
  }
}

export default CollapseField;
