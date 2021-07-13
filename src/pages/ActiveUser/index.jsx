import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { LoadingOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import styles from './index.less';

@connect(({ loading }) => ({
  loadingActivateUser: loading.effects['signup/activeAdmin'],
}))
class ActiveUser extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isActivated: false,
    };
  }

  componentDidMount = async () => {
    const {
      dispatch,
      match: { params: { id = '' } = {} },
    } = this.props;

    const res = await dispatch({
      type: 'signup/activeAdmin',
      payload: {
        id,
      },
    });
    const { statusCode = 0, data: { result = '' } = {} } = res;
    if (statusCode === 200 && result === true) {
      this.setState({
        isActivated: true,
      });
    }
  };

  renderMain = () => {
    const { loadingActivateUser = false } = this.props;
    const { isActivated } = this.state;
    return (
      <>
        {loadingActivateUser ? (
          <div className={styles.ActiveUser}>
            <div className={styles.loadingText}>
              <LoadingOutlined className={styles.loadingIcon} />
              <span className={styles.activatingText}>Activating your account...</span>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.ActiveUser}>
              {isActivated ? (
                <div className={styles.loadingText}>
                  <CheckCircleOutlined className={styles.loadingIcon} />
                  <span className={styles.activatingText}>
                    Your account was activated. Please check your email for your sign in
                    information.
                  </span>
                </div>
              ) : (
                <div className={styles.loadingText}>
                  <InfoCircleOutlined className={styles.loadingIcon} />
                  <span className={styles.activatedText}>
                    This link is expired or your account is activated. Please refresh this page or
                    check your email for your sign in information.
                  </span>
                </div>
              )}
              <Button
                onClick={() => {
                  history.push('/login');
                }}
              >
                LOGIN
              </Button>
            </div>
          </>
        )}
      </>
    );
  };

  render() {
    return this.renderMain();
  }
}
export default ActiveUser;
