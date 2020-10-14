/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Collapse, Space, Checkbox, Typography, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined, RedoOutlined } from '@ant-design/icons';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import UploadImage from '../UploadImage';
import InputField from '../InputField';
import styles from './index.less';

class CollapseField extends PureComponent {
  render() {
    const { item = {}, id, handleFile, handleCanCelIcon, handleAdd } = this.props;
    return (
      <div className={styles.CollapseField} key={id}>
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
            {item.type === 'D' ? <InputField /> : <></>}
            <Space direction="vertical" className={styles.Space}>
              <div className={styles.Upload}>
                {item.data.map((name, index) => (
                  // <Row className={styles.checkboxItem}>
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={index}>
                    {!name.value && name.isUploaded === null ? (
                      <Row className={styles.checkboxItem}>
                        <Col span={18}>
                          <Typography.Text>{name.name}</Typography.Text>
                        </Col>
                        <Col span={5}>
                          <UploadImage
                            content="Choose file"
                            getResponse={(resp) => handleFile(resp, index, id)}
                          />
                        </Col>
                      </Row>
                    ) : name.value && name.isUploaded === true ? (
                      <Row className={styles.checkboxItem}>
                        <Col span={14}>
                          <Typography.Text>{name.name}</Typography.Text>
                        </Col>
                        <Col span={5} className={styles.textAlign}>
                          <a
                            href={name.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewUpLoadDataURL}
                          >
                            {name.fileName}
                          </a>
                        </Col>
                        <Col span={3} className={styles.textAlign}>
                          <p className={styles.viewUpLoadDataText}>Uploaded</p>
                        </Col>
                        <Col span={2} className={styles.textAlignCenter}>
                          <img
                            src={cancelIcon}
                            alt=""
                            onClick={() => handleCanCelIcon(index, id)}
                            className={styles.viewUpLoadDataIconCancel}
                          />
                        </Col>
                      </Row>
                    ) : !name.value && name.isUploaded === false ? (
                      <Row className={styles.checkboxItemError}>
                        <Col span={8}>
                          <Typography.Text>{name.name}</Typography.Text>
                        </Col>
                        <Col span={11}>
                          <Typography.Text>File must be under 5Mb</Typography.Text>
                        </Col>
                        <Col span={3} className={styles.paddingLeft}>
                          <Typography.Text className={styles.boldText}>Retry</Typography.Text>
                        </Col>
                        <Col span={2} className={styles.textAlignCenter}>
                          <RedoOutlined
                            className={styles.retryIcon}
                            onClick={() => handleCanCelIcon(index, id)}
                          />
                        </Col>
                      </Row>
                    ) : null}
                  </div>
                ))}
              </div>
              {item.type === 'D' ? (
                <Space direction="horizontal" onClick={() => handleAdd()}>
                  <PlusOutlined className={styles.plusIcon} />
                  <Typography.Text className={styles.addMore}>Add Employer Details</Typography.Text>
                </Space>
              ) : (
                <></>
              )}
            </Space>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}

export default CollapseField;
