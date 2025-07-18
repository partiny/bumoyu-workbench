import { defineConfig, presetUno } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    presetUno(),
    presetRemToPx({
      baseFontSize: 4
    })
  ],
  rules: [
    [/^fs-([\.\d]+)$/, ([_, num]) => ({ 'font-size': `${num}px` })]
  ]
})