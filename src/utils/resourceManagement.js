import moment from 'moment';

const parseDate = (dateText) => {
  if (!dateText) {
    return '-';
  }
  return moment(dateText).format('MM/DD/YYYY');
};
const handleLongText = (text, length) => {
  if (!text) {
    return '';
  }
  if (text.length < length) {
    return text;
  }

  const formatText = text.substring(0, length);
  return `${formatText}...${formatText.includes('(') ? ')' : ''}`;
};

const cloneObj = (obj) => {
  const newObj = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = value;
  }
  return newObj;
};

// obj = {
//   employeeId: 15,
//   employeeName: `employee 15`,
//   division: 'division',
//   designation: 'designation',
//   experience: (Math.random(i) * i).toFixed(1),
//   projectName: '',
//   availableStatus: 'Available Soon',
//   comment: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint nt. ullamco est sit aliqua dolor do amet sint. Amet minim mollit non deserunt ullamcoullamco est sit aliqua dolor do amet sint. Amet minim mollit non deserunt ullamcoullamco est sit aliqua dolor do amet sint...Read More',
//   utilization: 0,
//   startDate: '',
//   endDate: '',
// };
// eslint-disable-next-line import/prefer-default-export
export function formatData(rawData, projectList) {
  const dataList = [];
  rawData.forEach((obj) => {
    const { titleInfo, generalInfo, projects } = obj;
    const availableStatus = 'Available Now';
    const userName = generalInfo.workEmail.substring(0, generalInfo.workEmail.indexOf('@'));
    const employeeName = `${generalInfo.legalName} ${userName ? `(${userName})` : ''}`;
    const newObj = {
      avatar: generalInfo.avatar,
      employeeId: obj?._id,
      employeeName: handleLongText(employeeName.trim(), 25),
      availableStatus,
      division: obj?.tagDivision,
      designation: titleInfo?.name,
      experience: generalInfo?.totalExp,
      comment: obj?.commentResource,
      projectName: '',
      utilization: 0,
      billStatus: '-',
      startDate: '-',
      endDate: '-',
      resourceId: 0,
    };
    let ability = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const p of projects) {
      ability += p.utilization;
    }
    newObj.availableStatus = ability < 100 ? 'Available Now' : 'Available Soon';
    if (projects.length === 0) {
      dataList.push(newObj);
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const p of projects) {
        const project = projectList.find((x) => x.id === p?.project?.id);
        const pObj = cloneObj(newObj);
        pObj.projectName = project?.projectName;
        pObj.projectId = p?.projectId;
        pObj.startDate = parseDate(p?.startDate);
        pObj.endDate = parseDate(p?.endDate);
        pObj.billStatus = p?.status || '-';
        pObj.project = project?.id;
        pObj.utilization = p?.utilization || 0;
        pObj.revisedEndDate = parseDate(p?.revisedEndDate);
        pObj.resourceId = p?.id;
        dataList.push(pObj);
      }
    }
  });
  // console.log(`formatDataSource: ${JSON.stringify(dataList)}`);
  return dataList;
}

export function getProjectById(projectList, id) {
  if (!projectList || projectList.length === 0) {
    return {};
  }

  return projectList.find((x) => x.id === id);
}

export function handlingResourceAvailableStatus(data) {
  const statusData = [
    { availableStatus: 'ALL', compareKey: 'totalResource', display: 'All Resources', number: 10 },
    {
      availableStatus: 'AVAILABLE_NOW',
      compareKey: 'totalAvailableNow',
      display: 'Available now',
      number: 10,
    },
    {
      availableStatus: 'AVAILABLE_SOON',
      compareKey: 'totalAvailableSoon',
      display: 'Available soon',
      number: 10,
    },
  ];
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(data)) {
    const obj = statusData.find((x) => x.compareKey === key);
    obj.number = value;
  }
  return statusData;
}
