const res = await fetch("http://127.0.0.1:7252").then((res) => res.text());

console.log(res);

const res2 = await fetch("http://127.0.0.1:7252").then((res) => res.text());

console.log(res2);
