import React, { useState, PureComponent } from 'react';
import { Collapse, Row, Col, Menu, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import FileIcon from '../../../assets/pdf_icon.png';
import DownloadIcon from '../../../assets/download_icon.svg';
import DownArrowIcon from '../../../assets/downArrow.svg';
import UpArrowIcon from '../../../assets/upArrow.svg';
import styles from './index.less';

const { Panel } = Collapse;

const CollapseTest = (props) => {
  const { data, onFileClick } = props;
  const [row] = useState(data);
  const [open, setOpen] = useState(true);
  const preventCollapse = (event) => {
    event.stopPropagation();
  };

  const handleDownloadClick = (event) => {
    preventCollapse(event);
  };

  const handleMenuClick = (event) => {
    preventCollapse(event);
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
    <div className={styles.statusAndButtons}>
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

  const headerWithArrowIcon = (status, title) => (
    <div className={styles.headerWithArrowIcon}>
      <span>{title}</span>
      {status ? (
        <img src={UpArrowIcon} alt="up-arrow" />
      ) : (
        <img src={DownArrowIcon} alt="down-arrow" />
      )}
    </div>
  );

  const onChange = () => {
    setOpen(!open);
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
                <img src={FileIcon} alt="file" className={styles.fileIcon} />
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
          <CollapseTest onFileClick={onFileClick} data={row} />
        ))}
      </div>
    );
  }
}

export default TypeRow;
