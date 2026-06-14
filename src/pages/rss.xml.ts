import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const blog = await getCollection('blog');
	return rss({
		title: 'QABlog.net - The Software Quality Assurance Blueprint',
		description: 'Expert deep dives into quality engineering, test automation frameworks, flaky test prevention, heuristic exploratory testing, and CI/CD quality gates.',
		site: context.site?.toString() || 'https://qablog.net',
		items: blog.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			link: `/posts/${post.id}/`,
		})),
	});
}
