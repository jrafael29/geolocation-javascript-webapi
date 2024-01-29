export async function login({ email, password }) {
  const token = "";

  const body = {
    email: email,
    password: password,
  };

  const SERVER_HOST = `http://localhost:3000`;
  const LOGIN_ROUTE = `/api/login`;
  const { data } = await (
    await fetch(`${SERVER_HOST}${LOGIN_ROUTE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  ).json();
  if (data.token) {
    return data.token;
  }
  return null;
}
