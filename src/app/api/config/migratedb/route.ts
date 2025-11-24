// Migrate database
// run /scripts/generate.mjs

import { execa } from 'execa';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		// run /scripts/generate.mjs
		const result = await execa('node', ['scripts/generate.mjs']);
		return NextResponse.json({ data: result.stdout });
	} catch (error) {
		console.error('Error migrating database:', error);
		return NextResponse.json(
			{ error: 'Failed to migrate database' },
			{ status: 500 }
		);
	}
}
