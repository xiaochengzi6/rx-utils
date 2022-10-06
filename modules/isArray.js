import { nativeIsArray } from "./_setUp"
import tagTester from "./_tagTester"

export default nativeIsArray || tagTester('Array')