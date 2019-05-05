
window.onload = function(){
    `use strict`;
    const csInterface = new CSInterface();
    const extensionId = csInterface.getExtensionID(); 
    themeManager.init();
    const result = document.getElementById(`result`);
    const CEP_event = document.getElementById(`CEP_event`);
    const persistence = document.getElementById(`persistence`);
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
   
    
    //イベントリストarray
    const eventList1 = [`applicationActivate`
                       ,`documentAfterDeactivate`
                       ,`com.adobe.csxs.events.AppOffline`
                       ,`com.adobe.csxs.events.AppOnline`
                       ,`com.adobe.csxs.events.ThemeColorChanged`
                       ,`com.adobe.csxs.events.WindowVisibilityChanged`//Persistentがonにならない限り発火しない
                       ];
    
    const eventList2 = [`documentEdited`
                        ,`com.adobe.csxs.events.ExtensionLoaded`
                        ,`com.adobe.csxs.events.ExtensionUnloaded`
                        ];
    
    
    function dispatchCEPEvent(event_type){//イベント登録関数
        return new Promise(resolve =>{
            csInterface.addEventListener(event_type,(e)=>{
                CEP_event.textContent = e.type;
                resolve(e);
            });
        });
    }
    
    function getObj(){//jsx関数
        return new Promise(resolve=>{
            csInterface.evalScript(`getData()`,(o)=>{
                resolve(o);
            });
        });
    }
    
    async function writeResult(){//jsxからデータを取得して表示
        const event = await dispatchCEPEvent(`documentAfterActivate`);
        console.log(event);
        const o = await getObj();
        const json = JSON.parse(o);
        
        while(result.firstChild){
                result.removeChild(result.firstChild);
            }
        Object.entries(json).forEach(v=>{
            const li = document.createElement(`li`);
            li.textContent = v;
            result.appendChild(li);
        });
    }
    writeResult();
    
    async function registerEvent(kind){//async awaitで非同期を同期のように処理
        const e = await dispatchCEPEvent(kind);
        console.log(e);
    }
    
    eventList1.forEach(v=>{//イベント登録
        registerEvent(v);
    }); 
    
    
    
    persistence.addEventListener(`change`,function(){//persistence
        if(this.checked){
            const persistence_on = new CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION");
            persistence_on.extensionId = extensionId;
            csInterface.dispatchEvent(persistence_on);
        }else{
            const persistence_off = new CSEvent("com.adobe.PhotoshopUnPersistent", "APPLICATION");
            persistence_off.extensionId = extensionId;
            csInterface.dispatchEvent(persistence_off);
        }
    });
}
