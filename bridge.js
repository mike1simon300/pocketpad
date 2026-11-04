// PocketPad bridge proof of concept. Injected into the active GeForce NOW tab.
(function(){
 if(window.__pocketPadBridge){alert('PocketPad bridge is already running.');return;}
 window.__pocketPadBridge=true;
 const box=document.createElement('div');
 box.id='pocketpad-bridge-panel';
 box.style.cssText='position:fixed;z-index:2147483647;top:12px;left:12px;max-width:290px;padding:12px;background:#101722;color:white;border:2px solid #4d8fe8;border-radius:12px;font:14px system-ui;box-shadow:0 4px 20px #0009';
 box.innerHTML='<b>🎮 PocketPad bridge</b><div id="pp-state" style="margin:8px 0">Loading connection…</div><div style="font-size:12px;overflow-wrap:anywhere">Bridge ID: <span id="pp-id">…</span></div><div style="font-size:11px;margin-top:8px;color:#c7d0df">Experimental: sends synthetic keyboard events, not real touch or gamepad input.</div><button id="pp-close" style="margin-top:9px;padding:7px 10px">Close</button>';
 (document.body||document.documentElement).appendChild(box);
 const state=box.querySelector('#pp-state'), idEl=box.querySelector('#pp-id');
 box.querySelector('#pp-close').onclick=()=>{if(window.__ppPeer)window.__ppPeer.destroy();box.remove();window.__pocketPadBridge=false};
 function dispatch(key,down){
   const code=key, keyMap={ArrowUp:'ArrowUp',ArrowDown:'ArrowDown',ArrowLeft:'ArrowLeft',ArrowRight:'ArrowRight',Enter:'Enter',Escape:'Escape',Space:' '};
   const keyVal=keyMap[key]||key.replace(/^Key/,'').toLowerCase();
   const opts={key:keyVal,code:code,bubbles:true,cancelable:true,composed:true,repeat:false};
   // Dispatch to common page targets. Browsers mark these events as untrusted.
   [window,document,document.activeElement].filter(Boolean).forEach(target=>{
     try{target.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',opts));}catch(e){}
   });
   state.textContent='Last input: '+key+' '+(down?'DOWN':'UP')+' (synthetic)';
 }
 function start(){
   if(typeof Peer==='undefined'){state.textContent='PeerJS unavailable. Page policy may block script loading.';return;}
   const peer=new Peer();window.__ppPeer=peer;
   peer.on('open',id=>{idEl.textContent=id;state.textContent='Waiting for iPhone…'});
   peer.on('connection',conn=>{
     state.textContent='iPhone connected ✓';
     conn.on('data',msg=>{if(msg&&msg.kind==='key'&&typeof msg.key==='string'&&typeof msg.down==='boolean')dispatch(msg.key,msg.down)});
     conn.on('close',()=>state.textContent='iPhone disconnected');
   });
   peer.on('error',e=>state.textContent='Connection error: '+e.type);
 }
 const s=document.createElement('script');
 s.src='https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js';
 s.onload=start;s.onerror=()=>state.textContent='Could not load PeerJS library.';
 (document.head||document.documentElement).appendChild(s);
})();