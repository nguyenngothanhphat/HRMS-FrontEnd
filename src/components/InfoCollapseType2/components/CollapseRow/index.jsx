import React, { PureComponent } from 'react';
import { Collapse, Row, Col } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import PDFIcon from '@/assets/pdf_icon.png';
import ImageIcon from '@/assets/image_icon.png';
// import UploadIcon from '@/assets/upload_icon.png';
import DownloadIcon from '@/assets/download_icon.svg';
import DownArrowIcon from '@/assets/downArrow.svg';
import UpArrowIcon from '@/assets/upArrow.svg';
import DownloadFile from '@/components/DownloadFile';
import { connect } from 'umi';
// import UploadIcon from '../../../../../public/assets/images/iconUpload.svg';
import moment from 'moment';
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
      currentFileName: '',
    };
  }

  componentDidMount = () => {
    this.setState({
      open: true,
    });
  };

  handleUploadClick = (value, _id, fileName) => {
    this.setState({
      uploadModalVisible: true,
      actionType: value,
      currentDocumentId: _id || '',
      currentFileName: fileName || '',
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
      employeeProfile: { idCurrentEmployee = '', tenantCurrentEmployee = '' },
      dispatch,
    } = this.props;
    dispatch({
      type: 'employeeProfile/clearSaveDocuments',
    });
    setTimeout(() => {
      dispatch({
        type: 'employeeProfile/fetchDocuments',
        payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
      });
    }, 1000);
  };

  checkShowUploadBtn = () => {
    const { data: row = [] } = this.props;
    const { name = '' } = row;
    return (
      // !isHR &&
      name !== 'Indentity'
    );
  };

  statusAndButtons = () => {
    const showUpload = this.checkShowUploadBtn();
    return (
      <div onClick={(event) => event.stopPropagation()} className={styles.statusAndButtons}>
        <div onClick={() => this.handleUploadClick(1)} className={styles.uploadButton}>
          {showUpload && <span className={styles.uploadText}>Upload new</span>}
        </div>
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
      const { _id = '' } = file;
      return _id !== null && _id !== '';
    });
  };

  render() {
    const { open, uploadModalVisible, actionType, currentDocumentId, currentFileName } = this.state;
    const {
      data: row = {},
      onFileClick = () => {},
      employeeProfile: {
        originData: { generalData: { employeeId: idCurrentEmployee = '' } = {} } = {},
      },
    } = this.props;
    const { name = '', _id: categoryId = '', files = [] } = row;
    const processData = this.processData(files);
    const showUpload = this.checkShowUploadBtn();
    return (
      <div>
        <UploadModal
          actionType={actionType}
          visible={uploadModalVisible}
          handleCancel={this.handleCancel}
          childCategory={name}
          categoryId={categoryId}
          refreshData={this.refreshData}
          currentDocumentId={currentDocumentId}
          currentFileName={currentFileName}
          idCurrentEmployee={idCurrentEmployee}
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
            header={this.headerWithArrowIcon(open, name)}
            extra={this.statusAndButtons()}
          >
            {processData.map((file) => {
              const {
                _id = '',
                key: fileName = '',
                attachment: { url: source = '' } = {},
                generatedBy = 'Terralogic',
                createdAt = '',
              } = file;
              return (
                <Row key={_id} className={styles.eachRow}>
                  <Col span={8} className={styles.fileName}>
                    <div onClick={() => onFileClick(_id)}>
                      {this.identifyImageOrPdf(source) === 1 ? (
                        <img src={PDFIcon} alt="file" className={styles.fileIcon} />
                      ) : (
                        <img src={ImageIcon} alt="img" className={styles.fileIcon} />
                      )}
                      <span>{fileName}</span>
                    </div>
                  </Col>
                  <Col span={6}>{generatedBy}</Col>
                  <Col span={6}>{moment(createdAt).locale('en').format('MM.DD.YY')}</Col>
                  <Col span={4}>
                    <div className={styles.downloadFile}>
                      {showUpload && (
                        <div className={styles.uploadButton}>
                          <img
                            alt="upload"
                            src={DownloadIcon}
                            onClick={() => this.handleUploadClick(2, _id, fileName)}
                            className={styles.downloadButton}
                          />
                        </div>
                      )}
                      <div className={styles.completed}>Complete</div>
                      <div className={styles.downloadButton}>
                        <DownloadFile content={this.renderDownloadIcon()} url={source} />
                      </div>
                      <div className={styles.actionButton}>
                        <EllipsisOutlined />
                      </div>
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
