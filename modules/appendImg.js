export function AppendImg(data) {
  const ImageContainer = document.querySelector(".ImageContainer");
  setTimeout(() => {
    ImageContainer.innerHTML = "";
    const svgCon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgCon.setAttribute("viewBox", "0 0 300 300");
    svgCon.setAttribute("class", "svgContainer");
    ImageContainer.appendChild(svgCon);
    if (data[0].media.length > 0) {
      data[0].media.forEach(e => {
        const svgimg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "image"
        );
        svgimg.setAttribute("class", "IMGclicked click");
        svgimg.setAttribute("href", `images/level-images/` + e.src + ``);
        svgCon.appendChild(svgimg);
      });
    } else {
      const svgimg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "image"
      );
      svgimg.setAttribute("class", "IMGclicked click");
      svgimg.setAttribute(
        "href",
        `images/level-images/` + data[0].media[0].src + ``
      );
      svgCon.appendChild(svgimg);
    }
  }, 500);
}
