export function getHistorySearch() {
  const history = localStorage.getItem('history');
  return history ? JSON.parse(history) : {};
}

export function setHistorySearch(history) {
  return localStorage.setItem('history', JSON.stringify(history));
}
