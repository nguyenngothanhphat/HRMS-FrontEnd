import React, { PureComponent } from 'react';
import iconPDF from '@/assets/pdf-2.svg';
import iconImage from '@/assets/group-14-copy.svg';

class ConformIcondata extends PureComponent {
  setIcon = (data) => {
    if (data) {
      if (data.includes('jpg') || data.includes('png')) {
        return <img src={iconImage} alt="iconFilePDF" />;
      }
      return <img src={iconPDF} alt="iconFilePDF" />;
    }
    return <img src={iconPDF} alt="iconFilePDF" />;
  };

  render() {
    const { data = [] } = this.props;
    return (
      <>
        {/* {data.includes('jpg') || data.includes('png') ? (
          <img src={iconImage} alt="iconFilePDF" />
        ) : (
          <img src={iconPDF} alt="iconFilePDF" />
        )} */}
        {this.setIcon(data)}
      </>
    );
  }
}

ConformIcondata.propTypes = {};

export default ConformIcondata;
