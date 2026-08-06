#!/usr/bin/env python3
"""Controleert of de JSON-LD in de thema-secties geldige JSON blijft.

Waarom: de structured data staat als Liquid in een <script>-tag, dus een vergeten
of dubbele komma zie je pas als Google de pagina afkeurt. Dat is hier al een keer
gebeurd (commit 12875c8, trailing komma). Dit script rendert elk JSON-LD-blok met
testwaarden en probeert het te parsen -- voor elke combinatie van optionele velden.

Draaien:  python3 check-jsonld.py
"""
import glob
import itertools
import json
import re
import sys

SECTIES = "shopify-theme/sections/*.liquid"


def render(bron: str, if_aan: bool) -> str:
    """Mini-Liquid: genoeg om een JSON-LD-blok uit te schrijven, niet meer.

    if_aan bepaalt of optionele {% if %}-blokken meedoen, zodat we beide
    varianten testen (recept met en zonder video/voedingswaarde/datum).
    """
    t = re.sub(r"\{%-?\s*comment\s*-?%\}.*?\{%-?\s*endcomment\s*-?%\}", "", bron, flags=re.S)

    # for-lussen: twee doorlopen, zodat het scheidingsteken van forloop.last meetelt
    def for_uit(m):
        body = m.group(1)
        eerste = re.sub(r"\{%-?\s*unless\s+forloop\.last\s*-?%\}(.*?)\{%-?\s*endunless\s*-?%\}", r"\1", body, flags=re.S)
        laatste = re.sub(r"\{%-?\s*unless\s+forloop\.last\s*-?%\}.*?\{%-?\s*endunless\s*-?%\}", "", body, flags=re.S)
        return eerste + laatste

    while re.search(r"\{%-?\s*for\s+[^%]*?-?%\}", t):
        t, n = re.subn(r"\{%-?\s*for\s+[^%]*?-?%\}((?:(?!\{%-?\s*(?:for|endfor)\s)[\s\S])*?)\{%-?\s*endfor\s*-?%\}", for_uit, t)
        if not n:
            break

    # if-blokken: binnenste eerst, zodat geneste velden goed uitvallen
    while re.search(r"\{%-?\s*if\s", t):
        t, n = re.subn(
            r"\{%-?\s*if\s+(?:(?!\{%-?\s*(?:if|endif)\s)[\s\S])*?-?%\}((?:(?!\{%-?\s*(?:if|endif)\s)[\s\S])*?)\{%-?\s*endif\s*-?%\}",
            (lambda m: m.group(1)) if if_aan else (lambda m: ""),
            t,
        )
        if not n:
            break

    # resterende tags (assign, liquid, ...) schrijven zelf niets naar de uitvoer
    t = re.sub(r"\{%-?.*?-?%\}", "", t, flags=re.S)

    # elke uitvoer is in het thema door | json gehaald -> altijd een JSON-string
    return re.sub(r"\{\{.*?\}\}", '"testwaarde"', t, flags=re.S)


def main() -> int:
    fouten = 0
    gecontroleerd = 0
    for pad in sorted(glob.glob(SECTIES)):
        bron = open(pad, encoding="utf-8").read()
        blokken = re.findall(r'<script type="application/ld\+json">(.*?)</script>', bron, re.S)
        for nr, blok in enumerate(blokken, 1):
            for if_aan in (True, False):
                uitgeschreven = render(blok, if_aan).strip()
                if not uitgeschreven:
                    continue
                gecontroleerd += 1
                try:
                    json.loads(uitgeschreven)
                except json.JSONDecodeError as e:
                    fouten += 1
                    variant = "alle optionele velden ingevuld" if if_aan else "optionele velden leeg"
                    print(f"KAPOT  {pad} blok {nr} ({variant}): {e}")
                    regels = uitgeschreven.splitlines()
                    for i in range(max(0, e.lineno - 3), min(len(regels), e.lineno + 2)):
                        merk = ">>" if i == e.lineno - 1 else "  "
                        print(f"   {merk} {regels[i]}")

    print(f"{gecontroleerd} JSON-LD-varianten gecontroleerd, {fouten} kapot.")
    return 1 if fouten else 0


if __name__ == "__main__":
    sys.exit(main())
