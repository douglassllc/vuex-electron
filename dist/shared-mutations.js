"use strict";var _electron=require("electron");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var IPC_EVENT_CONNECT="vuex-mutations-connect",IPC_EVENT_NOTIFY_MAIN="vuex-mutations-notify-main",IPC_EVENT_NOTIFY_RENDERERS="vuex-mutations-notify-renderers",SharedMutations=function(){function a(b,c){_classCallCheck(this,a),this.options=b,this.store=c}return _createClass(a,[{key:"loadOptions",value:function loadOptions(){this.options.type||(this.options.type="renderer"===process.type?"renderer":"main"),this.options.ipcMain||(this.options.ipcMain=_electron.ipcMain),this.options.ipcRenderer||(this.options.ipcRenderer=_electron.ipcRenderer)}},{key:"connect",value:function connect(a){this.options.ipcRenderer.send(IPC_EVENT_CONNECT,a)}},{key:"onConnect",value:function onConnect(a){this.options.ipcMain.on(IPC_EVENT_CONNECT,a)}},{key:"notifyMain",value:function notifyMain(a){this.options.ipcRenderer.send(IPC_EVENT_NOTIFY_MAIN,a)}},{key:"onNotifyMain",value:function onNotifyMain(a){this.options.ipcMain.on(IPC_EVENT_NOTIFY_MAIN,a)}},{key:"notifyRenderers",value:function notifyRenderers(a,b){Object.keys(a).forEach(function(c){a[c].send(IPC_EVENT_NOTIFY_RENDERERS,b)})}},{key:"onNotifyRenderers",value:function onNotifyRenderers(a){this.options.ipcRenderer.on(IPC_EVENT_NOTIFY_RENDERERS,a)}},{key:"rendererProcessLogic",value:function rendererProcessLogic(){var a=this;this.connect(),this.store.originalCommit=this.store.commit,this.store.originalDispatch=this.store.dispatch,this.store.commit=function(){throw new Error("[Vuex Electron] Please, don't use direct commit's, use dispatch instead of this.")},this.store.dispatch=function(b,c){a.notifyMain({type:b,payload:c})},this.onNotifyRenderers(function(b,c){var d=c.type,e=c.payload;a.store.originalCommit(d,e)})}},{key:"mainProcessLogic",value:function mainProcessLogic(){var a=this,b={};this.onConnect(function(a){var c=a.sender,d=c.id;b[d]=c,c.on("destroyed",function(){delete b[d]})}),this.onNotifyMain(function(b,c){var d=c.type,e=c.payload;a.store.dispatch(d,e)}),this.store.subscribe(function(c){var d=c.type,e=c.payload;a.notifyRenderers(b,{type:d,payload:e})})}},{key:"activatePlugin",value:function activatePlugin(){switch(this.options.type){case"renderer":this.rendererProcessLogic();break;case"main":this.mainProcessLogic();break;default:throw new Error("[Vuex Electron] Type should be \"renderer\" or \"main\".");}}}]),a}(),_default=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{};return function(b){var c=new SharedMutations(a,b);c.loadOptions(),c.activatePlugin()}};exports["default"]=_default,module.exports=exports["default"];