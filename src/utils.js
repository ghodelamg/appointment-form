export const unixToTime = (string) => {
    const unix_timestamp = string;
    const date = new Date(unix_timestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const newText =
      // hours;
      hours + "." + minutes.substr(-2);
    return newText
  };