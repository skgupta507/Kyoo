import { eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { roles, staff } from "~/db/schema";
import { conflictUpdateAllExcept } from "~/db/utils";
import type { SeedStaff } from "~/models/staff";
import { enqueueOptImage } from "../images";

export const insertStaff = async (
	seed: SeedStaff[] | undefined,
	showPk: number,
) => {
	if (!seed?.length) return [];

	return await db.transaction(async (tx) => {
		const people = await Promise.all(
			seed.map(async (x) => ({
				...x.staff,
				image: await enqueueOptImage(tx, {
					url: x.staff.image,
					column: staff.image,
				}),
			})),
		);
		const ret = await tx
			.insert(staff)
			.values(people)
			.onConflictDoUpdate({
				target: staff.slug,
				set: conflictUpdateAllExcept(staff, ["pk", "id", "slug", "createdAt"]),
			})
			.returning({ pk: staff.pk, id: staff.id, slug: staff.slug });

		const rval = await Promise.all(
			seed.map(async (x, i) => ({
				showPk,
				staffPk: ret[i].pk,
				kind: x.kind,
				order: i,
				character: {
					...x.character,
					image: await enqueueOptImage(tx, {
						url: x.character.image,
						table: roles,
						column: sql`${roles.character}['image']`,
					}),
				},
			})),
		);

		// always replace all roles. this is because:
		//  - we want `order` to stay in sync (& without duplicates)
		//  - we don't have ways to identify a role so we can't onConflict
		await tx.delete(roles).where(eq(roles.showPk, showPk));
		await tx.insert(roles).values(rval);

		return ret;
	});
};
