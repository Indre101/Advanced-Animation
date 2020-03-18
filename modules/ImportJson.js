export function GetJsonData(index, part) {
  let Array = [];
  fetch("data/data.json")
    .then(res => res.json())
    .then(data => {
      Array.push(data[index].parts[part]);
    });
  return Array;
}
