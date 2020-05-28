import { groupObjectArrayByAttrSumEqual } from '@/util/filters'
import { tap } from 'ramda'
import { _ } from 'param.macro'
const arr = [{cnt:1}, {cnt:2}, {cnt:3}, {cnt:2}, {cnt:1}, {cnt:1}, {cnt:1}, {cnt:1}, {cnt:2}, {cnt:1}, {cnt:3}]

arr |> groupObjectArrayByAttrSumEqual('cnt', 3) |> tap(console.log(_))

console.log(JSON.stringify({a:undefined}))
console.log(JSON.parse('{a:{'))
