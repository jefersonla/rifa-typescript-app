# RifaGen

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/rifa-app)

## Introdução

Projeto de aplicação Web para manipulação de PDF utilizando apenas bibliotecas
client side ( [PDFKit](http://pdfkit.org),
[SVGToPDFKit](https://github.com/alafr/SVG-to-PDFKit) ) utilizando a linguagem
[Typescript](https://www.typescriptlang.org/) e o bundler [Parcel](https://parceljs.org/).

## Source code

- [index.html](./index.html) - Única view
- [index.ts](./index.ts) - Todo o código fonte
- [assets/style.css](./assets/style.css) - Estilos
- [libs/dom-token-list.ext.ts](./libs/dom-token-list.ext.ts) - Extensão para interface global
- [libs/@types/svg-to-pdfkit/index.d.ts](./libs/@types/svg-to-pdfkit/index.d.ts) - Tipos para a biblioteca SVGToPDFKit
- [package.json](./package.json) - Ponto de partida do projeto
- [tsconfig.json](./tsconfig.json) - Configurações do Typescript

## Uso

### Instalação

```sh
    npm install
```

### Desenvolvimento

Iniciar servidor de desenvolvimento.

```sh
    npm start
```

### Compilar

Compila e copia o index.html para pasta de distribuição `dist`.

```sh
    npm run build
```

### Deploy

Faz deploy da pasta `dist` para o GitHub Pages.

```sh
    npm run deploy
```

Você pode ver o resultado desse projeto em  <https://jefersonla.github.io/rifa-typescript-app/>.

## Contributing

Pull requests e stars são sempre bem vindas :)

Para bugs e feature requests, [por favor crie uma issue](https://github.com/jefersonla/rifa-typescript-app/issues).

Para contribuir siga os passos abaixo:

1. Faça um fork!
2. Crie sua propria branch: `git checkout -b minha-nova-feature`
3. Commit suas modificações: `git commit -am 'Adicionado algo novo'`
4. Faça push de sua branch: `git push origin minha-nova-feature`
5. Crie uma pull request :D

## Autor

- [@jefersonla](https://github.com/jefersonla)

## License

MIT © @jefersonla
