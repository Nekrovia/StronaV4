# Pietrzak Sp. z o.o. — strona V4

Czwarta koncepcja — w przeciwieństwie do V1/V2/V3 (jednostronicowych
szkiców wyglądu) to pełna, wielostronicowa struktura z myślą o
funkcjonalności: każda usługa i nieruchomości mają własną stronę z
pełnym opisem, galerią, FAQ i dedykowanym CTA. Styl: jasny, elegancki,
dużo białej przestrzeni (Manrope + Inter, stonowana zieleń).

## Struktura

```
index.html              strona główna — hero, karty-linki do usług, o firmie skrótowo, CTA
o-firmie.html            o firmie + park maszynowy (7 maszyn)
nieruchomosci.html       4 realne oferty (Wojkowice x2, Dąbrowa Górnicza, Jaworzno)
realizacje.html          galeria zdjęć z lightboxem
kontakt.html             formularz (z automatycznym wyborem tematu z URL ?topic=...) + mapa
404.html                 strona błędu
uslugi/
  koparki.html
  wyburzenia.html
  azbest.html
  logistyka.html
  transport.html
css/style.css            wspólny system wizualny
js/script.js             menu mobilne (z dropdownem "Usługi"), reveal, lightbox, formularz, licznik
images/, koparka.mp4     zasoby
sitemap.xml, robots.txt  SEO — URL-e ustawione na stronysuper2.github.io/StronaV4/,
                          podmienić jeśli strona trafi pod inną domenę
```

Każda strona ma unikalne meta title/description/OG. Strona główna ma
dodatkowo dane strukturalne schema.org (LocalBusiness).

## Uruchomienie lokalne

```bash
python -m http.server 8090
```

i wejść na `http://localhost:8090/`.
