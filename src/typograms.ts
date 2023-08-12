/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="dom" />

const line = (
  className: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): SVGLineElement => {
  const line = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line",
  );
  line.setAttribute("x1", `${x1}`);
  line.setAttribute("y1", `${y1}`);
  line.setAttribute("x2", `${x2}`);
  line.setAttribute("y2", `${y2}`);
  line.classList.add(className);
  return line;
};

const part = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): SVGLineElement => line("part", x1, y1, x2, y2);

const grid = (width: number, height: number): SVGGElement => {
  const result = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );

  for (let i = 0; i <= width * 30; i += 3) {
    result.append(line("grid", i, 0, i, 54 * height));
  }

  for (let i = 0; i <= height * 54; i += 3) {
    result.append(line("grid", 0, i, 30 * width, i));
  }

  return result;
};

type Asciis = [string, string, string, string, string, string, string, string];

const cross = (
  [top, right, bottom, left, topRight, bottomRight, bottomLeft, topLeft]: [
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
  ],
): SVGGElement => {
  const result = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );
  if (top) result.append(part(15, 0, 15, 27));
  if (right) result.append(part(15, 27, 30, 27));
  if (bottom) result.append(part(15, 27, 15, 54));
  if (left) result.append(part(0, 27, 15, 27));
  if (topRight) result.append(part(30, 0, 15, 27));
  if (bottomRight) result.append(part(15, 27, 30, 54));
  if (bottomLeft) result.append(part(15, 27, 0, 54));
  if (topLeft) result.append(part(0, 0, 15, 27));

  return result;
};

const glyphs = new Map<string, (asciis: Asciis) => SVGGElement>([
  ["|", (
    [, right, , left, topRight, bottomRight, bottomLeft, topLeft]: Asciis,
  ): SVGGElement => {
    const result = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    if (right == "_") result.append(part(18, 51, 30, 51));
    if (left == "_") result.append(part(0, 51, 12, 51));
    if (topRight == "_") result.append(part(12, -3, 30, -3));
    if (topLeft == "_") result.append(part(0, -3, 18, -3));
    // const leg =  && ;
    // const head =  && ;
    //console.log(!(bottomLeft == "/" && bottomRight == "\\"));
    //console.log(!(topRight == "/" && topLeft == "\\"));
    result.appendChild(cross([
      !(topRight == "/" && topLeft == "\\"), // top
      ["-"].includes(right), // right
      !(bottomLeft == "/" && bottomRight == "\\"), // bottom
      ["-"].includes(left), // left
      topRight == "/", // topRight
      bottomRight == "\\", // bottomRight
      bottomLeft == "/", // bottomLeft
      topLeft == "\\", // topLeft
    ]));
    return result;
  }],
  ["-", (
    [top, , bottom]: Asciis,
  ) =>
    cross([
      ["|"].includes(top), // top
      true, // right
      ["|"].includes(bottom), // bottom
      true, // left
      false, // topRight
      false, // bottomRight
      false, // bottomLeft
      false, // topLeft
    ])],
  ["~", (_: Asciis): SVGGElement => {
    const result = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    result.append(part(9, 27, 24, 27));
    return result;
  }],
  [
    "_",
    (around: Asciis): SVGGElement => {
      const line = glyphs.get("-")!(around);
      line.setAttribute("transform", "translate(0 24)");
      return line;
    },
  ],
  [
    ":",
    (
      [top, , bottom]: Asciis,
    ): SVGGElement => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      const line = part(15, 0, 15, 60);
      line.style.strokeDasharray = "15";
      line.style.strokeDashoffset = "0";
      result.append(line);
      if (top == "+") result.append(part(15, -24, 15, -15));
      if (bottom == "+") result.append(part(15, 60, 15, 78));

      return result;
    },
  ],
  [
    "=",
    (): SVGGElement => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      result.append(part(0, 21, 30, 21), part(0, 30, 30, 30));
      return result;
    },
  ],
  [
    "*",
    (
      [top, right, bottom, left, topRight, bottomRight, bottomLeft, topLeft]:
        Asciis,
    ) => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", "0");
      circle.setAttribute("cy", "0");
      circle.setAttribute("r", "21");
      circle.setAttribute("stroke", "none");
      circle.setAttribute("transform", "translate(15, 27)");
      result.appendChild(circle);

      result.appendChild(cross([
        ["+", "|"].includes(top),
        ["+", "-"].includes(right),
        ["+", "|"].includes(bottom),
        ["+", "-"].includes(left),
        ["/"].includes(topRight),
        ["\\"].includes(bottomRight),
        ["/"].includes(bottomLeft),
        ["\\"].includes(topLeft),
      ]));

      return result;
    },
  ],
  [
    "o",
    (
      [top, right, bottom, left, topRight, bottomRight, bottomLeft, topLeft]:
        Asciis,
    ) => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", "0");
      circle.setAttribute("cy", "0");
      circle.setAttribute("r", "18");
      circle.setAttribute("stroke-width", "6");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", "black");
      circle.setAttribute("transform", "translate(15, 27)");
      result.appendChild(circle);

      const connectors = cross([
        ["+", "|"].includes(top),
        ["+", "-"].includes(right),
        ["+", "|"].includes(bottom),
        ["+", "-"].includes(left),
        ["/"].includes(topRight),
        ["\\"].includes(bottomRight),
        ["/"].includes(bottomLeft),
        ["\\"].includes(topLeft),
      ]);

      result.appendChild(connectors);

      const inner = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      inner.setAttribute("cx", "0");
      inner.setAttribute("cy", "0");
      inner.setAttribute("r", "15");
      inner.setAttribute("fill", "white");
      inner.setAttribute("opacity", "100%");
      inner.setAttribute("transform", "translate(15, 27)");
      result.appendChild(inner);

      return result;
    },
  ],
  [
    "/",
    (around: Asciis) => {
      const [
        top,
        right,
        bottom,
        left,
      ] = around;
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      result.appendChild(cross([
        ["|"].includes(top), // top
        false, // right
        ["|"].includes(bottom), // bottom
        false, // left
        true, // topRight
        false, // bottomRight
        true, // bottomLeft
        false, // topLeft
      ]));
      if (right == "\\") {
        const tip = cross([
          false,
          false,
          false,
          false,
          false,
          false,
          true, // bottomLeft
          false,
        ]);
        tip.setAttribute("transform", "translate(30 -54)");
        tip.setAttribute("clip-path", "polygon(-3 0, 0 0, 0 54, -3 54)");
        result.appendChild(tip);
      }
      if (left == "\\") {
        const tip = cross([
          false,
          false,
          false,
          false,
          true, // topRight
          false,
          false, // bottomLeft
          false,
        ]);
        tip.setAttribute("transform", "translate(-30 54)");
        tip.setAttribute("clip-path", "polygon(15 -6, 33 -6, 33 6, 15 6)");
        result.appendChild(tip);
      }

      if (right == "_") result.appendChild(glyphs.get("_")!(around));

      return result;
    },
  ],
  [
    "\\",
    (around: Asciis) => {
      const [
        top,
        right,
        bottom,
        left,
      ] = around;
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      result.appendChild(cross([
        ["|"].includes(top), // top
        false, // right
        ["|"].includes(bottom), // bottom
        false, // left
        false, // topRight
        true, // bottomRight
        false, // bottomLeft
        true, // topLeft
      ]));
      if (left == "/") {
        const tip = cross([
          false,
          false,
          false,
          false,
          false,
          true, // bottomRight
          false,
          false,
        ]);
        tip.setAttribute("transform", "translate(-30 -54)");
        tip.setAttribute("clip-path", "polygon(15 0, 30 0, 30 54, 15 54)");
        result.appendChild(tip);
      }
      if (right == "/") {
        const tip = cross([
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          true,
        ]);
        tip.setAttribute("transform", "translate(30 54)");
        tip.setAttribute("clip-path", "polygon(-3 0, 0 0, 0 6, -3 6)");
        result.appendChild(tip);
      }

      if (left == "_") result.appendChild(glyphs.get("_")!(around));

      return result;
    },
  ],
  [
    "#",
    (
      [top, right, bottom, left, topRight, bottomRight, bottomLeft, topLeft]:
        Asciis,
    ) => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      const points = [
        [0, 0],
        [42, 0],
        [42, 42],
        [0, 42],
      ];
      polygon.setAttribute(
        "points",
        points.map(([x, y]) => `${x},${y}`).join(" "),
      );
      polygon.setAttribute("transform", "translate(-6, 6)");
      result.appendChild(polygon);

      result.appendChild(cross([
        ["+", "|"].includes(top),
        ["+", "-"].includes(right),
        ["+", "|"].includes(bottom),
        ["+", "-"].includes(left),
        ["/"].includes(topRight),
        ["\\"].includes(bottomRight),
        ["/"].includes(bottomLeft),
        ["\\"].includes(topLeft),
      ]));

      return result;
    },
  ],
  [
    "+",
    (
      [top, right, bottom, left, topRight, bottomRight, bottomLeft, topLeft]:
        Asciis,
    ) => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      const r = ["*", "#", "-", "+", "~", ">", ".", "'", "`"].includes(right);
      const l = ["*", "#", "-", "+", "~", "<", ".", "'", "`"].includes(left);
      const t = ["*", "#", "|", "+", ".", "`", "^"].includes(top);
      const b = ["*", "#", "|", "+", "'", "`", "v"].includes(bottom);
      const tR = ["/", "*", "#"].includes(topRight);
      const bR = ["\\", "*", "#"].includes(bottomRight);
      const tL = ["\\", "*", "#"].includes(topLeft);
      const bL = ["/", "*", "#"].includes(bottomLeft);

      // cross
      result.appendChild(cross([
        t,
        r,
        b,
        l,
        tR,
        bR,
        bL,
        tL,
      ]));

      // center
      if ((l || r) && (b || t)) {
        const center = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon",
        );
        center.setAttribute("points", "0,0 6,0 6,6 0,6");
        center.setAttribute("transform", "translate(-3 -3) translate(15 27)");
        result.appendChild(center);
      }

      // tip
      if (tR || tL) {
        const center = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          false, // topRight
          tL, // bottomRight
          tR, // bottomLeft
          false, // topLeft
        ]);
        center.setAttribute("clip-path", "polygon(0 -3, 30 -3, 30 0, 0 0)");
        result.appendChild(center);
      }

      if (bR || bL) {
        const center = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          bL, // topRight
          false, // bottomRight
          false, // bottomLeft
          bR, // topLeft
        ]);
        center.setAttribute("clip-path", "polygon(0 27, 15 27, 15 30, 0 30)");
        result.appendChild(center);
      }

      if (bL || tL) {
        const center = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          bL && bR, // topRight
          tL && tR, // bottomRight
          false, // bottomLeft
          false, // topLeft
        ]);
        center.setAttribute("clip-path", "polygon(-3 0, 0 0, 0 54, -3 54)");
        result.appendChild(center);
      }

      if (bR || tR) {
        const center = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          false, // topRight
          false, // bottomRight
          tR && tL, // bottomLeft
          bR && bL, // topLeft
        ]);
        //console.log(center);
        center.setAttribute("clip-path", "polygon(15 0, 30 0, 30 54, 15 54)");
        result.appendChild(center);
      }

      if (r || l) {
        const center = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          r || bL, // topRight
          tL, // bottomRight
          tR, // bottomLeft
          l || bR, // topLeft
        ]);
        center.setAttribute("clip-path", "polygon(-3 24, 30 24, 30 30, -3 30)");
        result.appendChild(center);
      }
      return result;
    },
  ],
  [
    ".",
    (
      [top, right, bottom, left, topRight, bottomRight, bottomLeft, topLeft]:
        Asciis,
    ) => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );

      // top-right
      if (
        (right == "-" || right == "+") &&
        (bottom == "|" || bottom == "'" || bottom == "`" || bottom == "+")
      ) {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 30 24
        A 18 18, 0, 0, 0, 12 42
        L 12 54
        L 18 54
        L 18 42
        A 12 12, 0, 0, 1, 30 30
        Z`,
        );
        result.appendChild(path);
      }

      // top-left
      if (
        (left == "-" || left == "+") &&
        (bottom == "|" || bottom == "'" || bottom == "`" || bottom == "+")
      ) {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 0 24
        A 18 18, 0, 0, 1, 18 42
        L 18 54
        L 12 54
        L 12 42
        A 12 12, 0, 0, 0, 0 30        
        Z`,
        );
        result.appendChild(path);
      }

      // top-right
      if (
        (right == "-" || right == "+") &&
        (top == "|" || top == "." || top == "+")
      ) {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 30 30
        A 18 18, 0, 0, 1, 12 12
        L 12 0
        L 18 0
        L 18 12
        A 12 12, 0, 0, 0, 30 24
        Z`,
        );
        result.appendChild(path);
      }

      // bottom-left
      if (
        (left == "-" || left == "+") && (top == "|" || top == "." || top == "+")
      ) {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 0 30
        A 18 18, 0, 0, 0, 18 12
        L 18 0
        L 12 0
        L 12 12
        A 12 12, 0, 0, 1, 0 24
        Z`,
        );
        result.appendChild(path);
      }

      // bottom right-topRight
      if (right == "-" && topRight == "/") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 30 30
        A 12 12, 0, 0, 1, 18 18
        L 18 15
        L 24 15
        L 24 18
        A 6 6, 0, 0, 0, 30 24
        Z`,
        );
        result.appendChild(path);
        const line = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          true, // topRight
          false, // bottomRight
          false, // bottomLeft
          false, // topLeft
        ]);
        line.setAttribute(
          "clip-path",
          "polygon(15px -10px, 30px -10px, 30px 30px, 2px 15px)",
        );
        result.appendChild(line);
      }

      // right-topLeft
      if (right == "-" && topLeft == "\\") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M -3 0
        A 60 60, 0, 0, 0, 30 30
        L 30 24
        A 60 60, 0, 0, 1, 0 -6
        Z`,
        );
        result.appendChild(path);
      }

      // left-topRight
      if (left == "-" && topRight == "/") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 0 30
        A 60 60, 0, 0, 0, 33 0
        L 30 -6
        A 60 60, 0, 0, 1, 0 24
        Z`,
        );
        result.appendChild(path);
      }

      // bottom left-topLeft
      if (left == "-" && topLeft == "\\") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 0 30
        A 12 12, 0, 0, 0, 12 18
        L 12 15
        L 6 15
        L 6 18
        A 6 6, 0, 0, 1, 0 24
        Z`,
        );
        result.appendChild(path);
        const line = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          false, // topRight
          false, // bottomRight
          false, // bottomLeft
          true, // topLeft
        ]);
        line.setAttribute("clip-path", "polygon(-3 -3, 12 -3, 12 18, -3 18)");
        result.appendChild(line);
      }

      // bottom-topRight
      if (bottom == "|" && topRight == "/") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 12 54
        A 120 120, 0, 0, 1, 30 -6
        L 37 -6
        A 120 120, 0, 0, 0, 18 54
        Z`,
        );
        result.appendChild(path);
      }

      // top-bottomRight
      if (top == "|" && bottomRight == "\\") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 30 60
        A 120 120, 0, 0, 1, 12 0
        L 18 0
        A 120 120, 0, 0, 0, 37 60
        Z`,
        );
        result.appendChild(path);
      }

      // top-bottomLeft
      if (top == "|" && bottomLeft == "/") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 0 60
        A 120 120, 0, 0, 0, 18 0
        L 12 0
        A 120 120, 0, 0, 1, -7 60
        Z`,
        );
        result.appendChild(path);
      }

      // bottom-topLeft
      if (bottom == "|" && topLeft == "\\") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 12 54
        A 120 120, 0, 0, 0, -7 -6
        L 0 -6
        A 120 120, 0, 0, 1, 18 54
        Z`,
        );
        result.appendChild(path);
      }

      // right-bottomLeft
      if (right == "-" && bottomLeft == "/") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 0 48
        A 42 42, 0, 0, 1, 30 24
        L 30 30
        A 42 42, 0, 0, 0, 6 48
        Z`,
        );
        result.appendChild(path);
        const line = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          false, // topRight
          false, // bottomRight
          true, // bottomLeft
          false, // topLeft
        ]);
        line.setAttribute("clip-path", "polygon(-3 15, 12 15, 12 30, -3 30)");
        result.appendChild(line);
      }

      // left-bottomRight
      if (left == "-" && bottomRight == "\\") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 0 24
        A 42 42, 0, 0, 1, 30 48
        L 24 48
        A 42 42, 0, 0, 0, 0 30
        Z`,
        );

        result.appendChild(path);
        const line = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          false, // topRight
          true, // bottomRight
          false, // bottomLeft
          false, // topLeft
        ]);
        line.setAttribute("clip-path", "polygon(-3 15, 12 15, 21 30, -3 30)");
        result.appendChild(line);
      }

      // left-bottomLeft
      if (left == "-" && bottomLeft == "/") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 0 24
        A 12 12, 0, 0, 1, 12 39
        L 6 39
        A 6 6, 0, 0, 0, 0 30
        Z`,
        );
        result.appendChild(path);
        const line = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          false, // topRight
          false, // bottomRight
          true, // bottomLeft
          false, // topLeft
        ]);
        line.setAttribute("clip-path", "polygon(-3 6, 12 6, 12 30, -3 30)");
        result.appendChild(line);
      }

      // right-bottomRight
      if (right == "-" && bottomRight == "\\") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 30 24
        A 12 12, 0, 0, 0, 18 39
        L 24 39
        A 6 6, 0, 0, 1, 30 30 
        Z`,
        );
        result.appendChild(path);
        const line = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          false, // topRight
          true, // bottomRight
          false, // bottomLeft
          false, // topLeft
        ]);
        line.setAttribute("clip-path", "polygon(3 6, 18 6, 18 30, 3 30)");
        result.appendChild(line);
      }

      // bottomLeft-bottomRight
      if (bottomLeft == "/" && bottomRight == "\\") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 3 42
        A 15 15, 0, 0, 1, 27 42
        L 25 51
        A 9 9, 0, 0, 0, 5 51
        Z`,
        );
        result.appendChild(path);
        const line = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          false, // topRight
          true, // bottomRight
          true, // bottomLeft
          false, // topLeft
        ]);
        line.setAttribute("clip-path", "polygon(-3 15, 33 15, 33 30, -3 30)");
        result.appendChild(line);
      }

      // topLeft-topRight
      if (topLeft == "\\" && topRight == "/") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 3 12
        A 15 15, 0, 0, 0, 27 12
        L 22 9
        A 9 9, 0, 0, 1, 8 9
        Z`,
        );
        result.appendChild(path);
        const line = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          true, // topRight
          false, // bottomRight
          false, // bottomLeft
          true, // topLeft
        ]);
        line.setAttribute("clip-path", "polygon(-3 -3, 33 -3, 33 12, -3 12)");
        result.appendChild(line);
      }

      // topRight-bottomRight
      if (topRight == "/" && bottomRight == "\\") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 22 9
        A 30 30, 0, 0, 0, 22 45
        L 28 45
        A 30 30, 0, 0, 1, 28 9
        Z`,
        );
        result.appendChild(path);
        const line = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          true, // topRight
          true, // bottomRight
          false, // bottomLeft
          false, // topLeft
        ]);
        line.setAttribute("clip-path", "polygon(6 -3, 33 -3, 33 57, 6 57)");
        result.appendChild(line);
      }

      // topLeft-bottomLeft
      if (topLeft == "\\" && bottomLeft == "/") {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute(
          "d",
          `
        M 8 9
        A 30 30, 0, 0, 1, 8 45
        L 2 45
        A 30 30, 0, 0, 0, 2 9
        Z`,
        );
        result.appendChild(path);
        const line = cross([
          false, // top
          false, // right
          false, // bottom
          false, // left
          false, // topRight
          false, // bottomRight
          true, // bottomLeft
          true, // topLeft
        ]);
        line.setAttribute("clip-path", "polygon(-3 -3, 9 -3, 9 57, -3 57)");
        result.appendChild(line);
      }

      return result;
    },
  ],
  [
    ">",
    (
      [, right]: Asciis,
    ) => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      arrow.setAttribute("points", "0,0 42,18 0,36");
      let reach = 0;
      if (right == "*" || right == "o" || right == "#") reach -= 18;
      arrow.setAttribute("transform", `translate(${reach} 9)`);
      result.append(arrow);
      return result;
    },
  ],
  [
    "<",
    (
      [, , , left]: Asciis,
    ) => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      arrow.setAttribute("points", "0,0 42,18 0,36");
      let reach = 30;
      if (left == "*" || left == "o" || left == "#") {
        reach += 18;
      }
      arrow.setAttribute(
        "transform",
        `translate(${reach} 9) translate(0 36) rotate(180)`,
      );
      result.appendChild(arrow);
      return result;
    },
  ],
  [
    "v",
    (
      [top, , bottom, , topRight, , , topLeft]: Asciis,
    ) => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      arrow.setAttribute("points", "0,0 42,18 0,36");
      let reach = 36;
      if (bottom == " ") {
        reach = 12;
      } else if (bottom == "_") {
        reach += 18;
      } else if (bottom == "*" || bottom == "o" || bottom == "#") {
        reach -= 18;
      }
      if (topRight == "/") {
        arrow.setAttribute(
          "transform",
          `translate(-36 33) rotate(${90 + 22.5}, 42, 18)`,
        );
      } else if (topLeft == "\\") {
        arrow.setAttribute(
          "transform",
          `translate(-18 33) rotate(${90 - 22.5}, 42, 18)`,
        );
      } else {
        arrow.setAttribute("transform", `translate(33 ${reach}) rotate(90)`);
      }
      result.appendChild(arrow);
      result.appendChild(cross([
        ["|", "+"].includes(top), // top
        false, // right
        ["|", "+"].includes(top), // bottom
        false, // left
        ["/"].includes(topRight), // topRight
        false, // bottomRight
        false, // bottomLeft
        ["\\"].includes(topLeft), // topLeft
      ]));
      return result;
    },
  ],
  [
    "^",
    (
      [top, , bottom, , , bottomRight, bottomLeft]: Asciis,
    ) => {
      const result = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      arrow.setAttribute("points", "0,0 42,18 0,36");
      let reach = 42;
      if (top == "-") {
        reach -= 15;
      }
      if (bottomLeft == "/") {
        arrow.setAttribute(
          "transform",
          `translate(-18 -15) rotate(${-45 - 22.5}, 42, 18)`,
        );
      } else if (bottomRight == "\\") {
        arrow.setAttribute(
          "transform",
          `translate(-36 -15) rotate(${-90 - 22.5}, 42, 18)`,
        );
      } else {
        arrow.setAttribute("transform", `translate(-3 ${reach}) rotate(-90)`);
      }
      result.appendChild(arrow);
      result.appendChild(cross([
        false, // top
        false, // right
        ["+", "|"].includes(bottom), // bottom
        false, // left
        false, // topRight
        ["\\"].includes(bottomRight), // bottomRight
        ["/"].includes(bottomLeft), // bottomLeft
        false, // topLeft
      ]));
      return result;
    },
  ],
]);
glyphs.set("─", glyphs.get("-")!);
glyphs.set("┌", glyphs.get("+")!);
glyphs.set("┐", glyphs.get("+")!);
glyphs.set("└", glyphs.get("+")!);
glyphs.set("┘", glyphs.get("+")!);
glyphs.set("►", glyphs.get(">")!);
glyphs.set("'", glyphs.get(".")!);
glyphs.set("`", glyphs.get(".")!);
glyphs.set("V", glyphs.get("v")!);

const text = (char: string, reserved: boolean): SVGGElement => {
  const g = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );
  const result = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );
  //result.setAttribute("xml:space", "preserve");
  //result.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
  const value = document.createTextNode(char);
  result.append(value);
  if (reserved) result.classList.add("reserved");
  const translation = [
    [15, 24],
    //[1.5, 1.5 * ratio]
  ];
  result.setAttribute(
    "transform",
    translation.map(([x, y]) => `translate(${x}, ${y})`).join(" "),
  );
  g.append(result);
  return g;
};

const render = (diagram: string[][]): SVGGElement => {
  const result = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );

  for (let y = 0; y < diagram.length; y++) {
    for (let x = 0; x < diagram[y].length; x++) {
      const char = diagram[y][x];

      if (char == " " || char == '"') {
        continue;
      }

      let reserved = glyphs.get(char);

      const g = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );

      let str: boolean | RegExpMatchArray | null = false;
      for (let i = 0; i < x; i++) {
        if (diagram[y][i] == '"') {
          str = !str;
        }
      }

      const neighbors = around(diagram, [x, y]);

      if (char.match(/[A-Za-z0-9]/)) {
        const [, right, , left] = neighbors;
        // We special case "v", which is a down arrow, and also a text character.
        str = str ||
          (left.match(/[A-Za-uw-z0-9]/) || right.match(/[A-Za-uw-z0-9]/));
      }

      reserved = reserved && !str;

      if (reserved) g.appendChild(reserved(neighbors));

      g.appendChild(text(char, Boolean(reserved)));

      g.setAttribute("transform", `translate(${x * 30} ${y * 54})`);
      result.appendChild(g);
    }
  }
  return result;
};

export function create(source: string, zoom: number, debug: boolean) {
  const diagram = source
    .split("\n")
    .map((line) => [...line.trimEnd()]);

  diagram.shift();
  diagram.splice(-1);

  let width = 0;
  const height = diagram.length;

  for (let y = 0; y < diagram.length; y++) {
    for (let x = 0; x < diagram[y].length; x++) {
      if (diagram[y].length > width) {
        width = diagram[x].length;
      }
    }
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", `${width * 30 * zoom}`);
  svg.setAttribute("height", `${height * 54 * zoom}`);
  svg.setAttribute("debug", `${debug}`);
  const padding = 0;

  svg.setAttribute(
    "viewBox",
    `${-padding} ${-padding} ${width * 30 + 2 * padding} ${
      height * 54 + 2 * padding
    }`,
  );
  svg.classList.add("debug");

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `
.diagram {
  display: block;
}

.diagram line, .diagram circle, .diagram rect {
  stroke: black;
}

.diagram line {
  stroke-width: 2;
}

.diagram circle {
  r: 3.5;
}

.diagram rect {
  width: 6px;
  height: 6px;
}

.diagram text, .glyph, .debug text {
  /** font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; **/
  font-family: Iosevka Fixed, monospace;
  font-size: 3em;
  text-anchor: middle;
  alignment-baseline: central;
  white-space: pre;
}

.reserved {
  fill: transparent;
  white-space: pre;
}

.debug[debug="true"] .reserved {
  fill: black;
  opacity: 0.5;
}

.debug[debug="true"] line.grid {
  stroke: black;
  stroke-width: 0.2;
  stroke-linecap: butt;
  fill: black;
  opacity: 1%;
}

polygon {
  stroke-width: 0;
}

.debug[debug="true"] polygon.inner {
  fill: black;
  stroke: black;
  opacity: 5%;
}

polygon {
  stroke: black;
  /** stroke-width: 0.2; **/
  stroke-linecap: butt;
  fill: black;
}

.debug[debug="true"] polygon,
.debug[debug="true"] line.grid
{
  opacity: 10%;
}

.debug[debug="true"] polygon,
.debug[debug="true"] path,
.debug[debug="true"] circle
{
  opacity: 50%;
}

.debug[debug="true"] polygon {
  fill: red;
  stroke: red;
}

/**
circle {
  fill: black;
}
**/

.debug[debug="true"] circle,
.debug[debug="true"] path
{
  opacity: 50%;
  fill: red;
}

.debug[debug="true"] circle {
  stroke: red;
}

.debug[debug="true"] .inner {
  stroke-width: 0.2;
}

line.part {
  stroke-width: 6;
  stroke-linecap: butt;
  stroke: black;
}

.debug[debug="true"] line.part {
  opacity: 50%;
  stroke: red;
}

.debug[debug="true"] line.center {
  stroke-width: 3;
  stroke-linecap: butt;
  opacity: 10%;
  stroke: black;
}

text::selection {
    fill: black;
    background-color: #EEE;
}
  `;

  svg.append(style);

  svg.append(render(diagram));

  if (debug) svg.append(grid(width, height));

  return svg;
}

const around = (diagram: string[][], [x, y]: [number, number]): Asciis => {
  let left = " ";
  let top = " ";
  let right = " ";
  let bottom = " ";
  let topRight = " ";
  let bottomRight = " ";
  let bottomLeft = " ";
  let topLeft = " ";
  if (y > 0) {
    top = diagram[y - 1][x] || " ";
  }
  if (x < (diagram[y].length - 1)) {
    right = diagram[y][x + 1] || " ";
  }
  if (y < (diagram.length - 1)) {
    bottom = diagram[y + 1][x] || " ";
  }
  if (x > 0) {
    left = diagram[y][x - 1] || " ";
  }
  if (y > 0 && x < (diagram[y - 1].length - 1)) {
    // console.log(`@${diagram[y][x]}: ${diagram[y - 1][x + 1]}`);
    topRight = diagram[y - 1][x + 1] || " ";
  }
  //if (diagram[y][x] == ".") {
  //console.log(`${diagram[y][x]}}: ${(y + 1) < (diagram.length)}`);
  //console.log(diagram[y + 1]);
  //throw new Error("hi");
  //}
  if ((y + 1) < diagram.length && (x < diagram[y + 1].length)) {
    bottomRight = diagram[y + 1][x + 1] || " ";
    //console.log(diagram[y + 1]);
    //console.log(`${diagram[y][x]}: ${x} ${y} ${bottomRight}`);
    //throw new Error("hi");
  }
  if (y < (diagram.length - 1) && x > 0) {
    bottomLeft = diagram[y + 1][x - 1] || " ";
  }
  if (y > 0 && x > 0) {
    topLeft = diagram[y - 1][x - 1] || " ";
  }
  return [top, right, bottom, left, topRight, bottomRight, bottomLeft, topLeft];
  //.map((el) => alias[el] ? alias[el] : el);
};
