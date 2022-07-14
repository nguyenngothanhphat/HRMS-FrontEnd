const url = window.location.href;

export const IS_TERRALOGIC_LOGIN =
  url.includes('terralogic.paxanimi.ai') || 
  url.includes('https://stghrms.paxanimi.ai');
export const IS_TERRALOGIC_CANDIDATE_LOGIN =
  url.includes('terralogic.paxanimi.ai/candidate') ||
  url.includes('https://stghrms.paxanimi.ai/candidate');
