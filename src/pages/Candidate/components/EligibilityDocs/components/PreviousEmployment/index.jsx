/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Collapse, Space, Checkbox, Typography, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import undo from '@/assets/undo-signs.svg';
import { connect } from 'umi';
import UploadImage from '../UploadImage';
import InputField from '../InputField';
import styles from './index.less';

@connect(({ candidateProfile: { data, tempData } = {} }) => ({
  data,
  tempData,
}))
class PreviousEmployment extends Component {
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
      currentCompany: null,
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

  handleToPresent = (index, checked) => {
    if (checked) {
      this.setState({
        currentCompany: index,
      });
    } else {
      this.setState({
        currentCompany: null,
      });
    }
  };

  renderEmployer = (docListE, item, index) => {
    const {
      loading = false,
      // handleFile,
      handleCanCelIcon: handleCancelIcon = () => {},
      onValuesChange = () => {},
      checkLength = () => {},
    } = this.props;

    const { selectedFile, currentCompany } = this.state;

    let itemDataFilter = [];
    if (currentCompany === index) {
      itemDataFilter = item.data.filter(
        (doc) => doc.key === 'paysTubs' || doc.key === 'form16' || doc.isCandidateUpload,
      );
    } else {
      itemDataFilter = item.data.filter(
        (doc) => doc.key === 'relievingLetter' || doc.isCandidateUpload,
      );
    }

    const docListEFilter = docListE.map((doc) => {
      return {
        ...doc,
        data: itemDataFilter,
      };
    });

    return (
      <>
        <InputField
          onValuesChange={onValuesChange}
          item={item}
          index={index}
          currentCompany={currentCompany}
          handleToPresent={this.handleToPresent}
        />
        <Space direction="vertical" className={styles.Space}>
          <div className={styles.Upload}>
            {itemDataFilter.map((file, id) => {
              return (
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
                          getResponse={(res) => this.getResponse(res, index, id, docListEFilter)}
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
                              getResponse={(res) =>
                                this.getResponse(res, index, id, docListEFilter)}
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
                              onClick={() => handleCancelIcon(index, id, docListEFilter)}
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
                          onClick={() => handleCancelIcon(index, id, docListE)}
                          className={styles.viewUpLoadDataIconCancel}
                        />
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                </div>
              );
            })}
          </div>
        </Space>
        {index + 1 < docListE.length && <hr />}
      </>
    );
  };

  render() {
    const { docList = [] } = this.props;
    const docListE = docList.filter((d) => d.type === 'E');
    return (
      <div className={styles.PreviousEmployment}>
        {docListE.length > 0 && (
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
                  Type {docListE[0].type}: {docListE[0].name}
                </Checkbox>
              }
              extra="[Can submit any of the below other than (*)mandatory]"
            >
              {docListE.map((item, index) => this.renderEmployer(docListE, item, index))}
            </Collapse.Panel>
          </Collapse>
        )}
      </div>
    );
  }
}

export default PreviousEmployment;
