import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import 'jspdf-autotable';
import Crypto from '@/utils/Crypto';
import { deduplicate, roundNumber } from '@/utils/utils';
import JsPDF from './plugins/jspdf';

const getCreatedDate = date => {
  const d = new Date(date);
  return moment(d).format('MMM DD, YYYY');
  // return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const getFileName = () => {
  const d = new Date();
  return `Report-${d.getMonth() +
    1}${d.getDate()}${d.getFullYear()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
};

const getType = bill => {
  let type = 'Customer Product';
  if (bill.category !== 'customer-product') {
    type = bill.mileage ? bill.mileage.type : bill.type.type;
  }
  return type;
};

const getExpenseSummaryData = (report, currency) => {
  const data = [];
  const { bills } = report;
  const listType = bills.map(bill => {
    const { type: { type = '' } = {} } = bill;
    return type;
  });
  deduplicate(listType)
    .filter(item => item !== '')
    .forEach(item => {
      let amount = 0;
      let billOfType = [];
      billOfType = bills.filter(i => {
        const { type: { type = '' } = {} } = i;
        return type === item;
      });
      billOfType.forEach(i => {
        amount += i.amount;
      });
      data.push([item, billOfType.length, `${roundNumber(amount, 2)} ${currency}`]);
    });
  return data;
};

const getProjectSummaryData = (report, currency) => {
  const data = [];
  let totalAmount = 0;
  const { bills } = report;
  const listProject = bills.map(bill => {
    const { project = {} } = bill || {};
    const { name = '' } = project || {};
    return name;
  });
  deduplicate(listProject)
    .filter(item => item !== '')
    .forEach(item => {
      let amount = 0;
      let billOfProject = [];
      billOfProject = bills.filter(i => {
        const { project = {}, billable = false } = i;
        const { name = '' } = project || {};
        return name === item && billable === true;
      });
      billOfProject.forEach(i => {
        amount += i.amount;
        totalAmount += i.amount;
      });
      if (billOfProject.length > 0) {
        data.push([item, billOfProject.length, `${roundNumber(amount, 2)} ${currency}`]);
      }
      totalAmount = roundNumber(totalAmount, 2);
    });
  return { data, totalAmount };
};

const getSpecificData = (report, currency, reimbursable) => {
  const reimbursableStatus = reimbursable === 'reimbursable';
  const data = [];
  const { bills } = report;
  bills
    .filter(bill => bill.reimbursable === reimbursableStatus)
    .forEach(bill => {
      const { project = {}, paymentOption = '' } = bill || {};
      const { name: projectName = '' } = project || {};
      data.push([
        getCreatedDate(bill.date),
        getType(bill),
        projectName,
        paymentOption,
        {
          content: `${roundNumber(bill.originAmount, 2)} ${bill.originCurrency}`,
          colSpan: 1,
          rowSpan: 1,
          // styles: { halign: 'left', fontStyle: 'bold' },
        },
        {
          content: `${roundNumber(bill.amount, 2)} ${currency}`,
          colSpan: 1,
          rowSpan: 1,
          styles: { halign: 'left', fontStyle: 'bold' },
        },
      ]);
    });
  if (data.length === 0) {
    data.push([
      {
        content: formatMessage({ id: 'pdf.expense.empty' }),
        colSpan: 6,
        rowSpan: 1,
        styles: { halign: 'center' },
      },
    ]);
  }
  return data;
};

const getSpecificDataWithLink = (report, currency, reimbursable) => {
  const reimbursableStatus = reimbursable === 'reimbursable';
  const data = [];
  const { bills } = report;
  bills
    .filter(bill => bill.reimbursable === reimbursableStatus)
    .forEach(bill => {
      const { project = {}, paymentOption = '' } = bill;
      const { name: projectName = '' } = project || {};
      data.push([
        getCreatedDate(bill.date),
        getType(bill),
        projectName,
        paymentOption,
        {
          content: `${roundNumber(bill.originAmount, 2)} ${bill.originCurrency}`,
          colSpan: 1,
          rowSpan: 1,
          // styles: { halign: 'left', fontStyle: 'bold' },
        },
        {
          content: `${roundNumber(bill.amount, 2)} ${currency}`,
          colSpan: 1,
          rowSpan: 1,
          // styles: { halign: 'left', fontStyle: 'bold' },
        },
      ]);
      data.push([
        {
          content: `${formatMessage({ id: 'pdf.images' })}:`,
          colSpan: 1,
          rowSpan: 1,
          styles: { halign: 'left', fontStyle: 'bold', fillColor: 'white' },
        },
        {
          content: `${
            bill.images && bill.images.length === 0 ? `${formatMessage({ id: 'pdf.none' })}` : ''
          }`,
          colSpan: 5,
          rowSpan: 1,
          styles: { halign: 'left', fontStyle: 'normal', fillColor: 'white' },
        },
      ]);
      if (bill.images && bill.images.length > 0) {
        bill.images.forEach(image => {
          data.push([
            {
              content: image,
              colSpan: 6,
              rowSpan: 1,
              styles: { halign: 'left', fontStyle: 'normal', fillColor: 'white' },
            },
          ]);
        });
      }
    });
  if (data.length === 0) {
    data.push([
      {
        content: formatMessage({ id: 'pdf.expense.empty' }),
        colSpan: 6,
        rowSpan: 1,
        styles: { halign: 'center' },
      },
    ]);
  }
  return data;
};

const processImage = url => {
  return new Promise(resolve => {
    if (url) {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = function loadImage() {
        const canvas = document.createElement('CANVAS');
        const ctx = canvas.getContext('2d');
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        resolve({
          format: url
            .substr(url.lastIndexOf('.') + 1, 4)
            .toUpperCase()
            .trim(),
          width: this.naturalWidth,
          height: this.naturalHeight,
          base64: canvas.toDataURL(),
        });
      };
      image.onerror = _e => {
        // eslint-disable-next-line no-console
        console.log(_e);
        return resolve();
      };
      image.src = url;
    } else resolve();
  });
};

const getLogo = async url => {
  return processImage(url);
};

const calcXOffset = (doc, text) => {
  const screenWidth = doc.internal.pageSize.width;
  const strWidth = doc.getTextWidth(text);
  const result = screenWidth - strWidth - 14;
  return result;
};

// page header
const getPageHeader = async (
  doc,
  fullName,
  logoImg,
  companyName,
  reimbursement,
  totalAmount,
  currency,
  status
) => {
  const {
    _id,
    createdAt = '',
    title = '',
    manager: { fullName: managerFullName = '' } = {},
    location: { name: locationName = '' } = {},
  } = reimbursement || {};

  // logo
  if (logoImg) {
    const { base64, width, height, format } = logoImg;
    doc.addImage(base64, format, 15, 8, (14 * width) / height, 14);
  }

  // title
  doc.setFontType('bold');
  doc.setFontSize(15);
  doc.text(85, 14, formatMessage({ id: 'pdf.title' }));
  doc.text(calcXOffset(doc, `${totalAmount} ${currency}`), 28, `${totalAmount} ${currency}`);

  // status
  doc.setFontType('normal');
  doc.setFontSize(12);
  doc.text(calcXOffset(doc, status), 20, status);

  doc.setFontSize(8);
  doc.setDrawColor(128, 128, 128);
  doc.line(15, 22, 196, 22);

  doc.text(15, 26, `${formatMessage({ id: 'pdf.report-id' })}: ${Crypto.encryptShort(_id)}`);
  doc.text(
    15,
    30,
    `${formatMessage({ id: 'pdf.title.report-date' })}: ${moment(createdAt).format('MMM DD, YYYY')}`
  );
  doc.text(15, 34, `${formatMessage({ id: 'pdf.title.title' })}: ${title}`);
  doc.text(
    calcXOffset(doc, `${formatMessage({ id: 'pdf.direct-manager' })}: ${managerFullName}`),
    34,
    `${formatMessage({ id: 'pdf.direct-manager' })}: ${managerFullName}`
  );

  doc.line(15, 36, 196, 36);

  doc.text(15, 40, `${formatMessage({ id: 'pdf.member' })}: ${fullName}`); // (text content, x position, font size)
  doc.text(
    calcXOffset(doc, `${formatMessage({ id: 'pdf.location' })}: ${locationName}`),
    40,
    `${formatMessage({ id: 'pdf.location' })}: ${locationName}`
  );

  doc.line(15, 42, 196, 42);
};

const drawTable = (doc, startY, headContent, content, tableWidth = undefined) => {
  doc.autoTable({
    styles: {
      fillColor: [230, 230, 230],
      textColor: 'black',
      fontSize: 8,
      lineColor: [255, 255, 255],
      lineWidth: 0.25,
    },
    headStyles: { fillColor: [230, 230, 230], textColor: 'black', fontSize: 8 },
    columnStyles: {
      4: { fontStyle: 'bold' },
    },
    startY,
    ...(tableWidth ? { tableWidth } : {}),
    head: headContent,
    body: content,
    theme: 'grid',
    showHead: 'firstPage',
    cellPadding: 0,
    didParseCell: data => {
      const {
        cell = {
          styles: {
            textColor: 'black',
            fontSize: 8,
            lineColor: [211, 211, 211],
            lineWidth: 0.25,
          },
        },
      } = data;
      cell.styles.cellPadding = 1;
    },
  });
};

const formatCompanyName = companyName => {
  const stringLength = companyName.length;
  if (stringLength > 128) return `${companyName.slice(0, 128)}...`;
  return companyName;
};

const exportPDF = async (currentSelectedList, logo = '', companyName = '') => {
  const doc = new JsPDF();
  const headContentSubTable = [
    [
      formatMessage({ id: 'pdf.date' }),
      formatMessage({ id: 'pdf.type' }),
      formatMessage({ id: 'pdf.project' }),
      formatMessage({ id: 'pdf.payment-method' }),
      formatMessage({ id: 'pdf.origin-amount' }),
      formatMessage({ id: 'pdf.amount' }),
    ],
  ];
  let logoImg;
  try {
    logoImg = await getLogo(logo);
  } catch (e) {
    // eslint-disable-next-line no-console
  }
  const formattedCompanyName = formatCompanyName(companyName);

  // pdf content
  currentSelectedList.forEach((reimbursement, index) => {
    // calculate amount
    const {
      bills,
      user: reportCreator = {},
      currency: backupCurrency = '',
      status = '',
    } = reimbursement;
    const { fullName, location: { currency = '' } = {} } = reportCreator;
    let dueCompany = 0;
    let dueEmployee = 0;
    const expenseSummaryData = getExpenseSummaryData(reimbursement, currency || backupCurrency);
    const projectSummaryData = getProjectSummaryData(reimbursement, currency || backupCurrency);

    bills.forEach(bill => {
      if (bill.reimbursable) {
        dueCompany += Number(bill.amount);
      } else {
        dueEmployee += Number(bill.amount);
      }
    });

    dueCompany = roundNumber(dueCompany, 2);
    dueEmployee = roundNumber(dueEmployee, 2);
    const totalAmount = dueCompany + dueEmployee;

    if (index > 0) {
      doc.addPage();
    }

    getPageHeader(
      doc,
      fullName,
      logoImg,
      formattedCompanyName,
      reimbursement,
      totalAmount,
      currency || backupCurrency,
      status
    );

    doc.setFontType('bold');
    doc.setFontSize(12);

    // expense summary table
    doc.text(15, 48, `${formatMessage({ id: 'pdf.expense-summary' })}`);
    drawTable(
      doc,
      50,
      [
        [
          formatMessage({ id: 'pdf.type' }),
          `#${formatMessage({ id: 'pdf.expenses' })}`,
          formatMessage({ id: 'pdf.total' }),
        ],
      ],
      expenseSummaryData,
      100
    );

    // project summary table
    if (projectSummaryData.data.length > 0) {
      doc.text(
        15,
        doc.previousAutoTable.finalY + 7,
        `${formatMessage({ id: 'pdf.project-summary' })}`
      );
      drawTable(
        doc,
        doc.previousAutoTable.finalY + 9,
        [
          [
            formatMessage({ id: 'pdf.project-name' }),
            `#${formatMessage({ id: 'pdf.expenses' })}`,
            formatMessage({ id: 'pdf.total' }),
          ],
        ],
        projectSummaryData.data,
        100
      );
    }

    doc.text(15, doc.previousAutoTable.finalY + 7, `${formatMessage({ id: 'pdf.all-expense' })}`);
    doc.setFontType('bold');
    doc.setFontSize(9);

    // reimbursable table
    doc.text(15, doc.previousAutoTable.finalY + 12, `${formatMessage({ id: 'pdf.reimbursable' })}`);
    drawTable(
      doc,
      doc.previousAutoTable.finalY + 14,
      headContentSubTable,
      getSpecificData(reimbursement, currency || backupCurrency, 'reimbursable')
    );

    // non-reimbursable table
    doc.text(
      15,
      doc.previousAutoTable.finalY + 7,
      `${formatMessage({ id: 'pdf.non-reimbursable' })}`
    );
    drawTable(
      doc,
      doc.previousAutoTable.finalY + 9,
      headContentSubTable,
      getSpecificData(reimbursement, currency || backupCurrency, 'non-reimbursable')
    );

    let temp = doc.previousAutoTable.finalY + 5;

    if (temp > 226) {
      doc.addPage();
      temp = 10;
    }

    doc.setFontType('normal');
    doc.setFontSize(8);
    doc.text(40, temp, formatMessage({ id: 'pdf.commitment' }));

    // mini tables
    doc.autoTable({
      startY: temp + 5,
      tableWidth: 89,
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.25,
        textColor: 'black',
        fontSize: 8,
        overflow: 'hidden',
      },
      columnStyles: {
        0: { halign: 'center', minCellHeight: 14, minCellWidth: 59 },
        1: { halign: 'center', minCellHeight: 14, minCellWidth: 30 },
      },
      body: [
        [formatMessage({ id: 'pdf.employee-signature' }), formatMessage({ id: 'common.date' })],
        [
          formatMessage({ id: 'pdf.authorization-signature' }),
          formatMessage({ id: 'common.date' }),
        ],
        [
          formatMessage({ id: 'pdf.authorization-signature' }),
          formatMessage({ id: 'common.date' }),
        ],
      ],
      margin: { right: 107 },
    });

    doc.autoTable({
      startY: temp + 5,
      tableWidth: 89,
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.25,
        textColor: 'black',
        fontSize: 8,
        overflow: 'hidden',
      },
      columnStyles: {
        0: { halign: 'right', minCellWidth: 58, fontStyle: 'bold' },
        1: { halign: 'right', minCellWidth: 31 },
      },
      body: [
        [
          formatMessage({ id: 'pdf.billable-project' }),
          `${projectSummaryData.totalAmount} ${currency || backupCurrency}`,
        ],
        [formatMessage({ id: 'pdf.reimbursable' }), `${dueCompany} ${currency || backupCurrency}`],
        [
          formatMessage({ id: 'pdf.non-reimbursable' }),
          `${dueEmployee} ${currency || backupCurrency}`,
        ],
      ],
      margin: { left: 106 },
    });

    // page footer
    doc.line(15, 285, 196, 285);
    doc.text(
      calcXOffset(doc, `${formatMessage({ id: 'pdf.powered-by' })} Paxanimi`),
      288,
      `${formatMessage({ id: 'pdf.powered-by' })} Paxanimi`
    );

    doc.addPage();

    getPageHeader(
      doc,
      fullName,
      logoImg,
      formattedCompanyName,
      reimbursement,
      totalAmount,
      currency || backupCurrency,
      status
    );

    doc.setFontType('bold');
    doc.setFontSize(12);
    doc.text(15, 48, `${formatMessage({ id: 'pdf.expense-receipt-images' })}`);
    doc.setFontSize(9);
    doc.text(15, 53, `${formatMessage({ id: 'pdf.reimbursable' })}`);
    drawTable(
      doc,
      55,
      headContentSubTable,
      getSpecificDataWithLink(reimbursement, currency || backupCurrency, 'reimbursable')
    );

    doc.text(
      15,
      doc.previousAutoTable.finalY + 7,
      `${formatMessage({ id: 'pdf.non-reimbursable' })}`
    );
    drawTable(
      doc,
      doc.previousAutoTable.finalY + 9,
      headContentSubTable,
      getSpecificDataWithLink(reimbursement, currency || backupCurrency, 'non-reimbursable')
    );
  });

  // page count
  doc.setFontType('normal');
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 0; i < pageCount; i += 1) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      194,
      6,
      formatMessage(
        { id: 'pdf.page.count' },
        { pageNumber: doc.internal.getCurrentPageInfo().pageNumber, pageCount }
      )
    );
  }

  await doc.save(`${getFileName()}.pdf`);
};

export default exportPDF;
