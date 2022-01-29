# Vuwi

> v0.0.0 - This project is in development and is not ready for production

[TailwindCSS](https://tailwindcss.com/) components supported by a Headless Vue UI Library

> Style your components using TailwindCSS, not verbose APIs

[Vuwi](https://vuwijs.web.app) is set of beautifully handcrafted Tailwind CSS and Vue 3 components written in TypeScript. Everything you need to create fully customizable applications is at your fingertips.

Vuwi recommends using [WindiCSS](https://windicss.org/) to compile and configure TailwindCSS

## Official Documentation

Official documentation and examples can be found below.

https://vuwijs.web.app

## Getting Started

### Installation

Use vuwi as a submodule. By installing like so:

```
git submodule add git@github.com:vuwijs/vuwi.git src/modules/vuwi
```
### Vuwi has the following dependencies

* [vue-demi](https://github.com/vueuse/vue-demi) - a developing utility
allows you to write Universal Vue Libraries for Vue 2 & 3
* [vueuse](https://vueuse.org/) - collection of essential Vue composition utilities
* [mitt](https://github.com/developit/mitt) - tiny 200b functional event emitter / pubsub

#### Tooltip Component
* [popper](https://popper.js.org/) - tooltip & popover positioning engine

#### TextInput Component
* [maska](https://github.com/beholdr/maska) - a simple zero-dependency input mask
* [vee-validate](https://vee-validate.logaretm.com/v4/) - form validation

Install these dependencies with the following command

```
npm i vue-demi @popperjs/core @vueuse/core maska vee-validate@next mitt --save
```

### Vuwi ❤️ WindiCSS

Vuwi is a set of TailwindCSS components. However it is highly recommended to use WindiCSS engine for compiling these. [Click here official WindiCSS documentation for Vite](https://windicss.org/integrations/vite.html) or just do the following for minimum setup.

```
npm i -D vite-plugin-windicss windicss
```

Then, install the plugin in your Vite configuration:

`vite.config.js`

```
import WindiCSS from 'vite-plugin-windicss'

export default {
  plugins: [
    WindiCSS(),
  ],
}
```
And finally, import `virtual:windi.css` in your Vite entries:

`main.js`

```
import 'virtual:windi.css'
```

## Local Build and Test

### References

* https://medium.com/@vcarl/problems-with-npm-link-and-an-alternative-4dbdd3e66811
* https://jivancic.com/posts/build-a-component-library.html#package-json-config


```
pnpm build:local
```

### Which performs the following commands:

```
rm -f vuwijs-vuwi-$npm_package_version.tgz
pnpm build && npm pack && mkdir -p ~/local_modules
rm ~/local_modules/vuwi.tgz
cp vuwijs-vuwi-$npm_package_version.tgz ~/local_modules/vuwi.tgz"
```