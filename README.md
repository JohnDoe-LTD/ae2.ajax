# John Doe's Pizzas

Actividad AE-2. AJAX

## Descripción

[Requisitos de la actividad](REQUIREMENTS.md)

## Guía de instalación y ejecución

### Requisitos

Para ejecutar el proyecto es necesario tener [NodeJS](https://nodejs.org/es/) en su máquina. Para su instalación debe descargar el paquete LTS estable (18.12.1) y seguir los pasos de indicados en el instalador.

### Instalación

Después de realizar el clonado del repositorio, debe instalar las dependencias del entorno de trabajo utilizando el comando `npm install` en el directorio del proyecto tal y como se indica:

```shell
$npm install
```

### Ejecución

Para ejecutar el proyecto en su máquina local sólo debe iniciar el servidor local como se indica:

```shell
$npm run serve
```

Si necesitas editar los ficheros mientras ejecutas la web, puedes ejecutar la
web en el directorio `/src`  con `npm run local`.

Si por el contrario, sólo necesitas realizar una build o generar la web en modo
release, utiliza los comandos `npm run build` o `npm run release` respectivamente.

## Construido con

### Tecnologías

- HTML5
- CSS3
- Javascript (Vanilla)
- AJAX

### Herramientas

- [npm-watch](https://www.npmjs.com/package/npm-watch)
- [concat](https://github.com/gko/concat)
- [css linter](https://github.com/CSSLint/csslint) - linter css
- [clean-css](https://github.com/clean-css/clean-css-cli) - concatenar y
  minificar css
- [eslint](https://github.com/eslint/eslint) - linter js reglas de google
- [Uglify3](https://github.com/mishoo/UglifyJS)

## Licencia

El proyecto está construido y publicado bajo licencia [MIT](LICENSE) tal y como se establece en el directorio principal.
