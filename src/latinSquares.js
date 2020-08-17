export function generate(n) {
  /* n=4
    m = [
      [0,1,2,3],
      [1,2,3,0],
      [2,3,0,1],
      [3,0,1,2],
    ]
  */
  let m = [];
  for (let j=0;j<n;j++) {
    m[j] = [];
    for (let i=0;i<n;i++) {
      m[j][i] = (i + j) % n;
    }
  }

  // swap rows 1 through n-1
  for (let i=1;i<n-1;i++) {
    // pick a row between i+1 and n-1
    let i2 = (i + 1) + Math.floor(Math.random()*(n-1 - i));
    let t = m[i2];
    // swap rows i and i2
    m[i2] = m[i];
    m[i] = t;
  }

  // transpose
  const squares = [];
  for (let i=0;i<n;i++) {
    squares[i] = [];
    for (let j=0;j<n;j++) {
      squares[i][j] = m[j][i];
    } 
  }

  return squares;
  /* n=3
    m = [
      [0,2,1,3],
      [1,3,0,2],
      [2,1,3,0],
      [3,0,2,1]
    ]
  */
};
