import React, { PureComponent } from 'react';
import iconImage from '@/assets/group-14-copy.svg';

class ConfirmIconData extends PureComponent {
  setIcon = (data) => {
    if (data) {
      if (data.includes('jpg') || data.includes('png') || data.includes('jpeg')) {
        return <img src={iconImage} alt="iconFilePDF" />;
      }
      return '';
    }
    return '';
  };

  render() {
    const { data = [] } = this.props;
    return <>{this.setIcon(data)}</>;
  }
}

ConfirmIconData.propTypes = {};

export default ConfirmIconData;
