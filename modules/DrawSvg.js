export function DrawSvg() {
  if (document.querySelector("svg path.st0")) {
    const svgsPaths = document.querySelector("svg .st0");

    const length = pathItem.getTotalLength();
    pathItem.style.strokeDasharray = `${length}px`;
    pathItem.style.strokeDashoffset = `${length}px`;

    // svgsPaths.forEach(pathItem => {

    // });

    // path.style.setProperty("--length", length);
    // path.style.setProperty("--dash-array", length);
  } else {
    return false;
  }
}
