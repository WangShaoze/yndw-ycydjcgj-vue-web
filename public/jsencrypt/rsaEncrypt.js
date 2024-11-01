import JSEncrypt from 'jsencrypt'

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCc5wsZ0Jr/gKgvuuyyUecuA1/hzVom0ESEtCbhxjqIIDlSL+AOr6/OZxeJpIBpFBSdrW2noWc3TViPoYRoMzlLjxDwJWH1+27xygFQNABNb1HbSgRo3DeRdcUjMdY0DGdO0CkD4F2hT52Vg922NRs+g1+1dZyLbB41MrBUw2ceaQIDAQAB'

//加密
export function encrypt(txt) {
  var encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

//解密
export function decrypt(txt) {
  var encryptor = new JSDecrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.decrypt(txt) // 对需要加密的数据进行加密
}
