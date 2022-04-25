import { version } from '../package.json'
import UaBrowser, { isWebview, isWechatMiniapp, getLanguage } from './browser'

const instance = new UaBrowser() 

function Wrap(ua?: string) {
  return instance.getEnv(ua)
}

Wrap.isWebview = isWebview
Wrap.isWechatMiniapp = isWechatMiniapp
Wrap.getLanguage = getLanguage
Wrap.VERSION = version

export default Wrap