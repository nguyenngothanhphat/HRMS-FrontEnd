import React, { PureComponent } from 'react';
import { Modal} from 'antd';
import styles from './index.less';
import listEditCommentButton from '@/assets/resourceManagement/list-edit-comment.svg';

class ViewCommentModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  openCommentView = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { dataRow } = this.props;
    const { visible } = this.state;
    return (
      <div className={styles.btnView}>
        <img src={listEditCommentButton} alt="historyIcon" onClick={this.openCommentView} />
        <Modal
          className={styles.modalAdd}
          title="View Comments"
          width="40%"
          visible={visible}
          onCancel={() => this.handleCancel()}
          footer={null}
        >
          <p>{dataRow.comment}</p>
        </Modal>
      </div>
    );
  }
}

export default ViewCommentModal;
