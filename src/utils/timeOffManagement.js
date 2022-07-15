import moment from 'moment';
import exportToCsv from '@/utils/exportToCsv';
import { TIMEOFF_STATUS } from './timeOff';

export const TIMEOFF_NAME_BY_ID = [
  { value: TIMEOFF_STATUS.ACCEPTED, label: 'Approved' },
  { value: TIMEOFF_STATUS.IN_PROGRESS, label: 'In Progress' },
  // { value: TIMEOFF_STATUS.IN_PROGRESS_NEXT, label: 'In Progress' },
  { value: TIMEOFF_STATUS.REJECTED, label: 'Rejected' },
  { value: TIMEOFF_STATUS.DRAFTS, label: 'Draft' },
  { value: TIMEOFF_STATUS.ON_HOLD, label: 'On-hold' },
  { value: TIMEOFF_STATUS.DELETED, label: 'Deleted' },
  { value: TIMEOFF_STATUS.WITHDRAWN, label: 'Withdrawn' },
];

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
        'From Date': item.fromDate ? moment(item.fromDate).format('MM/DD/YYYY') : '-',
        'To Date': item.toDate ? moment(item.toDate).format('MM/DD/YYYY') : '-',
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
      const value = `${keys.map((k) => obj[k]).join('_')}`.split('_');
      dataExport.push(value);
    });
    return dataExport;
  }
  return [];
};

export const exportCSV = (data) => {
  exportToCsv(`Time-Off-Report-${moment().format('YYYY-MM-DD')}.csv`, processCSVData(data));
};

export const dateFormat = 'MM/DD/YYYY';
