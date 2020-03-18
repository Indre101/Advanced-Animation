export function GetJsonData() {
  fetch("../static/data.json")
    .then(res => res.json())
    .then(data => {
      console.log(data);
      return data;
    });
}
