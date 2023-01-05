function chunkify(position, chunk) {
  return position - position%chunk;
}

function lerp(A, B, t) {
  return A + (B - A) * t;
}

function getIntersection(A,B,C,D) {
  /*
  Ax + (Bx - Ax)t = Cx + (Dx - Cx)u
  Ay + (By - Ay)t = Cy + (Dy - Cy)u

  Ax - Cx + (Bx - Ax)t = (Dx - Cx)u
  Ay - Cy + (By - Ay)t = (Dy - Cy)u

  (Ax - Cx) + (Bx - Ax)t = (Dx - Cx)u
  (Dx-Cx)(Ay-Cy) + (Dx-Cx)(By-Ay)t = (Dy-Cy)(Dx-Cx)u

  (Dx-Cx)(Ay-Cy) + (Dx-Cx)(By-Ay)t = (Dy-Cy)(Ax - Cx) + (Dy-Cy)(Bx - Ax)t

  (Dx-Cx)(Ay-Cy) + (Dx-Cx)(By-Ay)t - (Dy-Cy)(Ax-Cx) = (Dy-Cy)(Bx-Ax)t

  (Dx-Cx)(Ay-Cy) - (Dy-Cy)(Ax-Cx) = (Dy-Cy)(Bx-Ax)t - (Dx-Cx)(By-Ay)t

  (Dx-Cx)(Ay-Cy) - (Dy-Cy)(Ax-Cx) = [(Dy-Cy)(Bx-Ax) - (Dx-Cx)(By-Ay)]t

  t = [(Dx-Cx)(Ay-Cy) - (Dy-Cy)(Ax-Cx)]/[(Dy-Cy)(Bx-Ax) - (Dx-Cx)(By-Ay)];

  tTop = (Dx-Cx)(Ay-Cy) - (Dy-Cy)(Ax-Cx);
  tBottom = (Dy-Cy)(Bx-Ax) - (Dx-Cx)(By-Ay);

  Ax + (Bx - Ax)t = Cx + (Dx - Cx)u
  Ay + (By - Ay)t = Cy + (Dy - Cy)u

  (Bx - Ax)t = (Cx - Ax)  + (Dx - Cx)u
  (By - Ay)(Bx - Ax)t = (Cy - Ay)(Bx - Ax) + (Dy - Cy)(Bx - Ax)u

  [(Cx - Ax)  + (Dx - Cx)u](By - Ay) = (Cy - Ay)(Bx - Ax) + (Dy - Cy)(Bx - Ax)u

  (Cx - Ax)(By - Ay) + (Dx - Cx)(By - Ay)u = (Cy - Ay)(Bx - Ax) + (Dy - Cy)(Bx - Ax)u

  (Dx - Cx)(By - Ay)u - (Dy - Cy)(Bx - Ax)u = (Cy - Ay)(Bx - Ax) - (Cx - Ax)(By - Ay)

  u [(Dx - Cx)(By - Ay) - (Dy - Cy)(Bx - Ax)] = (Cy - Ay)(Bx - Ax) - (Cx - Ax)(By - Ay)

  u =  [(Cy - Ay)(Bx - Ax) - (Cx - Ax)(By - Ay)]/ [(Dx - Cx)(By - Ay) - (Dy - Cy)(Bx - Ax)]

  uTop = (Cy - Ay)(Bx - Ax) - (Cx - Ax)(By - Ay)
  uBottom = (Dx - Cx)(By - Ay) - (Dy - Cy)(Bx - Ax)
  */

  tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  tBottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
  uTop = (C.y - A.y) * (B.x - A.x) - (C.x - A.x) * (B.y - A.y);
  uBottom = (D.x - C.x) * (B.y - A.y) - (D.y - C.y) * (B.x - A.x);
  
  if(tBottom !== 0) {
    const t = tTop/tBottom;
    const u = uTop/uBottom;
    if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
        intersecting: true,
      }
    }
  } 
  return {
    ...B,
    offset: 1,
    intersecting: false,
  }
}