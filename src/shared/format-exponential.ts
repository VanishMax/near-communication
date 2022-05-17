import { utils as nearUtils } from 'near-api-js'

const formatExponential = (num: number): string => {
  return Number(num / Math.pow(10, nearUtils.format.NEAR_NOMINATION_EXP)).toFixed(4)
}

export default formatExponential
