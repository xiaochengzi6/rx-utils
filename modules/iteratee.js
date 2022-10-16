import cb from "./_cb"

export default function iteratee (value, context){
  return cb(value, context, Infinity)
}