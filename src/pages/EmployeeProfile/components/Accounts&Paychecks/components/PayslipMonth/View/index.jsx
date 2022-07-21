import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import GoBackButton from '@/assets/goBack_icon.svg';
import styles from './index.less';

class ViewFile extends PureComponent {
  render() {
    const { url, onBackClick } = this.props;

    return (
      <div className={styles.ViewFile}>
        <div onClick={onBackClick} className={styles.goBackButton}>
          <img src={GoBackButton} alt="back" />
          <span>
            {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.goBack' })}
          </span>
        </div>
        <div>
          <iframe width="100%" height="500" src={url} title="pdf" />
        </div>
      </div>
    );
  }
}

export default ViewFile;
