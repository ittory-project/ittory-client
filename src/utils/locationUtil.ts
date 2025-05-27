export const getHostUrl = () =>
  `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`;
