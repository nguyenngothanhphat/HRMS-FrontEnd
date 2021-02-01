import React, { PureComponent } from 'react';
import { Collapse, Row, Col } from 'antd';
import PDFIcon from '@/assets/pdf_icon.png';
import ImageIcon from '@/assets/image_icon.png';
// import UploadIcon from '@/assets/upload_icon.png';
import DownloadIcon from '@/assets/download_icon.svg';
import DownArrowIcon from '@/assets/downArrow.svg';
import UpArrowIcon from '@/assets/upArrow.svg';
import DownloadFile from '@/components/DownloadFile';
import { connect } from 'umi';
// import UploadIcon from '../../../../../public/assets/images/iconUpload.svg';
import UploadModal from '../UploadModal';

import styles from './index.less';

const { Panel } = Collapse;
@connect(({ employeeProfile, loading, user: { currentUser: { roles = [] } = {} } = {} } = {}) => ({
  loading: loading.effects['upload/uploadFile'],
  employeeProfile,
  roles,
}))
class CollapseRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      uploadModalVisible: false,
      actionType: 1,
      currentDocumentId: '',
    };
  }

  componentDidMount = () => {
    this.setState({
      open: true,
    });
  };

  handleUploadClick = (value, id) => {
    this.setState({
      uploadModalVisible: true,
      actionType: value,
      currentDocumentId: id || '',
    });
  };

  handleCancel = () => {
    this.setState({
      uploadModalVisible: false,
      actionType: 1,
    });
  };

  refreshData = () => {
    const {
      employeeProfile: { idCurrentEmployee = '' },
      dispatch,
    } = this.props;
    dispatch({
      type: 'employeeProfile/clearSaveDocuments',
    });
    setTimeout(() => {
      dispatch({
        type: 'employeeProfile/fetchDocuments',
        payload: { employee: idCurrentEmployee },
      });
    }, 1000);
  };

  statusAndButtons = () => {
    const { data: row = [], parentEmployeeGroup = '', isHR } = this.props;
    const { kind = '' } = row;
    //  const { files = [] } = row;
    // let checkExistFile = true;
    // if (files.length === 1) {
    //   files.forEach((value) => {
    //     const { id = '' } = value;
    //     if (id === '') checkExistFile = false;
    //   });
    // }
    return (
      <div onClick={(event) => event.stopPropagation()} className={styles.statusAndButtons}>
        {/* <a>Complete</a> */}
        <div onClick={() => this.handleUploadClick(1)} className={styles.uploadButton}>
          {/* <img src={UploadIcon} alt="upload" /> */}
          {!isHR ? (
            parentEmployeeGroup !== 'PR Reports' &&
            kind !== 'Identity' && <span className={styles.uploadText}>Upload new</span>
          ) : (
            <span className={styles.uploadText}>Upload new</span>
          )}
        </div>
        {/* <Dropdown overlay={menu}>
        <EllipsisOutlined onClick={handleMenuClick} className={styles.menuButton} />
      </Dropdown> */}
      </div>
    );
  };

  onChange = () => {
    const { open } = this.state;
    this.setState({
      open: !open,
    });
  };

  headerWithArrowIcon = (status, title) => (
    <div className={styles.headerWithArrowIcon}>
      <span>{title}</span>
      {status ? (
        <img onClick={this.onChange} src={DownArrowIcon} alt="down-arrow" />
      ) : (
        <img onClick={this.onChange} src={UpArrowIcon} alt="up-arrow" />
      )}
    </div>
  );

  identifyImageOrPdf = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      default:
        return 2;
    }
  };

  renderDownloadIcon = () => (
    <img alt="download" src={DownloadIcon} className={styles.downloadButton} />
  );

  processData = (files) => {
    return files.filter((file) => {
      const { id = '' } = file;
      return id !== null && id !== '';
    });
  };

  render() {
    const { open, uploadModalVisible, actionType, currentDocumentId } = this.state;
    const { data: row = {}, onFileClick = () => {}, parentEmployeeGroup = '' } = this.props;
    const { kind = '', files = [] } = row;
    const processData = this.processData(files);

    return (
      <div>
        <UploadModal
          actionType={actionType}
          visible={uploadModalVisible}
          handleCancel={this.handleCancel}
          employeeGroup={kind}
          parentEmployeeGroup={parentEmployeeGroup}
          refreshData={this.refreshData}
          currentDocumentId={currentDocumentId}
        />
        <Collapse
          defaultActiveKey={['1']}
          onChange={this.onChange}
          bordered={false}
          className={styles.eachCollapse}
        >
          <Panel
            className={styles.eachPanel}
            key="1"
            showArrow={false}
            header={this.headerWithArrowIcon(open, kind)}
            extra={this.statusAndButtons()}
          >
            {processData.map((file) => {
              const { id = '', fileName = '', source = '', generatedBy = '', date = '' } = file;
              return (
                <Row key={id} className={styles.eachRow}>
                  <Col span={8} className={styles.fileName}>
                    <div onClick={() => onFileClick(id)}>
                      {this.identifyImageOrPdf(source) === 1 ? (
                        <img src={PDFIcon} alt="file" className={styles.fileIcon} />
                      ) : (
                        <img src={ImageIcon} alt="img" className={styles.fileIcon} />
                      )}
                      <span>{fileName}</span>
                    </div>
                  </Col>
                  <Col span={7}>{generatedBy}</Col>
                  <Col span={7}>{date}</Col>
                  <Col span={2}>
                    <div className={styles.downloadFile}>
                      <div className={styles.uploadButton}>
                        <img
                          alt="upload"
                          src={DownloadIcon}
                          onClick={() => this.handleUploadClick(2, id)}
                          className={styles.downloadButton}
                          // title="Replace document"
                        />
                      </div>
                      <DownloadFile content={this.renderDownloadIcon()} url={source} />
                    </div>
                  </Col>
                </Row>
              );
            })}
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default CollapseRow;
