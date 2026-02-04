import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { ambassadorPathway, pathwayWeekContent } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const assignments = await db
		.select()
		.from(ambassadorPathway)
		.where(eq(ambassadorPathway.userId, user.id));

	if (assignments.length === 0 && !user.isAdmin) {
		throw error(403, 'You are not an ambassador');
	}

	const weekContents = await db.select().from(pathwayWeekContent);
	
	const contentByPathway = weekContents.reduce((acc, c) => {
		if (!acc[c.pathway]) acc[c.pathway] = {};
		acc[c.pathway][c.weekNumber] = {
			title: c.title,
			isPublished: c.isPublished
		};
		return acc;
	}, {} as Record<string, Record<number, { title: string; isPublished: boolean }>>);

	return {
		assignments: assignments.map(a => a.pathway),
		contentByPathway
	};
};
