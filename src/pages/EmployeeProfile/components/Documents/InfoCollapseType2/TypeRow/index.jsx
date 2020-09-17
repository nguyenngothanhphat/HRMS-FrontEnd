import React, { PureComponent } from 'react';
import { Collapse, Row, Col, Menu, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import FileIcon from '../../../../../../assets/pdf_icon.png';
import DownloadIcon from '../../../../../../assets/download_icon.svg';
import DownArrowIcon from '../../../../../../assets/downArrow.svg';
import UpArrowIcon from '../../../../../../assets/upArrow.svg';
import styles from './index.less';

const { Panel } = Collapse;
class TypeRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  preventCollapse = (event) => {
    event.stopPropagation();
  };

  handleDownloadClick = (event) => {
    this.preventCollapse(event);
  };

  handleMenuClick = (event) => {
    this.preventCollapse(event);
  };

  menu = () => (
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

  statusAndButtons = () => (
    <div className={styles.statusAndButtons}>
      <a>Complete</a>
      <img
        alt="download"
        src={DownloadIcon}
        className={styles.downloadButton}
        onClick={this.handleDownloadClick}
      />
      <Dropdown overlay={this.menu}>
        <EllipsisOutlined onClick={this.handleMenuClick} className={styles.menuButton} />
      </Dropdown>
    </div>
  );

  headerWithArrowIcon = (open, title) => (
    <div className={styles.headerWithArrowIcon}>
      <span>{title}</span>
      {open ? (
        <img src={UpArrowIcon} alt="up-arrow" />
      ) : (
        <img src={DownArrowIcon} alt="down-arrow" />
      )}
    </div>
  );

  // customArrowIcon = (isActive) =>
  //   isActive ? (
  //     <img src={UpArrowIcon} alt="up-arrow" />
  //   ) : (
  //     <img src={DownArrowIcon} alt="down-arrow" />
  //   );

  onChange = () => {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  };

  render() {
    const { data = [], onFileClick } = this.props;
    const { open } = this.state;
    return (
      <div>
        {data.map((row) => (
          <Collapse
            defaultActiveKey={['1']}
            onChange={this.onChange}
            bordered={false}
            // expandIcon={({ isActive }) => this.customArrowIcon(isActive)}
            // expandIconPosition="right"
            className={styles.eachCollapse}
          >
            <Panel
              className={styles.eachPanel}
              key="1"
              showArrow={false}
              header={this.headerWithArrowIcon(open, row.kind)}
              extra={this.statusAndButtons()}
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
        ))}
      </div>
    );
  }
}

export default TypeRow;
