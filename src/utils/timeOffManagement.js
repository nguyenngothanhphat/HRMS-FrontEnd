import moment from 'moment';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { TIMEOFF_NAME_BY_ID } from '@/constants/timeOffManagement';
import { exportArrayDataToCsv } from '@/utils/exportToCsv';

const processCSVData = (array = []) => {
  if (array.length > 0) {
    let capsPopulations = [];
    capsPopulations = array.map((item, key) => {
      return {
        'S.No': key + 1,
        'Ticket ID': item.ticketID || '-',
        'Employee ID': item.employee?.generalInfoInfo?.employeeId || '-',
        'User ID': item.employee?.generalInfoInfo?.userId || '-',
        'First Name': item.employee?.generalInfoInfo?.firstName || '-',
        'Middle Name': item.employee?.generalInfoInfo?.middleName || '-',
        'Last Name': item.employee?.generalInfoInfo?.lastName || '-',
        'From Date': item.fromDate ? moment(item.fromDate).format(DATE_FORMAT_MDY) : '-',
        'To Date': item.toDate ? moment(item.toDate).format(DATE_FORMAT_MDY) : '-',
        'Count/Q.ty': item.duration || '-',
        'Leave Type': item.type?.name || '-',
        Subject: item.subject || '-',
        Description: item.description || '-',
        Status: TIMEOFF_NAME_BY_ID.find((x) => x.value === item.status)?.label || '-',
        'Reporting Manager': item.approvalManager?.generalInfoInfo?.legalName || '-',
      };
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('__')}`.split('__');
      dataExport.push(value);
    });
    return dataExport;
  }
  return [];
};

export const exportCSV = (data) => {
  exportArrayDataToCsv(`Time-Off-Report-${moment().format('YYYY-MM-DD')}`, processCSVData(data));
};

export default {
  exportCSV,
};
