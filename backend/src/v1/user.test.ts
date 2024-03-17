import api from ".";
import { headers, loginToken } from "./auth.test";

describe("GET /users", () => {
  test("Get the list of users", async () => {
    const res = await api.request("users", {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${loginToken}`,
      },
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

const userData = {
  firstName: "testUser",
  mobile: "99999999999",
  email: "testUser@gmail.com",
  password: "password",
  countryCode: "=91",
};

describe("POST /users", () => {
  test("create a user", async () => {
    const res = await api.request("users", {
      method: "POST",
      headers,
      body: JSON.stringify(userData),
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
