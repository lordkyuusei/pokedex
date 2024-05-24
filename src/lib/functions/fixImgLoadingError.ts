import { fetchPokemonSpriteURL } from "./getPokemonSpritesURL"

const onImgError = (el: Event & { currentTarget: EventTarget & Element }) => {
    (el.currentTarget as HTMLImageElement).src = fetchPokemonSpriteURL(0);
    el.currentTarget.classList.add('img-error');
}

export default onImgError;