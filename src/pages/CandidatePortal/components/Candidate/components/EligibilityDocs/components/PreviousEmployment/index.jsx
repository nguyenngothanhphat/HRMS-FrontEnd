/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Collapse, Space, Checkbox, Typography, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import undo from '@/assets/candidatePortal/undo-signs.svg';
import doneIcon from '@/assets/candidatePortal/doneSign.svg';
import { getCurrentTenant } from '@/utils/authority';
import UploadImage from '../UploadImage';
import InputField from '../InputField';
import styles from './index.less';

@connect(({ candidatePortal: { candidate = '', data, tempData } = {} }) => ({
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
      type: 'candidatePortal/updateWorkHistory',
      payload: {
        tenantId: getCurrentTenant(),
        candidate,
        _id: workHistoryId,
        toPresent: checked,
      },
    });
    await dispatch({
      type: 'candidatePortal/fetchDocumentByCandidate',
      payload: {
        candidate,
        tenantId: getCurrentTenant(),
      },
    });
    renderData(false);
  };

  onValuesChange = async (val, type, workHistoryId) => {
    const { dispatch, candidate } = this.props;

    await dispatch({
      type: 'candidatePortal/updateWorkHistory',
      payload: {
        tenantId: getCurrentTenant(),
        candidate,
        _id: workHistoryId,
        [type]: val,
      },
    });

    dispatch({
      type: 'candidatePortal/saveOrigin',
      payload: {
        [type]: val,
      },
    });
  };

  renderUnvalidFile = (file, id, docListEFilter, docListE, item, index) => {
    const {
      loading = false,
      data: { documentListToRender: docList = [] },
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
            getResponse={(res) => this.getResponse(res, index, id, docList, docListEFilter)}
            loading={loading}
            hideValidation
            typeIndex={index}
            nestedIndex={id}
            getIndexFailed={this.getIndexFailed}
            selectedInner={selectedFile.innerIndex}
            selectedOuter={selectedFile.outerIndex}
            handleSelectedFile={this.handleSelectedFile}
            resetSelectedIndex={this.resetSelectedIndex}
            docList={docList}
            docListEFilter={docListEFilter}
            isTypeE
          />
        </Col>
      </Row>
    );
  };

  renderValidFile = (file, id, docListEFilter, docListE, item, index) => {
    const {
      loading = false,
      // handleFile,
      handleCancelIcon = () => {},
      checkLength = () => {},
      data: { documentListToRender: docList = [] },
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
            getResponse={(res) => this.getResponse(res, index, id, docList, docListEFilter)}
            loading={loading}
            hideValidation
            typeIndex={index}
            nestedIndex={id}
            getIndexFailed={this.getIndexFailed}
            selectedInner={selectedFile.innerIndex}
            selectedOuter={selectedFile.outerIndex}
            handleSelectedFile={this.handleSelectedFile}
            resetSelectedIndex={this.resetSelectedIndex}
            docList={docList}
            docListEFilter={docListEFilter}
            isTypeE
          />
        </Col>
        <Col span={2} className={styles.textAlignCenter}>
          <img
            src={fileStatus === 'VERIFIED' ? doneIcon : cancelIcon}
            alt=""
            onClick={
              fileStatus === 'VERIFIED'
                ? () => {}
                : () => handleCancelIcon(index, id, docList, docListEFilter)
            }
            className={styles.viewUpLoadDataIconCancel}
          />
        </Col>
      </Row>
    );
  };

  renderErrorFile = (file, id, docListEFilter, docListE, item, index) => {
    const {
      handleCancelIcon = () => {},
      data: { documentListToRender: docList = [] },
    } = this.props;

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
          onClick={() => handleCancelIcon(index, id, docList, docListEFilter)}
        >
          <Typography.Text className={styles.boldText}>Retry</Typography.Text>
        </Col>
        <Col span={2} className={styles.textAlignCenter}>
          <img
            src={undo}
            alt=""
            onClick={() => handleCancelIcon(index, id, docList, docListEFilter)}
            className={styles.viewUpLoadDataIconCancel}
          />
        </Col>
      </Row>
    );
  };

  renderEmployer = (docListE, item, index) => {
    const {
      data: { workHistory = [] },
    } = this.props;

    const { currentCompany } = this.state;

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
                  {!file.attachment && file.isValidated
                    ? this.renderUnvalidFile(file, id, docListEFilter, docListE, item, index)
                    : file.attachment && file.isValidated
                    ? this.renderValidFile(file, id, docListEFilter, docListE, item, index)
                    : !file.isValidated
                    ? this.renderErrorFile(file, id, docListEFilter, docListE, item, index)
                    : ''}
                </div>
              );
            })}
          </div>
        </Space>
        {index + 1 < docListE.length && <div className={styles.divider} />}
      </>
    );
  };

  render() {
    const { data: { documentListToRender: docList = [] } = {} } = this.props;
    const docListE = docList.filter((d) => d.type === 'E');
    return (
      <>
        {docListE.length > 0 && (
          <div className={styles.PreviousEmployment}>
            <Collapse
              accordion
              defaultActiveKey="1"
              expandIconPosition="right"
              expandIcon={(props) => {
                return props.isActive ? <MinusOutlined /> : <PlusOutlined />;
              }}
            >
              <Collapse.Panel
                key="1"
                header={
                  <span style={{ display: 'inline-block', marginRight: '20px' }}>
                    Type {docListE[0].type}: {docListE[0].name}
                  </span>
                }
                // extra="[Can submit any of the below other than (*)mandatory]"
              >
                {docListE.map((item, index) => this.renderEmployer(docListE, item, index))}
              </Collapse.Panel>
            </Collapse>
          </div>
        )}
      </>
    );
  }
}

export default PreviousEmployment;
