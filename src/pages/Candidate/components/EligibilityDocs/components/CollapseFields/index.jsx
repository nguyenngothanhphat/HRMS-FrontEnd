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
      isAllUploaded: [],
      isValidated: false,
    };
  }

  handleFile = (res, index) => {
    const { dispatch, eliDocs = [] } = this.props;
    const tempData = [...eliDocs];
    const { statusCode } = res;
    if (statusCode === 200) {
      tempData.splice(index, 1, { ...tempData[index], data: true });
    }
    // dispatch({
    //   type: 'candidateProfile/save',
    //   payload: {
    //     eligibilityDocs: tempData,
    //   },
    // });

    console.log('temp', tempData);
    console.log('origin', eliDocs);
  };

  render() {
    const { item = {}, tempData } = this.props;
    console.log(item);
    return (
      <div className={styles.CollapseField}>
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
                  <div key={index}>
                    {!name.value ? (
                      <Row className={styles.checkboxItem}>
                        <Col span={18}>
                          <Typography.Text>{name.name}</Typography.Text>
                        </Col>
                        <Col span={5}>
                          <UploadImage
                            content="Choose file"
                            getResponse={(res) => this.handleFile(res, index)}
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
