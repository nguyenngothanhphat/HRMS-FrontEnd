import React, { PureComponent } from 'react';
import { Collapse, Row, Col } from 'antd';
// import { EllipsisOutlined } from '@ant-design/icons';
import PDFIcon from '@/assets/pdf_icon.png';
import ImageIcon from '@/assets/image_icon.png';
import UploadIcon from '@/assets/upload_icon.png';
import DownloadIcon from '@/assets/download_icon.svg';
import DownArrowIcon from '@/assets/downArrow.svg';
import UpArrowIcon from '@/assets/upArrow.svg';
import DownloadFile from '@/components/DownloadFile';

import styles from './index.less';

const { Panel } = Collapse;

class CollapseRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  componentDidMount = () => {
    this.setState({
      open: true,
    });
  };

  // const handleMenuClick = (event) => {
  //   event.stopPropagation();
  // };

  handleUploadClick = () => {
    alert('Uploading');
    // event.stopPropagation();
  };

  // const menu = () => (
  //   <Menu>
  //     <Menu.Item>
  //       <div>1st menu item</div>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <div>2nd menu item</div>
  //     </Menu.Item>
  //     <Menu.Item danger>a danger item</Menu.Item>
  //   </Menu>
  // );

  statusAndButtons = () => (
    <div onClick={(event) => event.stopPropagation()} className={styles.statusAndButtons}>
      {/* <a>Complete</a> */}
      <div onClick={this.handleUploadClick} className={styles.uploadButton}>
        <img src={UploadIcon} alt="upload" />
        <span className={styles.uploadText}>Choose file</span>
      </div>
      {/* <Dropdown overlay={menu}>
        <EllipsisOutlined onClick={handleMenuClick} className={styles.menuButton} />
      </Dropdown> */}
    </div>
  );

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
        <img onClick={this.onChange} src={UpArrowIcon} alt="up-arrow" />
      ) : (
        <img onClick={this.onChange} src={DownArrowIcon} alt="down-arrow" />
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

  render() {
    const { open } = this.state;
    const { data: row = [] } = this.props;
    const { onFileClick = () => {} } = this.props;
    return (
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
          header={this.headerWithArrowIcon(open, row.kind)}
          extra={this.statusAndButtons()}
        >
          {row.files.map((file) => {
            const { id = '', fileName = '', source = '', generatedBy = '', date = '' } = file;
            if (id === '') return null;
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
                    <DownloadFile content={this.renderDownloadIcon()} url={source} />
                  </div>
                </Col>
              </Row>
            );
          })}
        </Panel>
      </Collapse>
    );
  }
}

export default CollapseRow;
