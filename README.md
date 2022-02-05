# Saturn - Headless Vue Components

Effortlessly build high-performance user interfaces with Saturn's headless Vue 3 components. These components were designed to provide common functionality needed to build powerful applications with a minimalistic API. The styling and behavior
of most components can be driven by CSS instead of complex component APIs. 




[TailwindCSS](https://tailwindcss.com/) components supported by a Headless Vue UI Library

> Style your components using TailwindCSS, not verbose APIs

[Saturn](https://saturnui.web.app) is set of beautifully handcrafted Tailwind CSS and Vue 3 components written in TypeScript. Everything you need to create fully customizable applications is at your fingertips.

Saturn recommends using [WindiCSS](https://windicss.org/) to compile and configure TailwindCSS

## Official Documentation

Official documentation and examples can be found below.

https://saturnui.web.app

## Getting Started

### Installation

Use Saturn as a submodule. By installing like so:

```
git submodule add git@github.com:saturnui/vue.git src/modules/saturn/vue
git submodule add git@github.com:saturnui/theme.git src/modules/saturn/theme
```
### Saturn has the following dependencies

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

### Saturn ❤️ WindiCSS

Saturn is a set of TailwindCSS components. However it is highly recommended to use WindiCSS engine for compiling these. [Click here official WindiCSS documentation for Vite](https://windicss.org/integrations/vite.html) or just do the following for minimum setup.

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
rm -f saturnui-saturn-$npm_package_version.tgz
pnpm build && npm pack && mkdir -p ~/local_modules
rm ~/local_modules/saturn.tgz
cp saturnui-saturn-$npm_package_version.tgz ~/local_modules/saturn.tgz"
```