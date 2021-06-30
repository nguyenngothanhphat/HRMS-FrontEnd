/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Collapse, Space, Checkbox, Typography, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import undo from '@/assets/undo-signs.svg';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import UploadImage from '../UploadImage';
import InputField from '../InputField';
import styles from './index.less';

@connect(({ candidateProfile: { candidate = '', data, tempData } = {} }) => ({
  data,
  tempData,
  candidate,
}))
class PreviousEmployment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: { outerIndex: '', innerIndex: '' },
      currentCompany: null,
    };
  }

  componentDidMount() {
    const {
      data: { workHistory = [] },
    } = this.props;

    workHistory.forEach((wh, index) => {
      if (wh.toPresent) {
        this.setState({
          currentCompany: index,
        });
      }
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

  getResponse = async (res, index, id, docList, docListEFilter) => {
    const { handleFile } = this.props;
    handleFile(res, index, id, docList, docListEFilter);
    this.resetSelectedIndex();
  };

  handleToPresent = async (index, checked, workHistoryId) => {
    if (checked) {
      this.setState({
        currentCompany: index,
      });
    } else {
      this.setState({
        currentCompany: null,
      });
    }
    const { dispatch, candidate, renderData = () => {} } = this.props;
    await dispatch({
      type: 'candidateProfile/updateWorkHistory',
      payload: {
        tenantId: getCurrentTenant(),
        candidate,
        _id: workHistoryId,
        toPresent: checked,
      },
    });
    await dispatch({
      type: 'candidateProfile/fetchDocumentByCandidate',
      payload: {
        candidate,
        tenantId: getCurrentTenant(),
      },
    });
    renderData();
  };

  onValuesChange = (val, type) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'candidateProfile/saveOrigin',
      payload: {
        [type]: val,
      },
    });
  };

  renderEmployer = (docListE, item, index) => {
    console.log('docListE', docListE);
    const {
      loading = false,
      // handleFile,
      handleCanCelIcon: handleCancelIcon = () => {},
      checkLength = () => {},
      data: { documentListToRender: docList = [], workHistory = [] },
    } = this.props;

    const { selectedFile, currentCompany } = this.state;

    let itemDataFilter = [];
    const workHistoryObj = workHistory.find((w) => w._id === item.workHistoryId);
    if (currentCompany === index || workHistoryObj.toPresent) {
      itemDataFilter = item.data.filter(
        (doc) => doc.key === 'paysTubs' || doc.key === 'form16' || doc.isCandidateUpload,
      );
    } else {
      itemDataFilter = item.data.filter(
        (doc) => doc.key === 'relievingLetter' || doc.isCandidateUpload,
      );
    }

    const docListEFilter = docListE.map((doc, index1) => {
      if (index === index1) {
        return {
          ...doc,
          data: itemDataFilter,
        };
      }
      return doc;
    });

    const checkIfHasCurrentCompany = workHistory.filter((value) => value.toPresent) || [];

    return (
      <>
        <InputField
          onValuesChange={this.onValuesChange}
          item={item}
          index={index}
          currentCompany={currentCompany}
          hasCurrentCompany={checkIfHasCurrentCompany.length > 0}
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
                          getResponse={(res) =>
                            this.getResponse(res, index, id, docList, docListEFilter)}
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
                                this.getResponse(res, index, id, docList, docListEFilter)}
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
                              onClick={() => handleCancelIcon(index, id, docList, docListEFilter)}
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
    const { data: { documentListToRender: docList = [] } = {} } = this.props;
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
