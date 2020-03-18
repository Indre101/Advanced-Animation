export let GetJsonData = index => {
  let dataValues = [];
  fetch("data/data.json")
    .then(res => res.json())
    .then(data => {
      dataValues.push(data[index]);
    });
  return dataValues;
};
