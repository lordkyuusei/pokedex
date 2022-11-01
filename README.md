Kyuukedex
=========

The (soon) ultimate SPA Pokedex.

Features
--------

*   An infinite-scroll, lazy-loading complete Pokedex.
*   A per-Pokemon detail page where you can (currently) check their:
    *   Default / shiny picture, body data, typing, stats and evolution family;
    *   High final stat product using EV - IV - Level - Natures sliders;
    *   Complete moveset (name, power, type...) sort by game & method!
    *   Evolution chain with triggers, conditions in a tree-like visual;
    *   Abilities (hidden ones are marked with a \*);
    *   Alternate forms & varieties with clickable links!
*   A (Moon/Sun stone)-inspired dark & light theme!
*   French & English localization (~80% of content)

Known bugs
----------

*   Abilities translations are not immediate.
    * Workaround: click on another ability & go back (or refresh the page).
*   Forms & Varieties require a page refresh to show correct results.
*   Some quirky evolutions tree are incomplete / falsy.
    * notable examples: poliwag, rockruff... due to alternate forms/mecanics


Why
---

Go [here](https://kyuudex.lkyuusei.fr/about) to know more about this app! (and to use it)

You can run the app too!
------------------------

```sh
git clone https://github.com/lordkyuusei/pokedex  
npm install && npm run dev
```

Screenshots
-----------

![light](/static/screenshots/kyuudex-light-espeon.png)
![dark](/static/screenshots/kyuudex-dark-incineroar.png)

License
-------

The Unlicense license.