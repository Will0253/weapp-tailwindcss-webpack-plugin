import { templeteReplacer, replaceWxml, templeteHandler } from '@/wxml/index'
import { classStringReplace } from '@/shared'
import { wxmlCasePath, createGetCase, createPutCase } from './util'

const getCase = createGetCase(wxmlCasePath)
// @ts-ignore
// eslint-disable-next-line no-unused-vars
const putCase = createPutCase(wxmlCasePath)
describe('wxml', () => {
  const wxmlCase =
    '<view class="content data-v-1badc801"><view class="flex items-center justify-center w-screen h-screen data-v-1badc801"><view class="{{[\'_i_font-bold\',\'_i_text-_l__h_990000_r_\',\'data-v-1badc801\',\'text-2xl\',b]}}">{{a}}</view></view><image class="logo data-v-1badc801" src="/static/logo.png" /><view class="text-area data-v-1badc801"><text class="title h-_l_200_pct__r_ data-v-1badc801">{{c}}</text></view><view class="p-_l_20px_r_ -mt-2 mb-_l_-20px_r_ data-v-1badc801">p-[20px] -mt-2 mb-[-20px] margin的jit 可不能这么写 -m-[20px]</view><view class="space-y-_l_1-dot-6rem_r_ data-v-1badc801"><view class="w-_l_300rpx_r_ text-black text-opacity-_l_0-dot-19_r_ data-v-1badc801">w-[300rpx] text-black text-opacity-[0.19]</view><view class="min-w-_l_300rpx_r_ max-h-_l_100px_r_ text-_l_20px_r_ leading-_l_0-dot-9_r_ data-v-1badc801">min-w-[300rpx] max-h-[100px] text-[20px] leading-[0.9]</view><view class="max-w-_l_300rpx_r_ min-h-_l_100px_r_ text-_l__h_dddddd_r_ data-v-1badc801">max-w-[300rpx] min-h-[100px] text-[#dddddd]</view><view class="{{[\'flex\',\'items-center\',\'justify-center\',\'h-_l_100px_r_\',\'w-_l_100px_r_\',\'rounded-_l_40px_r_\',\'bg-_l__h_123456_r_\',\'bg-opacity-_l_0-dot-54_r_\',\'text-_l__h_ffffff_r_\',\'data-v-1badc801\',\'text-_l__h_123456_r_\',d]}}">Hello</view><view class="border-_l_10px_r_ border-_l__h_098765_r_ border-solid border-opacity-_l_0-dot-44_r_ data-v-1badc801">border-[10px] border-[#098765] border-solid border-opacity-[0.44]</view><view class="grid grid-cols-3 divide-x-_l_10px_r_ divide-_l__h_010101_r_ divide-solid data-v-1badc801"><view class="data-v-1badc801">1</view><view class="data-v-1badc801">2</view><view class="data-v-1badc801">3</view></view><view class="w-32 py-2 rounded-md font-semibold text-white bg-pink-500 ring-4 ring-pink-300 data-v-1badc801"> Default </view></view><view class="test data-v-1badc801">test</view><view wx:for="{{e}}" wx:for-item="i" wx:key="a" class="{{[\'h-_l_20px_r_\',\'w-_l_20px_r_\',\'data-v-1badc801\',i.b]}}"></view></view>'

  it('isStringLiteral', () => {
    const testCase = "{{['som-node__label','data-v-59229c4a','som-org__text-'+(node.align||''),node.active||collapsed?'som-node__label-active':'',d]}}"

    const result = templeteReplacer(testCase)

    expect(result).toBe('{{["som-node__label","data-v-59229c4a","som-org__text-"+(node.align||""),node.active||collapsed?"som-node__label-active":"",d]}}')
    expect(result).toMatchSnapshot()
  })

  it('isConditionalExpression', () => {
    const testCase = "{{['flex','flex-col','items-center',flag===1?'bg-red-900':'bg-[#fafa00]']}}"
    const result = templeteReplacer(testCase)
    expect(result).toBe('{{["flex","flex-col","items-center",flag===1?"bg-red-900":"bg-_l__h_fafa00_r_"]}}')
    expect(result).toMatchSnapshot()
  })

  it('nest ', () => {
    const testCase =
      "{{[flag?'bg-red-900':'bg-[#fafa00]',classObject,[(flag===true)?'bg-[#fafa00]':'',(true)?'text-sm':''],flag?flag===false?'bg-red-900':'bg-[#000]':'bg-[#fafa00]']}}"

    const result = templeteReplacer(testCase)
    expect(result).toBe(
      '{{[flag?"bg-red-900":"bg-_l__h_fafa00_r_",classObject,[flag===true?"bg-_l__h_fafa00_r_":"",true?"text-sm":""],flag?flag===false?"bg-red-900":"bg-_l__h_000_r_":"bg-_l__h_fafa00_r_"]}}'
    )
    expect(result).toMatchSnapshot()
  })

  it('sm:text-3xl dark:text-sky-400', () => {
    const testCase = 'sm:text-3xl dark:text-slate-200 bg-[#ffffaa]'
    const result = templeteReplacer(testCase)
    expect(result).toBe('sm_c_text-3xl dark_c_text-slate-200 bg-_l__h_ffffaa_r_')
    expect(result).toMatchSnapshot()
  })
  // it('should ', () => {
  //   const case3 =
  //     '<view class="_div data-v-59d503f6"><view class="container data-v-59d503f6">container</view><label class="decoration-clone bg-gradient-to-b from-yellow-400 to-red-500 text-transparent _span data-v-59d503f6">Hello<view class="_br data-v-59d503f6"></view>World</label><view class="box-border h-32 w-32 p-4 border-4 border-blue-400 bg-blue-200 rounded-md _div data-v-59d503f6"><view class="h-full w-full bg-blue-400 bg-stripes bg-stripes-white _div data-v-59d503f6"></view></view><view class="box-content h-32 w-32 p-4 border-4 border-green-400 bg-green-200 rounded-md _div data-v-59d503f6"><view class="h-full w-full bg-green-400 bg-stripes bg-stripes-white _div data-v-59d503f6"></view></view><block wx:for="{{displayArray}}" wx:for-item="d" wx:for-index="__i0__" wx:key="*this"><view class="{{_l_\'item\',\'data-v-59d503f6\',d]}}">{{d}}</view></block></view>'
  // })

  it('static node = self', () => {
    const testCase =
      '<view class="p-[20px] -mt-2 mb-[-20px]">p-[20px] -mt-2 mb-[-20px] margin的jit 不能这么写 -m-[20px]</view><view class="space-y-[1.6rem]"><view class="w-[300rpx] text-black text-opacity-[0.19]">w-[300rpx] text-black text-opacity-[0.19]</view><view class="min-w-[300rpx] max-h-[100px] text-[20px] leading-[0.9]">min-w-[300rpx] max-h-[100px] text-[20px] leading-[0.9]</view><view class="max-w-[300rpx] min-h-[100px] text-[#dddddd]">max-w-[300rpx] min-h-[100px] text-[#dddddd]</view><view class="flex items-center justify-center h-[100px] w-[100px] rounded-[40px] bg-[#123456] bg-opacity-[0.54] text-[#ffffff]">Hello</view><view class="border-[10px] border-[#098765] border-solid border-opacity-[0.44]">border-[10px] border-[#098765] border-solid border-opacity-[0.44]</view><view class="grid grid-cols-3 divide-x-[10px] divide-[#010101] divide-solid"><view>1</view><view>2</view><view>3</view></view></view><view class="test">test</view>'
    const result = classStringReplace(testCase, (x) => x)
    expect(result).toBe(testCase)
    expect(result).toMatchSnapshot()
  })

  it('static node ', () => {
    const testCase =
      '<view class="p-[20px] -mt-2 mb-[-20px]">p-[20px] -mt-2 mb-[-20px] margin的jit 不能这么写 -m-[20px]</view><view class="space-y-[1.6rem]"><view class="w-[300rpx] text-black text-opacity-[0.19]">w-[300rpx] text-black text-opacity-[0.19]</view><view class="min-w-[300rpx] max-h-[100px] text-[20px] leading-[0.9]">min-w-[300rpx] max-h-[100px] text-[20px] leading-[0.9]</view><view class="max-w-[300rpx] min-h-[100px] text-[#dddddd]">max-w-[300rpx] min-h-[100px] text-[#dddddd]</view><view class="flex items-center justify-center h-[100px] w-[100px] rounded-[40px] bg-[#123456] bg-opacity-[0.54] text-[#ffffff]">Hello</view><view class="border-[10px] border-[#098765] border-solid border-opacity-[0.44]">border-[10px] border-[#098765] border-solid border-opacity-[0.44]</view><view class="grid grid-cols-3 divide-x-[10px] divide-[#010101] divide-solid"><view>1</view><view>2</view><view>3</view></view></view><view class="test">test</view>'
    const result = classStringReplace(testCase, (x) => {
      return replaceWxml(x)
    })
    expect(result).toBe(
      '<view class="p-_l_20px_r_ -mt-2 mb-_l_-20px_r_">p-[20px] -mt-2 mb-[-20px] margin的jit 不能这么写 -m-[20px]</view><view class="space-y-_l_1-dot-6rem_r_"><view class="w-_l_300rpx_r_ text-black text-opacity-_l_0-dot-19_r_">w-[300rpx] text-black text-opacity-[0.19]</view><view class="min-w-_l_300rpx_r_ max-h-_l_100px_r_ text-_l_20px_r_ leading-_l_0-dot-9_r_">min-w-[300rpx] max-h-[100px] text-[20px] leading-[0.9]</view><view class="max-w-_l_300rpx_r_ min-h-_l_100px_r_ text-_l__h_dddddd_r_">max-w-[300rpx] min-h-[100px] text-[#dddddd]</view><view class="flex items-center justify-center h-_l_100px_r_ w-_l_100px_r_ rounded-_l_40px_r_ bg-_l__h_123456_r_ bg-opacity-_l_0-dot-54_r_ text-_l__h_ffffff_r_">Hello</view><view class="border-_l_10px_r_ border-_l__h_098765_r_ border-solid border-opacity-_l_0-dot-44_r_">border-[10px] border-[#098765] border-solid border-opacity-[0.44]</view><view class="grid grid-cols-3 divide-x-_l_10px_r_ divide-_l__h_010101_r_ divide-solid"><view>1</view><view>2</view><view>3</view></view></view><view class="test">test</view>'
    )
    expect(result).toMatchSnapshot()
  })

  it('percentage unit', () => {
    const testCase = '<view class="h-[200%]" />'
    const result = classStringReplace(testCase, (x) => {
      return replaceWxml(x)
    })
    expect(result).toBe('<view class="h-_l_200_pct__r_" />')
  })

  it('\\r\\n replace test', async () => {
    const testCase = `
    bg-white
    rounded-full
    w-10
    h-10
    flex
    justify-center
    items-center
    pointer-events-auto
  `
    const result = templeteReplacer(testCase)
    expect(result).toBe('    bg-white    rounded-full    w-10    h-10    flex    justify-center    items-center    pointer-events-auto  ')
  })

  it('\\r\\n replace test with var', async () => {
    const testCase = `{{[
      'flex',
      'items-center',
      'justify-center',
      'h-_l_100px_r_',
      'w-_l_100px_r_',
      'rounded-_l_40px_r_',
      'bg-_l__h_123456_r_',
      'bg-opacity-_l_0-dot-54_r_',
      'text-_l__h_ffffff_r_',
      'data-v-1badc801',
      'text-_l__h_123456_r_',
      b]}}`
    const result = templeteReplacer(testCase)
    expect(result).toBe(
      '{{["flex","items-center","justify-center","h-_l_100px_r_","w-_l_100px_r_","rounded-_l_40px_r_","bg-_l__h_123456_r_","bg-opacity-_l_0-dot-54_r_","text-_l__h_ffffff_r_","data-v-1badc801","text-_l__h_123456_r_",b]}}'
    )
  })

  it('variables with multiple literal', async () => {
    // eslint-disable-next-line quotes
    const testCase = `border-0 icon h-10 w-10 mx-auto {{active=='home'? 'icon-home-selected' : 'icon-home'}} {{}} {{ }} w-[20px] {{flag=='p-[20px]'? 'p-[20px]' : 'm-[20px]'}} h-[20px]`
    const result = templeteReplacer(testCase)
    expect(result).toBe(
      'border-0 icon h-10 w-10 mx-auto {{active=="home"?"icon-home-selected":"icon-home"}}   w-_l_20px_r_ {{flag=="p-_l_20px_r_"?"p-_l_20px_r_":"m-_l_20px_r_"}} h-_l_20px_r_'
    )
  })

  it('variables with multiple literal(2)', () => {
    // eslint-disable-next-line quotes
    const testCase = `border-0 icon h-10 w-10 mx-auto {{active=='home'? 'icon-home-selected' : 'icon-home'}} {{b}} {{ a==='cc' }} w-[20px] {{flag=='p-[20px]'? 'p-[20px]' : 'm-[20px]'}}`
    const result = templeteReplacer(testCase)
    expect(result).toBe(
      'border-0 icon h-10 w-10 mx-auto {{active=="home"?"icon-home-selected":"icon-home"}} {{b}} {{a==="cc"}} w-_l_20px_r_ {{flag=="p-_l_20px_r_"?"p-_l_20px_r_":"m-_l_20px_r_"}}'
    )
  })

  it('for toutiao str add not array', () => {
    const testCase = "{{('!font-bold') + ' ' + '!text-[#990000]' + ' ' + 'data-v-1badc801' + ' ' + 'text-2xl' + ' ' + b}}" // '{{\'font-bold\'+\'\'+\'text-blue-500\'+\'\'+\'data-v-1badc801\'+\'\'+\'text-2xl\'+\'\'+b}}'

    const result = templeteReplacer(testCase)
    expect(result).toBe('{{"_i_font-bold"+" "+"_i_text-_l__h_990000_r_"+" "+"data-v-1badc801"+" "+"text-2xl"+" "+b}}')
  })

  it('wxs should be ignored ', async () => {
    const testCase = `<wxs module="status">
    function get(index, active) {
      if (index < active) {
        return 'finish';
      } else if (index === active) {
        return 'process';
      }
    
      return 'inactive';
    }
    
    module.exports = get;
    </wxs>`
    const result = await templeteHandler(testCase)

    expect(result).toBe(testCase)
  })
})
// bg-[rgb(2,132,199)]
// `<view class="content data-v-1badc801"><view class="flex items-center justify-center w-screen h-screen data-v-1badc801"><view class="{{['font-bold', 'text-blue-500', 'data-v-1badc801', 'text-2xl', b]}}">{{a}}</view></view></view>`
// `<view class="content data-v-1badc801"><view class="flex items-center justify-center w-screen h-screen data-v-1badc801"><view class="{{['font-bold','text-blue-500','data-v-1badc801','text-2xl',b]}}">{{a}}</view></view></view>`
// <view class="content data-v-1badc801"><view class="flex items-center justify-center w-screen h-screen data-v-1badc801"><view class="{{['font-bold', 'text-blue-500', 'data-v-1badc801', 'text-2xl', b]}}">{{a}}</view></view></view>

//
