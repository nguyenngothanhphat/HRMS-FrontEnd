import moment from 'moment';

const availableStatus = {
  AVAILABLE_NOW: 'Available Now',
  AVAILABLE_SOON: 'Available Soon',
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

export const projectDateFormat = (date) => {
  if (date) return moment(date).locale('en').format('MM/DD/YYYY');
  return '-';
};

export const checkUtilization = (projects) => {
  let sum = 0;
  projects.forEach((project) => {
    sum += project?.utilization || 0;
  });
  if (sum === 100) return false;
  return true;
};

export function formatData(rawData) {
  const dataList = [];
  rawData.forEach((obj) => {
    const { titleInfo, generalInfo, projects } = obj;
    const userName = generalInfo.workEmail.substring(0, generalInfo.workEmail.indexOf('@'));
    const employeeName = `${generalInfo.legalName} ${userName ? `(${userName})` : ''}`;
    
    const projectList = projects.filter(item => {
      const revisedEndDate = item?.revisedEndDate
      const endDate = item?.endDate
      if(revisedEndDate){
        if(moment(revisedEndDate).isAfter(moment())) return item
      } else if(moment(endDate).isAfter(moment())) return item
      return null
    })

    const newObj = {
      avatar: generalInfo.avatar,
      employeeSkills: generalInfo?.skills,
      employeeId: obj?._id,
      employeeName: handleLongText(employeeName.trim(), 25),
      availableStatus: availableStatus[obj?.availableStatus] || '',
      division: obj?.departmentInfo?.name,
      designation: titleInfo?.name,
      experience: generalInfo?.totalExp,
      comment: obj?.commentResource,
      projects: projectList,
      utilization: projectList,
      billStatus: projectList,
      startDate: projectList,
      endDate: projectList,
      revisedEndDate: projectList,
      resourceId: 0,
    };
    dataList.push(newObj);
  });

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

export const setSelectedLocations = (data) => {
  localStorage.setItem('resourceSelectedLocations',JSON.stringify(data))
}

export const getSelectedLocations = () => {
  return JSON.parse(localStorage.getItem('resourceSelectedLocations'))
}

export const setSelectedDivisions = (data) => {
  localStorage.setItem('resourceSelectedDivision',JSON.stringify(data))
}

export const getSelectedDivisions = () => {
  return JSON.parse(localStorage.getItem('resourceSelectedDivision'))
}
