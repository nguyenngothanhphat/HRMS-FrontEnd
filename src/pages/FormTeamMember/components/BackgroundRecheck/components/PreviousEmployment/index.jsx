/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Collapse, Checkbox, Space, Col, Row, Typography, Radio } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { connect } from 'umi';
import InputField from '../InputField';
import styles from './index.less';

@connect(({ candidateInfo: { candidate = '', data, tempData } = {} }) => ({
  data,
  tempData,
  candidate,
}))
class PreviousEmployment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      url: '',
      displayName: '',
    };
  }

  openViewDocument = (displayName, attachment) => {
    const { url } = attachment;
    if (!attachment) {
      return;
    }
    this.setState({
      visible: true,
      url,
      displayName,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      url: '',
      displayName: '',
    });
  };

  renderClassnameOfFile = (candidateDocumentStatus) => {
    let className = `${styles.file__content} `;
    if (candidateDocumentStatus === 'VERIFIED') {
      className += `${styles.file__content__verified} `;
    }
    if (candidateDocumentStatus === 'RE-SUBMIT') {
      className += `${styles.file__content__resubmit} `;
    }
    if (candidateDocumentStatus === 'INELIGIBLE') {
      className += `${styles.file__content__ineligible} `;
    }
    return className;
  };

  renderEmployer = (item, docListE, indexGroupDoc, firstIndex) => {
    const {
      handleCheckDocument = () => {},
      data: { workHistory = [] },
    } = this.props;

    const currentCompany = workHistory.filter((value) => value.toPresent) || [];

    let itemDataFilter = [];
    if (item.toPresent) {
      itemDataFilter = item.data.filter(
        (doc) => doc.key === 'paysTubs' || doc.key === 'form16' || doc.isCandidateUpload,
      );
    } else {
      itemDataFilter = item.data.filter(
        (doc) => doc.key === 'relievingLetter' || doc.isCandidateUpload,
      );
    }

    return (
      <>
        <Row gutter={[16, 0]} className={styles.previousEmployment__row}>
          <Col span={24}>
            <InputField
              item={item}
              index={indexGroupDoc}
              hasCurrentCompany={currentCompany.length > 0}
            />
          </Col>
        </Row>

        {itemDataFilter.map((document, index) => {
          const { attachment = { name: '' }, candidateDocumentStatus } = document;
          const { name: fileName = '' } = attachment;
          return (
            <Row gutter={[16, 0]} className={styles.previousEmployment__row} key={index}>
              <Col span={6} className={styles.previousEmployment__row__name}>
                <Typography.Text>{document.displayName}</Typography.Text>
              </Col>
              <Col span={7} className={styles.previousEmployment__row__file}>
                <div
                  onClick={() => {
                    if (!fileName) {
                      return;
                    }
                    this.openViewDocument(document.displayName, attachment);
                  }}
                  className={this.renderClassnameOfFile(candidateDocumentStatus)}
                >
                  <span>{fileName}</span>
                </div>
              </Col>
              <Col span={11} className={styles.previousEmployment__row__radio}>
                {fileName && (
                  <Radio.Group
                    name="radiogroup"
                    defaultValue={candidateDocumentStatus}
                    onChange={(event) => {
                      handleCheckDocument(event, indexGroupDoc + firstIndex, document, 'E');
                    }}
                  >
                    <Radio value="VERIFIED" className={styles.verified}>
                      Verified
                    </Radio>
                    <Radio value="RE-SUBMIT" className={styles.resubmit}>
                      Re-submit
                    </Radio>
                    <Radio value="INELIGIBLE" className={styles.ineligible}>
                      Ineligible
                    </Radio>
                  </Radio.Group>
                )}
              </Col>
            </Row>
          );
        })}
        {indexGroupDoc + 1 < docListE.length && <hr />}
      </>
    );
  };

  render() {
    const { docList = [] } = this.props;
    const { visible, url, displayName } = this.state;
    const docListE = docList.filter((d) => d.type === 'E');
    const firstIndex = docList.findIndex((d) => d.type === 'E');
    return (
      <div className={styles.PreviousEmployment}>
        {docListE.length > 0 ? (
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
                  checked="true"
                >
                  Type {docListE[0].type}: {docListE[0].name}
                </Checkbox>
              }
              extra="[All Mandatory documents will need to be submitted. One or more of the optional documents can be submitted]"
            >
              <Space direction="vertical" className={styles.space}>
                {docList.map((doc, i) => {
                  if (doc.type === 'E') {
                    return this.renderEmployer(doc, docListE, i - firstIndex, firstIndex);
                  }
                  return '';
                })}
              </Space>
            </Collapse.Panel>
          </Collapse>
        ) : null}

        <ViewDocumentModal
          visible={visible}
          fileName={displayName}
          url={url}
          onClose={this.handleCancel}
        />
      </div>
    );
  }
}

export default PreviousEmployment;
