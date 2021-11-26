import React, { PureComponent } from "react";

import styles from './index.less'

class CapitalNameIcon extends PureComponent {
    render() {
        const {text} = this.props;
        const firstChar = text.charAt(0)
        return (<div className={styles.profileImage}><span className={styles.display}>{firstChar}</span></div>)
    }
}
export default CapitalNameIcon