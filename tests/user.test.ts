import { test, expect } from '@playwright/test';

export default function userTestCollection() {
   test("Valid user registration info", async ({ request }) => {
      test.setTimeout(10_000);

      // Arrange (setup the test)
      const user = {
         name: "John Doe",
         email: "johndoe@email.com",
         password: "123456",

      }

      // Act (perform the test)
      const response = await request.post("/api/user/register", { data: user });
      const json = await response.json();

      // Assert (check the result)
      expect(response.status()).toBe(201);
      expect(json.error).toEqual(null);
   });
}