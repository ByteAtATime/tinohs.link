import { afterAll, describe, expect, it, vi } from "vitest";
import { GET } from "./+server";
import { selectUrlSchema, type SelectUrlSchema } from "$lib/server/db/url";

const mocks = vi.hoisted(() => ({
    getAllURLs: vi.fn(),
}));
vi.mock("$lib/server/db/url", async (importOriginal) => ({
    ...(await importOriginal()),
    getAllURLs: mocks.getAllURLs,
}));

afterAll(() => {
    mocks.getAllURLs.mockClear();
});

describe("/api/urls", () => {
    describe("GET", () => {
        it("should return all URLs", async () => {
            const mockURLs = [{
                id: "00000000-0000-0000-0000-000000000000",
                shortUrl: "short",
                redirectUrl: "redirect",
                createdAt: new Date(),
                updatedAt: new Date(),
            }] satisfies SelectUrlSchema[];

            mocks.getAllURLs.mockResolvedValue(mockURLs);
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await GET({} as any);

            expect(response.status).toBe(200);

            const rawBody = await response.json();
            const parsed = selectUrlSchema.array().safeParse(rawBody);

            expect(parsed.success).toBe(true);
            expect(parsed.data).toEqual(mockURLs);
        });

        it("should return 500 if getAllURLs throws", async () => {
            mocks.getAllURLs.mockRejectedValue(new Error("An error occurred"));
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await GET({} as any);
            expect(response.status).toBe(500);

            const body = await response.json();
            expect(body).toEqual({ error: "An error occurred" });
        });
    });
});
