export function setCurrentPage(page) {
  localStorage.setItem('currentTimeoffManagementPage', page);
}

export function getCurrentPage() {
  const current = localStorage.getItem('currentTimeoffManagementPage');
  if (current === 'undefined') return null;
  return +current;
}

export function removeCurrentPage() {
  localStorage.removeItem('currentTimeoffManagementPage');
}

export function setFilter(values) {
  localStorage.setItem('timeOffManagementState', JSON.stringify(values));
}

export function getFilter() {
  const current = localStorage.getItem('timeOffManagementState');
  if (current === 'undefined') return null;
  return JSON.parse(current);
}

export function removeFilter() {
  localStorage.removeItem('timeOffManagementState');
}
