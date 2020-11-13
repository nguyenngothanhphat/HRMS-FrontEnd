/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Collapse, Space, Checkbox, Typography, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import undo from '@/assets/undo-signs.svg';
import UploadImage from '../UploadImage';
import InputField from '../InputField';
import styles from './index.less';

class CollapseField extends PureComponent {
  // uploadText = (status) => {
  //   if(status === 'VERIFIED') {
  //     return 'Uploaded';
  //   }
  //   return 'Reupload'
  // }

  getActionContent = (status) => {
    console.log(status);
    if (status === 'INELIGIBLE' || status === 'PENDING') {
      return 'Choose file';
    }
    return 'Resubmit';
  };

  render() {
    const {
      item = {},
      loading,
      index,
      handleFile,
      docList,
      handleCanCelIcon: handleCancelIcon,
      onValuesChange,
      employerName,
      checkLength,
      processStatus,
    } = this.props;

    const { data, type } = item;
    return (
      <div className={styles.CollapseField}>
        {item.data.length > 0 || item.type === 'D' ? (
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
                  checked="true"
                >
                  Type {item.type}: {item.name}
                </Checkbox>
              }
              extra="[Can submit any of the below other than (*)mandatory]"
            >
              {item.type === 'D' ? (
                <InputField onValuesChange={onValuesChange} employerName={employerName} />
              ) : (
                <></>
              )}
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
                              getResponse={(res) => handleFile(res, index, id, docList)}
                              loading={loading}
                              hideValidation
                              typeIndex={index}
                              nestedIndex={id}
                              getIndexFailed={this.getIndexFailed}
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
                                  getResponse={(res) => handleFile(res, index, id, docList)}
                                  loading={loading}
                                  hideValidation
                                  typeIndex={index}
                                  nestedIndex={id}
                                  getIndexFailed={this.getIndexFailed}
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
