export function GetJsonData(index, part) {
  let Array = [];
  fetch("data/data.json")
    .then(res => res.json())
    .then(data => {
      if (part == null) {
        Array.push(data[index]);
      } else if (index == null) {
        Array.push(data);
      } else {
        Array.push(data[index].parts[part]);
      }
    });
  return Array;
}
