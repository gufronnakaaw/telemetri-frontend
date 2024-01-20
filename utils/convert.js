export function convertTime(time) {
  const dateInstance = new Date(time);
  const hours = dateInstance.getHours();
  const minutes = dateInstance.getMinutes();
  const seconds = dateInstance.getSeconds();

  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function convertDate(time) {
  const dateInstance = new Date(time);
  const date = dateInstance.getDate();
  const year = dateInstance.getFullYear();
  const month = dateInstance.getMonth() + 1;

  return `${date < 10 ? `0${date}` : date}/${
    month < 10 ? `0${month}` : month
  }/${year}`;
}
