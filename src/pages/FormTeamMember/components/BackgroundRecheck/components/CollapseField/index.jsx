/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Collapse, Checkbox, Space, Col, Row, Typography, Radio } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import PopUpViewDocument from '../PopUpViewDocument';
import styles from './index.less';

class CollapseField extends Component {
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

  render() {
    const { item = {}, index: indexGroupDoc = '', handleCheckDocument = () => {} } = this.props;
    const { visible, url, displayName } = this.state;
    return (
      <div className={styles.collapseField}>
        {item.data.length > 0 ? (
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
                  Type {item.type}: {item.name}
                </Checkbox>
              }
              extra="[Can submit any of the below other than (*)mandatory]"
            >
              <Space direction="vertical" className={styles.space}>
                {item.data.map((document, index) => {
                  const { attachment = { fileName: '' }, candidateDocumentStatus } = document;
                  console.log(candidateDocumentStatus);
                  const { fileName = '' } = attachment;
                  return (
                    <Row gutter={[16, 0]} className={styles.collapseField__row} key={index}>
                      <Col span={7}>
                        <Typography.Text>{document.displayName}</Typography.Text>
                      </Col>
                      <Col span={8} className={styles.collapseField__row__file}>
                        <div
                          onClick={() => this.openViewDocument(document.displayName, attachment)}
                          className={this.renderClassnameOfFile(candidateDocumentStatus)}
                        >
                          <span>{fileName}</span>
                        </div>
                      </Col>
                      <Col span={9} className={styles.collapseField__row__radio}>
                        {fileName && (
                          <Radio.Group
                            name="radiogroup"
                            defaultValue={candidateDocumentStatus}
                            onChange={(event) => {
                              handleCheckDocument(event, indexGroupDoc, document);
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
              </Space>
            </Collapse.Panel>
          </Collapse>
        ) : null}

        <PopUpViewDocument
          titleModal={displayName}
          visible={visible}
          handleCancel={this.handleCancel}
          url={url}
        />
      </div>
    );
  }
}

export default CollapseField;
