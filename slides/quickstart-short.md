---
marp: true
headingDivider: 1
paginate: true
---

# Quickstart 
<br/>

_short version_

![bg](images/day_sixty_four_by_rona_keller_d2vnk8d-fullview.jpg)

<style scoped>
h1, p {
    background-color: white;
    display: inline-block;
}  
</style>


# Markdown

Utilisation du markdown de base sans soucis

- **gras**
- _italique_
- `code entre back quote`
- et les triple _back quotes_ sont supportés


# Passage d'un slide à l'autre

Les slides sont séparés par 
- `---` ou 
- un titre de niveau 1 si l'option `headingDivider: 2` est donnée



# Configuration de base

Il suffit de commencer son document markdown par 

```yaml
---
marp: true
headingDivider: 2
paginate: true
---
```

et d'installer le plugin pour VSCode ou Codium. 

Le plugin exporte en `pdf` ou en `html`.


---
![bg](images/10339196.webp)

# Les images 

Pour avoir une image en _background_, c'est très simple

```
![bg](image.webp)
```

- le mot `bg` met l'image en _background_ complet
- on peut ajouter _left_ ou _right_
- ainsi que des % `![bg right:33%](image.webp)`
- …

![bg right:33%](images/10339196.webp)


---

Pour ajouter une image _au fil du texte_, il suffit de ne pas écrire `bg`. 

![w:350px sepia](images/10339196.webp "Alt text")

- la syntaxe `![<options>](<lien>) "Alt text")`
- parmi les options
    - la taille avec `w:<size` ou `h:<size>`
    - des filtres CSS comme par exemple `sepia:x%`

Le tout est là <https://marpit.marp.app/image-syntax>











