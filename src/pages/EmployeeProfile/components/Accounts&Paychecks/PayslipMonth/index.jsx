import React, { PureComponent } from 'react';
import Icon from '@ant-design/icons';
import { connect } from 'umi';
import ViewFile from './View';
import DownloadIcon from './icon.js';
import styles from './index.less';

@connect(({ employeeProfile: { paySlip = [] } }) => ({
  paySlip,
}))
class PaySlipMonth extends PureComponent {
  constructor(props) {
    super(props);
    // const { selectedFile } = this.props;
    this.state = {
      url: '',
      isView: false,
      // currentViewingFile: selectedFile,
    };
  }

  // handleDownLoad = (item) => {
  // };

  handleViewFile = (urlFile) => {
    this.setState({ isView: true, url: urlFile });
  };

  onBackClick = () => {
    this.setState({
      isView: false,
    });
  };

  render() {
    const { paySlip } = this.props;
    const { isView, url } = this.state;
    return (
      <>
        {isView ? (
          <ViewFile url={url} onBackClick={this.onBackClick} />
        ) : (
          paySlip.map((item, index) => {
            return (
              <div key={`${item.key} ${index + 1}`} className={styles.PaySlipMonth}>
                <p className={styles.nameMonth}>{`${item.key}`}</p>
                <div className={styles.downLoad}>
                  <p
                    className={styles.downLoadText}
                    onClick={() => this.handleViewFile(item.attachment.url)}
                  >
                    View
                  </p>
                  {/* <a
                    href={item.attachment.url ? item.attachment.url : ''}
                    download="{item.attachment.name}"
                  > */}
                  <Icon
                    component={DownloadIcon}
                    className={styles.downLoadIcon}
                    // onClick={() => this.handleDownLoad(item)}
                  />
                  {/* </a> */}
                </div>
              </div>
            );
          })
        )}
      </>
    );
  }
}

export default PaySlipMonth;
