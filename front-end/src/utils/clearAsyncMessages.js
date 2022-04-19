export default (funcSuccess, funcError, funcProcessing, time = 5) => {
  if (funcProcessing) funcProcessing(false);

  setTimeout(() => {
    if (funcError) funcError(null);
    if (funcSuccess) funcSuccess(null);
  }, time * 1000);
};
