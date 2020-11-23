import React, { useState, PureComponent } from 'react';
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

const CollapseRow = (props) => {
  const { data = [], onFileClick } = props;
  const [row] = useState(data);
  const [open, setOpen] = useState(true);

  // const handleMenuClick = (event) => {
  //   event.stopPropagation();
  // };

  const handleUploadClick = () => {
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

  const statusAndButtons = () => (
    <div onClick={(event) => event.stopPropagation()} className={styles.statusAndButtons}>
      {/* <a>Complete</a> */}
      <div onClick={handleUploadClick} className={styles.uploadButton}>
        <img src={UploadIcon} alt="upload" />
        <span className={styles.uploadText}>Choose file</span>
      </div>
      {/* <Dropdown overlay={menu}>
        <EllipsisOutlined onClick={handleMenuClick} className={styles.menuButton} />
      </Dropdown> */}
    </div>
  );

  const onChange = () => {
    setOpen(!open);
  };

  const headerWithArrowIcon = (status, title) => (
    <div className={styles.headerWithArrowIcon}>
      <span>{title}</span>
      {status ? (
        <img onClick={onChange} src={UpArrowIcon} alt="up-arrow" />
      ) : (
        <img onClick={onChange} src={DownArrowIcon} alt="down-arrow" />
      )}
    </div>
  );

  const identifyImageOrPdf = (fileName) => {
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

  const renderDownloadIcon = () => (
    <img alt="download" src={DownloadIcon} className={styles.downloadButton} />
  );

  return (
    <Collapse
      defaultActiveKey={['1']}
      onChange={onChange}
      bordered={false}
      className={styles.eachCollapse}
    >
      <Panel
        className={styles.eachPanel}
        key="1"
        showArrow={false}
        header={headerWithArrowIcon(open, row.kind)}
        extra={statusAndButtons()}
      >
        {row.files.map((file) => {
          const { id = '', fileName = '', source = '', generatedBy = '', date = '' } = file;
          if (id === '') return null;
          return (
            <Row key={id} className={styles.eachRow}>
              <Col span={8} className={styles.fileName}>
                <div onClick={() => onFileClick(id)}>
                  {identifyImageOrPdf(source) === 1 ? (
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
                  <DownloadFile content={renderDownloadIcon()} url={source} />
                </div>
              </Col>
            </Row>
          );
        })}
      </Panel>
    </Collapse>
  );
};
class TypeRow extends PureComponent {
  render() {
    const { data = [], onFileClick } = this.props;
    return (
      <div>
        {data.map((row, index) => (
          <CollapseRow key={`${index + 1}`} onFileClick={onFileClick} data={row} />
        ))}
      </div>
    );
  }
}

export default TypeRow;
