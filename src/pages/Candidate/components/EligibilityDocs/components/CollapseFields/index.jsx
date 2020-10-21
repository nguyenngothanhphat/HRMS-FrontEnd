/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Collapse, Space, Checkbox, Typography, Upload, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import UploadImage from '@/components/UploadImage';
import InputField from '../InputField';
import styles from './index.less';

class CollapseField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isUpdated: false,
      urlFile: '',
      isAllUploaded: false,
    };
  }

  // handleFile = (res, index, id) => {
  //   console.log(res);
  //   console.log('index cha', index);
  //   console.log('id con', id);
  //   const { docList } = this.props;
  //   console.log('abc', docList);
  //   const arrToAdjust = JSON.parse(JSON.stringify(docList));
  //   const { data } = arrToAdjust[id];
  //   const { statusCode } = res;
  // };

  render() {
    const { item = {}, loading, index, handleFile, docList } = this.props;
    console.log('item data', item.data);
    const { isUpdated } = this.state;
    return (
      <div className={styles.CollapseField}>
        {item.data.length > 1 ? (
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
                  {item.data.map((name, id) => (
                    // <Row className={styles.checkboxItem}>
                    <div key={id}>
                      {!isUpdated ? (
                        <Row className={styles.checkboxItem}>
                          <Col span={18}>
                            <Typography.Text>{name.key}</Typography.Text>
                          </Col>
                          <Col span={5}>
                            <UploadImage
                              content="Choose file"
                              getResponse={(res) => handleFile(res, index, id, docList)}
                              // loading={loading}
                            />
                          </Col>
                        </Row>
                      ) : (
                        <Row className={styles.checkboxItem}>
                          <Col span={14}>
                            <Typography.Text>{name.name}</Typography.Text>
                          </Col>
                          <Col span={5} className={styles.textAlign}>
                            <a
                              href="#"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.viewUpLoadDataURL}
                            >
                              fileName
                            </a>
                          </Col>
                          <Col span={3} className={styles.textAlign}>
                            <p className={styles.viewUpLoadDataText}>Uploaded</p>
                          </Col>
                          <Col span={2} className={styles.textAlignCenter}>
                            <img
                              src={cancelIcon}
                              alt=""
                              onClick={this.handleCanCelIcon}
                              className={styles.viewUpLoadDataIconCancel}
                            />
                          </Col>
                        </Row>
                      )}
                    </div>
                    // <Col span={18}>
                    //   <Typography.Text>{name.name}</Typography.Text>
                    // </Col>
                    // <Col span={6}>
                    //   {!this.state.isUpdated ? (
                    //     <UploadImage
                    //       content="Choose file"
                    //       getResponse={(res) => this.handleFile(res)}
                    //     />
                    //   ) : (
                    //     <div>
                    //       <a
                    //         href="#"
                    //         target="_blank"
                    //         rel="noopener noreferrer"
                    //         className={styles.viewUpLoadDataURL}
                    //       >
                    //         fileName
                    //       </a>
                    //       <p className={styles.viewUpLoadDataText}>Uploaded</p>
                    //       <img
                    //         src={cancelIcon}
                    //         alt=""
                    //         onClick={this.handleCanCelIcon}
                    //         className={styles.viewUpLoadDataIconCancel}
                    //       />
                    //     </div>
                    //   )}
                    // </Col>
                    // </Row>
                  ))}
                </div>
                {item.type === 'D' ? (
                  <Space direction="horizontal">
                    <PlusOutlined className={styles.plusIcon} />
                    <Typography.Text className={styles.addMore}>
                      Add Employer Details
                    </Typography.Text>
                  </Space>
                ) : (
                  <></>
                )}
              </Space>
            </Collapse.Panel>
          </Collapse>
        ) : null}
      </div>
    );
  }
}

export default CollapseField;
