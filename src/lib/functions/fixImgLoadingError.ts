import { fetchPokemonSpriteURL } from "./getPokemonSpritesURL"

const onImgError = (el: Event & { currentTarget: EventTarget & HTMLImageElement }) => {
    el.currentTarget.src = fetchPokemonSpriteURL(0);
    el.currentTarget.classList.add('img-error');
}

export default onImgError;