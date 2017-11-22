const events = {}

function on (type, handler) {
  if (typeof handler !== 'function') {
    throw new Error('Handler must be of type function')
  }
  (events[type] = events[type] || []).push(handler)
}

function off (type, handler) {
  events[type] = (events[type] || []).filter((fn) => handler && fn !== handler)
}

function emit (type, data = {}) {
  if (window.webkit && window.webkit.messageHandlers) {
    window.webkit.messageHandlers.nativebridgeiOS.postMessage({type, data})
  } else if (window.nativebridgeAndroid) {
    window.nativebridgeAndroid.on(JSON.stringify({type, data}))
  } else {
    console.log('no message handler context')
  }
}

function onNative ({details: {type, data}}) {
  (events[type] || []).forEach((handler) => handler(data))
}

if (typeof window !== 'undefined') {
  window.addEventListener('nativebridge', onNative)
}

module.exports = { on, off, emit }