//01:03 pm
const convert12hto24h = (time) => {
  let [hour, minute] = time.split(" ");
  let [hourNum, minuteNum] = hour.split(":").map(Number);
  let period = minute.toLowerCase();
  if (period === "pm") {
    hourNum += 12;
  }
  return `${hourNum}:${minuteNum}`;
};
