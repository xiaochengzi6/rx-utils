import cb from "./_cb"
import _ from './root'

export default function iteratee (value, context){
  return cb(value, context, Infinity)
}

_.iteratee = iteratee;