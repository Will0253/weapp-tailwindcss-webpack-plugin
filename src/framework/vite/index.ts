import type { Plugin } from 'vite'
import { UserDefinedOptions, IMangleOptions } from '@/types'
import { getOptions } from '@/defaults'
import { templeteHandler } from '@/wxml'
import type { OutputAsset } from 'rollup'
// import WeappTailwindcssRenamePlugin from '@/postcss/plugin'
// import { postcssPlugin } from '@/postcss/shared'
import type { Plugin as PostcssPlugin } from 'postcss'
import { styleHandler } from '@/postcss'
import { getGroupedEntries } from '@/base/shared'
import { createInjectPreflight } from '@/postcss/preflight'
import ClassGenerator from '@/mangle/classGenerator'

// issue 一个节点静态，一个节点动态，动态节点中的静态属性不会被 mangle 导致存在问题

// https://github.com/sonofmagic/weapp-tailwindcss-webpack-plugin/issues/3
export default function ViteWeappTailwindcssPlugin (options: UserDefinedOptions = {}): Plugin | undefined {
  const opts = getOptions(options)
  const {
    // htmlMatcher,
    // cssMatcher,
    // mainCssChunkMatcher,
    disabled,
    cssPreflight,
    replaceUniversalSelectorWith,
    cssPreflightRange,
    customRuleCallback,
    onEnd,
    onLoad,
    onStart,
    onUpdate,

    mangle
  } = opts
  if (disabled) {
    return
  }
  let globalClassGenerator: ClassGenerator | undefined
  if (mangle) {
    globalClassGenerator = new ClassGenerator(mangle as IMangleOptions)
  }
  const cssInjectPreflight = createInjectPreflight(cssPreflight)
  onLoad()
  // 要在 vite:css 处理之前运行
  return {
    name: 'vite-plugin-uni-app-weapp-tailwindcss-adaptor',
    enforce: 'post',
    buildStart () {
      onStart()
    },
    configResolved (config) {
      const postcssConfig = config.css?.postcss as {
        plugins: PostcssPlugin[]
      }
      const tailwindcssIdx = postcssConfig.plugins.findIndex((x) => x.postcssPlugin === 'tailwindcss')
      if (tailwindcssIdx === -1) {
        console.warn('请先安装 tailwindcss! `npm i -D tailwindcss / yarn add -D tailwindcss `')
      }
      // const postcssIdx = postcssConfig.plugins.findIndex((x) => x.postcssPlugin === postcssPlugin)
      // if (postcssIdx === -1) {
      //   postcssConfig.plugins.splice(
      //     tailwindcssIdx + 1,
      //     0,
      //     WeappTailwindcssRenamePlugin({
      //       cssMatcher,
      //       cssPreflight,
      //       mainCssChunkMatcher,
      //       replaceUniversalSelectorWith,
      //       cssPreflightRange,
      //       customRuleCallback
      //       // classGenerator
      //     }) as PostcssPlugin
      //   )
      // }
    },
    // renderChunk (code, chunk, options) {
    //   return code
    // },
    // transform (code, id, options) {
    //   return code
    // },
    generateBundle (opt, bundle, isWrite) {
      // 也许应该都在这里处理
      const entries = Object.entries(bundle).filter(([, s]) => s.type === 'asset') as [string, OutputAsset][]
      const groupedEntries = getGroupedEntries(entries, opts)
      if (Array.isArray(groupedEntries.html)) {
        for (let i = 0; i < groupedEntries.html.length; i++) {
          let classGenerator
          const [file, originalSource] = groupedEntries.html[i]
          if (globalClassGenerator && globalClassGenerator.isFileIncluded(file)) {
            classGenerator = globalClassGenerator
          }
          const oldVal = originalSource.source.toString()
          originalSource.source = templeteHandler(oldVal, { classGenerator })
          onUpdate(file, oldVal, originalSource.source)
        }
      }
      if (Array.isArray(groupedEntries.css)) {
        for (let i = 0; i < groupedEntries.css.length; i++) {
          let classGenerator
          const [file, originalSource] = groupedEntries.css[i]
          if (globalClassGenerator && globalClassGenerator.isFileIncluded(file)) {
            classGenerator = globalClassGenerator
          }
          const rawSource = originalSource.source.toString()
          const css = styleHandler(rawSource, {
            isMainChunk: true,
            cssInjectPreflight,
            customRuleCallback,
            cssPreflightRange,
            replaceUniversalSelectorWith,
            classGenerator
          })
          originalSource.source = css
          onUpdate(file, rawSource, css)
        }
      }
    },
    buildEnd () {
      onEnd()
    }
  }
}
