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
  render() {
    const {
      item = {},
      loading,
      index,
      handleFile,
      docList,
      handleCanCelIcon,
      onValuesChange,
      employerName,
      checkLength,
      processStatus,
    } = this.props;
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
                  {item.data.map((name, id) => (
                    <div key={id}>
                      {!name.attachment && name.isValidated ? (
                        <Row className={styles.checkboxItem}>
                          <Col span={18}>
                            <Typography.Text>{name.displayName}</Typography.Text>
                          </Col>
                          <Col span={5} className={styles.Padding}>
                            <UploadImage
                              content="Choose file"
                              getResponse={(res) => handleFile(res, index, id, docList)}
                              loading={loading}
                              hideValidation
                              typeIndex={index}
                              nestedIndex={id}
                              getIndexFailed={this.getIndexFailed}
                            />
                          </Col>
                        </Row>
                      ) : name.attachment ? (
                        <Row className={styles.checkboxItem}>
                          <Col span={14}>
                            <Typography.Text>{name.displayName}</Typography.Text>
                          </Col>
                          <Col span={5} className={styles.textAlign}>
                            <a
                              href={name.attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.viewUpLoadDataURL}
                            >
                              {checkLength(name.attachment.name)}
                            </a>
                          </Col>
                          <Col span={3} className={styles.textAlign}>
                            <p className={styles.viewUpLoadDataText}>Uploaded</p>
                          </Col>
                          <Col span={2} className={styles.textAlignCenter}>
                            <img
                              src={cancelIcon}
                              alt=""
                              onClick={() => handleCanCelIcon(index, id, docList)}
                              className={styles.viewUpLoadDataIconCancel}
                            />
                          </Col>
                        </Row>
                      ) : name.isValidated === false ? (
                        <Row className={styles.checkboxItemError}>
                          <Col span={8}>
                            <Typography.Text>{name.displayName}</Typography.Text>
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
                              onClick={() => handleCanCelIcon(index, id, docList)}
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
