import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';

import { connect } from 'umi';

import styles from './index.less';

class BottomBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillUpdate(newProp) {
    const { offerDetailField } = newProp;
    console.log(offerDetailField);
    const { currency } = offerDetailField;
    console.log(currency);
    if (currency === false) {
      console.log('Update');
    }
  }

  onClickNext = () => {
    const { onClickNext } = this.props;
    onClickNext();
  };

  _renderBottomButton = () => {
    const { currentPage } = this.props;
    if (currentPage === 1) {
      return (
        <Button
          type="primary"
          onClick={this.onClickNext}
          className={styles.bottomBar__button__primary}
        >
          Next
        </Button>
      );
    }
    if (currentPage === 4) {
      return (
        <Button
          type="primary"
          onClick={this.onClickNext}
          className={styles.bottomBar__button__primary}
        >
          Proceed
        </Button>
      );
    }
    return null;
  };

  render() {
    const { className } = this.props;
    const { offerDetailField } = this.props;
    // console.log(offerDetailField);
    // const { currency } = offerDetailField;

    return (
      <div className={`${styles.bottomBar} ${className}`}>
        <Row>
          <Col span={16}>
            <div className={styles.bottomBar__status}>
              {offerDetailField.currency === true
                ? '*All mandatory fields have been filled.'
                : `Currency field must be 'Dollar'`}
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>{this._renderBottomButton()}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

// export default BottomBar;
export default connect(({ info: { offerDetailField = {} } = {} }) => ({
  offerDetailField,
}))(BottomBar);
