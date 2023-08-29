
var modelUIDs = ["e99ae692-cda2-4c00-8b29-2b0461b47483", //DotProductOffice
"bf5326d7-1d98-4917-b3b1-8f6160c3cca6" //DotProductOfficeScan
]
async function startViewer(modelName) {
        const conversionServiceURI = "https://csapi.techsoft3d.com";

        var viewer;

        let res = await fetch(conversionServiceURI + '/api/streamingSession');
        var data = await res.json();
        var endpointUriBeginning = 'ws://';

        if(conversionServiceURI.substring(0, 5).includes("https")){
                endpointUriBeginning = 'wss://'
        }

        await fetch(conversionServiceURI + '/api/enableStreamAccess/' + data.sessionid, { method: 'put', headers: { 'items': JSON.stringify(modelUIDs) } });

        viewer = new Communicator.WebViewer({
                containerId: "viewerContainer",
                endpointUri: endpointUriBeginning + data.serverurl + ":" + data.port + '?token=' + data.sessionid,
                model: modelName,
                boundingPreviewMode: "none",
                enginePath: "https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer",
                rendererType: 0
        });

        viewer.start();

        return viewer;

}

async function fetchVersionNumber() {
        const conversionServiceURI = "https://csapi.techsoft3d.com";

        let res = await fetch(conversionServiceURI + '/api/hcVersion');
        var data = await res.json();
        versionNumer = data;
        
        return data

}



async function initializeViewer() {
 // enable functionality for point cloud toggle
 const toggleScan = function () {
        scanVisible = !scanVisible;
        if (scanVisible) {
          if (scanLoaded == false) {
            hwv.getModel().loadSubtreeFromModel(0, "DotProductOfficeScan");
            scanLoaded = true;
          } else {
            hwv.getModel().setNodesVisibility([findNode(0, "LR")], scanVisible);
          }
          document.getElementById("toggle-scan-button").classList.add("active-tool");
          document.getElementById("toggle-scan-button").style.opacity = 1;
          disablePointCloudWindow(false);
        } else {
          hwv.getModel().setNodesVisibility([findNode(0, "LR")], scanVisible);
          document.getElementById("toggle-scan-button").classList.remove("active-tool");
          document.getElementById("toggle-scan-button").style.opacity = 0.3;
          disablePointCloudWindow(true);
        }
      };
  
      // enable functionality for toggle solid visibility
      const toggleSolid = function () {
        var nodes = [
          1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69,
          73, 77, 81, 85, 89, 93,
        ];
        solidVisible = !solidVisible;
        hwv.getModel().setNodesVisibility(nodes, solidVisible);
        if (solidVisible) {
          document.getElementById("toggle-solid-button").classList.add("active-tool");
          document.getElementById("toggle-solid-button").style.opacity = 1;
        } else {
          document.getElementById("toggle-solid-button").classList.remove("active-tool");
          document.getElementById("toggle-solid-button").style.opacity = 0.3;
  
        }
      };
  
      let scanLoaded = false;
      let scanVisible = false;
      let solidVisible = true;
  
      // add additional buttons for point cloud and solid visibility to the interface
      document.querySelector(".toolbar-tools").innerHTML += `
                  <div id="tool_separator_5" class="tool-separator"></div>
                  <div id="toggle-scan-button" title="Toggle Point Cloud Visibility" data-operatorclass="toolbar-toggle-scan" class="hoops-tool">
                      <div class="tool-icon"></div>
                  </div>
                  <div id="toggle-solid-button" title="Toggle Solid Visibility" data-operatorclass="toolbar-toggle-solid" class="hoops-tool active-tool">
                      <div class="tool-icon"></div>
                  </div>     
              `;
  
      hwv = await startViewer("DotProductOffice")
  
      hwv.setCallbacks({
        modelStructureReady: function () {
          hwv.getView().setPointSize(0.0005, 5); // set smaller points
          $(".dropdown").css("display", "inline-block");
        },
        walkOperatorActivated: function () {
          var keyboardWalkOperator = hwv.operatorManager.getOperator(Communicator.OperatorId.WalkMode);
          keyboardWalkOperator.setWalkSpeed(7000);
        }
      });
  
      const uiConfig = {
        containerId: "content",
        screenConfiguration: Sample.screenConfiguration,
      };
      const ui = new Communicator.Ui.Desktop.DesktopUi(hwv, uiConfig);
  
      ui._toolbar._actionsNullary.set("toolbar-toggle-scan", toggleScan);
      ui._toolbar._actionsNullary.set("toolbar-toggle-solid", toggleSolid);
  
      window.onresize = function () {
        hwv.resizeCanvas();
      };
  
      var findNode = function (nodeId, name) {
        var children = hwv.getModel().getNodeChildren(nodeId);
        for (var i = 0; i < children.length; i++) {
          if (hwv.getModel().getNodeName(children[i]) === name) {
            return children[i];
          } else {
            ret = findNode(children[i], name);
            if (ret != -1) return ret;
          }
        }
        return -1;
      };
}