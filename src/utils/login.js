const url = window.location.href;
const { pathname } = window.location;

export const IS_TERRALOGIC_LOGIN = true || url.includes('terralogic.paxanimi.com');
export const IS_TERRALOGIC_CANDIDATE_LOGIN =
  url.includes('terralogic.paxanimi.com/candidate') || pathname === '/candidate';
