import api from ".";

export let loginToken: string;

const email = "shanif.s@dotworld.in";
export const loginData = {
  email,
  password: "dotworld@23",
};

export const headers = {
  "Content-Type": "application/json",
};

export const userCase = {
  id: expect.any(String),
  firstName: expect.any(String),
  lastName: expect.toBeOneOf([expect.any(String), null]),
  email: expect.any(String),
  mobile: expect.any(String),
  countryCode: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};

beforeAll(async () => {
  const res = await api.request("auth/login", {
    method: "POST",
    headers,
    body: JSON.stringify(loginData),
  });

  const response = await res.json();

  expect(res.status).toBe(200);

  expect(response).toEqual(
    expect.objectContaining({
      status: expect.any(Boolean),
      data: expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining(userCase),
      }),
    })
  );

  loginToken = response.data.token;
});

describe("POST /forget password", () => {
  test("Reset password", async () => {
    const res = await api.request("auth/forget-pass", {
      method: "POST",
      headers,
      body: JSON.stringify({ email: "test@gmail.com" }),
    });

    const response = await res.json();

    expect(res.status).toBe(200);

    expect(response).toEqual(
      expect.objectContaining({
        status: expect.any(Boolean),
        data: expect.toBeString(),
      })
    );
  });
});
