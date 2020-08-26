import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import FlagIcon from '@/components/FlagIcon';
import styles from './index.less';

@connect()
class Currency extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    if ('currency' in nextProps) {
      return { currency: nextProps.currency };
    }
    return null;
  }

  _isMounted = false;

  constructor(props) {
    super(props);
    const { currency } = props;
    this.state = {
      currency,
    };
  }

  componentDidMount() {
    const { dispatch, code } = this.props;
    this._isMounted = true;
    if (typeof code === 'string')
      dispatch({ type: 'currency/fetchItem', payload: code }).then(currency => {
        if (this._isMounted) {
          this.setState({ currency });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { className } = this.props;
    const { currency } = this.state;

    const { name: nameCurrency, symbol, emoji = '', nativeIcon } = currency || {};
    return (
      <div className={classNames(styles.center, className)}>
        {currency && (
          <FlagIcon native={nativeIcon} size={20}>
            {emoji}
          </FlagIcon>
        )}{' '}
        <span className={styles.name}>
          {nameCurrency} ({symbol})
        </span>
      </div>
    );
  }
}

export default Currency;
