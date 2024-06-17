// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	type Lang = 'fr' | 'en';
	type Theme = 'moon' | 'sun';
	type Variant<T extends Theme> =
		T extends 'moon' ? 'greink' | 'piey' :
		T extends 'sun' ? 'edge' | 'maglet' :
		never;
}

export { };
