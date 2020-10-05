import React, { useState, PureComponent } from 'react';
import { Collapse, Row, Col, Menu, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import FileIcon from '@/assets/pdf_icon.png';
import ImageIcon from '@/assets/imageIcon.png';
import DownloadIcon from '@/assets/download_icon.svg';
import DownArrowIcon from '@/assets/downArrow.svg';
import UpArrowIcon from '@/assets/upArrow.svg';
import styles from './index.less';

const { Panel } = Collapse;

const CollapseRow = (props) => {
  const { data = [], onFileClick } = props;
  const [row] = useState(data);
  const [open, setOpen] = useState(true);

  const handleDownloadClick = (event) => {
    event.stopPropagation();
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
  };

  const menu = () => (
    <Menu>
      <Menu.Item>
        <div>1st menu item</div>
      </Menu.Item>
      <Menu.Item>
        <div>2nd menu item</div>
      </Menu.Item>
      <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
  );

  const statusAndButtons = () => (
    <div onClick={handleMenuClick} className={styles.statusAndButtons}>
      <a>Complete</a>
      <img
        alt="download"
        src={DownloadIcon}
        className={styles.downloadButton}
        onClick={handleDownloadClick}
      />
      <Dropdown overlay={menu}>
        <EllipsisOutlined onClick={handleMenuClick} className={styles.menuButton} />
      </Dropdown>
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
        {row.files.map((file) => (
          <Row id={file.id} className={styles.eachRow}>
            <Col span={8} className={styles.fileName}>
              <div onClick={() => onFileClick(file.id)}>
                {identifyImageOrPdf(file.source) === 1 ? (
                  <img src={FileIcon} alt="file" className={styles.fileIcon} />
                ) : (
                  <img src={ImageIcon} alt="img" className={styles.fileIcon} />
                )}
                <span>{file.fileName}</span>
              </div>
            </Col>
            <Col span={7}>{file.generatedBy}</Col>
            <Col span={7}>{file.date}</Col>
            <Col span={2} />
          </Row>
        ))}
      </Panel>
    </Collapse>
  );
};
class TypeRow extends PureComponent {
  render() {
    const { data = [], onFileClick } = this.props;
    return (
      <div>
        {data.map((row) => (
          <CollapseRow onFileClick={onFileClick} data={row} />
        ))}
      </div>
    );
  }
}

export default TypeRow;
