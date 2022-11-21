//Store connected Users
var counters = {};

//Funtion to get users online in a room
function getCounters(arr) {
  onlineCounters = [];

  if (arr && arr.length) {
    arr.forEach((onlineCounter) => {
      onlineCounters.push(Object.values(onlineCounter)[0]);
    });
  }
  return onlineCounters;
}

module.exports = { getCounters, counters };
