"use strict";var _electron=require("electron");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,_toPropertyKey(c.key),c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),Object.defineProperty(a,"prototype",{writable:!1}),a}function _toPropertyKey(a){var b=_toPrimitive(a,"string");return"symbol"==_typeof(b)?b:b+""}function _toPrimitive(a,b){if("object"!=_typeof(a)||!a)return a;var c=a[Symbol.toPrimitive];if(void 0!==c){var d=c.call(a,b||"default");if("object"!=_typeof(d))return d;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===b?String:Number)(a)}var IPC_EVENT_CONNECT="vuex-mutations-connect",IPC_EVENT_NOTIFY_MAIN="vuex-mutations-notify-main",IPC_EVENT_NOTIFY_RENDERERS="vuex-mutations-notify-renderers",SharedMutations=/*#__PURE__*/function(){function a(b,c){_classCallCheck(this,a),this.options=b,this.store=c}return _createClass(a,[{key:"loadOptions",value:function loadOptions(){this.options.type||(this.options.type="renderer"===process.type?"renderer":"main"),this.options.ipcMain||(this.options.ipcMain=_electron.ipcMain),this.options.ipcRenderer||(this.options.ipcRenderer=_electron.ipcRenderer)}},{key:"connect",value:function connect(a){this.options.ipcRenderer.send(IPC_EVENT_CONNECT,a)}},{key:"onConnect",value:function onConnect(a){this.options.ipcMain.on(IPC_EVENT_CONNECT,a)}},{key:"notifyMain",value:function notifyMain(a){this.options.ipcRenderer.send(IPC_EVENT_NOTIFY_MAIN,a)}},{key:"onNotifyMain",value:function onNotifyMain(a){this.options.ipcMain.on(IPC_EVENT_NOTIFY_MAIN,a)}},{key:"notifyRenderers",value:function notifyRenderers(a,b){Object.keys(a).forEach(function(c){a[c].send(IPC_EVENT_NOTIFY_RENDERERS,b)})}},{key:"onNotifyRenderers",value:function onNotifyRenderers(a){this.options.ipcRenderer.on(IPC_EVENT_NOTIFY_RENDERERS,a)}},{key:"rendererProcessLogic",value:function rendererProcessLogic(){var a=this;// Connect renderer to main process
// Save original Vuex methods
// Don't use commit in renderer outside of actions
// Forward dispatch to main process
// Subscribe on changes from main process and apply them
this.connect(),this.store.originalCommit=this.store.commit,this.store.originalDispatch=this.store.dispatch,this.store.commit=function(){throw new Error("[Vuex Electron] Please, don't use direct commit's, use dispatch instead of this.")},this.store.dispatch=function(b,c){a.notifyMain({type:b,payload:c})},this.onNotifyRenderers(function(b,c){var d=c.type,e=c.payload;a.store.originalCommit(d,e)})}},{key:"mainProcessLogic",value:function mainProcessLogic(){var a=this,b={};// Save new connection
// Subscribe on changes from renderer processes
// Subscribe on changes from Vuex store
this.onConnect(function(a){var c=a.sender,d=c.id;// Remove connection when window is closed
b[d]=c,c.on("destroyed",function(){delete b[d]})}),this.onNotifyMain(function(b,c){var d=c.type,e=c.payload;a.store.dispatch(d,e)}),this.store.subscribe(function(c){var d=c.type,e=c.payload;// Forward changes to renderer processes
a.notifyRenderers(b,{type:d,payload:e})})}},{key:"activatePlugin",value:function activatePlugin(){switch(this.options.type){case"renderer":this.rendererProcessLogic();break;case"main":this.mainProcessLogic();break;default:throw new Error("[Vuex Electron] Type should be \"renderer\" or \"main\".")}}}])}(),_default=exports["default"]=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{};return function(b){var c=new SharedMutations(a,b);c.loadOptions(),c.activatePlugin()}};module.exports=exports.default;