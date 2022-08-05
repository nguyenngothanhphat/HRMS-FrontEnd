export const getEmployeeName = (generalInfo = {}) => {
  const { legalName = '', firstName = '', lastName = '', middleName = '' } = generalInfo;
  let name = legalName;

  if (!name && firstName) {
    name = `${firstName} ${lastName}`;
    if (middleName) {
      name = `${firstName} ${middleName} ${lastName}`;
    }
  }
  return name;
};

export const onJoinMeeting = (url) => {
  window.open(url, '_blank');
};
