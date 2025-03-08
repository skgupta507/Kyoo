import { beforeAll, describe, expect, it } from "bun:test";
import { createSerie, getSerie } from "tests/helpers";
import { expectStatus } from "tests/utils";
import { db } from "~/db";
import { shows, videos } from "~/db/schema";
import { madeInAbyss, madeInAbyssVideo } from "~/models/examples";

beforeAll(async () => {
	await db.delete(videos);
	await db.delete(shows);
	await db.insert(videos).values(madeInAbyssVideo);
	await createSerie(madeInAbyss);
});

describe("aet series", () => {
	it("Invalid slug", async () => {
		const [resp, body] = await getSerie("sotneuhn", { langs: "en" });

		expectStatus(resp, body).toBe(404);
		expect(body).toMatchObject({
			status: 404,
			message: expect.any(String),
		});
	});
	it("With a valid entryCount/availableCount", async () => {
		const [resp, body] = await getSerie(madeInAbyss.slug, { langs: "en" });

		expectStatus(resp, body).toBe(200);
		expect(body.entriesCount).toBe(madeInAbyss.entries.length);
		expect(body.availableCount).toBe(1);
	});
});
