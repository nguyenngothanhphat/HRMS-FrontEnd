import React, { PureComponent } from 'react';
import iconPDF from '@/assets/pdf-2.svg';
import iconImage from '@/assets/group-14-copy.svg';

class ConformIcondata extends PureComponent {
  render() {
    const { data = [] } = this.props;
    return (
      <>
        {data.includes('jpg') || data.includes('png') ? (
          <img src={iconImage} alt="iconFilePDF" />
        ) : (
          <img src={iconPDF} alt="iconFilePDF" />
        )}
      </>
    );
  }
}

ConformIcondata.propTypes = {};

export default ConformIcondata;
