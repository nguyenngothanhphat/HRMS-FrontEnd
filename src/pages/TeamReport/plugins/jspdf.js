import jsPDF from 'jspdf';

const { API } = jsPDF;

// eslint-disable-next-line func-names
API.myText = function(txt, y, fontSize) {
  const pageWidth = this.internal.pageSize.width;
  const txtWidth = (this.getStringUnitWidth(txt) * fontSize) / this.internal.scaleFactor;
  this.text(txt, (pageWidth - txtWidth) / 2, y);
};

export default jsPDF;
