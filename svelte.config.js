import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, referrer, message, ...rest }) => {
				console.log(path, message, rest);

				// otherwise fail the build
				throw new Error(message);
			}
		},
		serviceWorker: {
			register: false,
		},
		files: {
			serviceWorker: 'src/service-worker.ts'
		}
	}
};

export default config;
