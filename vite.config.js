import { defineConfig } from 'vite';

export default defineConfig({
	base: './',
	publicDir: 'src/public',
	build: {
		rollupOptions: {
			external: 'excalibur/build/dist/Util/Util',
		},
	},
});
