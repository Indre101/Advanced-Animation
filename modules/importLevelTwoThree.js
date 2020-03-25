export async function GetJsonDataLevelTwoThree(index, part) {
  console.log("called ");
  const response = await fetch("data/LvltwoThree.json");
  const json = await response.json();
  console.log(json);
  if (part == null) {
    return [json[index]];
  } else if (index == null) {
    return [parts[part]];
  } else {
    return [json[index].parts[part]];
  }
}
