var cameraPositions = [
    //starting position
    {
        "position": {
            "x": 17241.785030642906,
            "y": 17673.50773400442,
            "z": 9123.48282649454
        },
        "target": {
            "x": -1029.4027914047242,
            "y": -597.6800880432129,
            "z": 1371.6000000000001
        },
        "up": {
            "x": -0.2031874261279721,
            "y": -0.2031874261279721,
            "z": 0.9578255267672605
        },
        "width": 6201.506261195632,
        "height": 6201.506261195633,
        "projection": 1,
        "nearLimit": 0.01,
        "className": "Communicator.Camera"
    },
    //door opening
    {
        "position": {
            "x": -516.5348931488895,
            "y": 8462.471260181725,
            "z": 2639.052433838325
        },
        "target": {
            "x": -509.53174647562355,
            "y": 1661.6135339486082,
            "z": 981.2571679891396
        },
        "up": {
            "x": 0.0002438721222062888,
            "y": -0.23682776955834237,
            "z": 0.971551618851211
        },
        "width": 7000,
        "height": 7000,
        "projection": 1,
        "nearLimit": 0.01,
        "className": "Communicator.Camera"
    },
    //interior position 1
    {
        "position": {
            "x": -3407.514805743785,
            "y": -3613.5195647600044,
            "z": 2639.052433838325
        },
        "target": {
            "x": 2143.1623540445094,
            "y": -313.04975225026374,
            "z": -62.22172561244952
        },
        "up": {
            "x": 0.3316899627714203,
            "y": 0.19722507321634722,
            "z": 0.9225421611457659
        },
        "width": 7000,
        "height": 7000,
        "projection": 1,
        "nearLimit": 0.01,
        "className": "Communicator.Camera"
    },
    //interior position 3
    {
        "position": {
            "x": 1552.8641607223983,
            "y": -1960.1304521033398,
            "z": 1476.0927661234816
        },
        "target": {
            "x": -5274.364411919793,
            "y": -3395.4187197362676,
            "z": 902.5968152281399
        },
        "up": {
            "x": -0.08017540593863236,
            "y": -0.01685527564692206,
            "z": 0.9966382513055787
        },
        "width": 7000,
        "height": 7000,
        "projection": 1,
        "nearLimit": 0.01,
        "className": "Communicator.Camera"
    }

]


function setView(val) {
    var camera = Communicator.Camera.construct(cameraPositions[val]);
    hwv.getView().setCamera(camera, 500);

    if (val == 0) {
        hwv.operatorManager.set(Communicator.OperatorId.Navigate, 0);
    }
    else {
        hwv.operatorManager.set(Communicator.OperatorId.Navigate, 0);
        enableWalk();
    }



}

function enableWalk() {

    var walkModeOperator = hwv.operatorManager.getOperator(Communicator.OperatorId.WalkMode);
    var walkMode = 0;
    walkModeOperator.setWalkMode(walkMode);
    hwv.operatorManager.set(Communicator.OperatorId.WalkMode, 0);
}

function enableEyeDomeLighting() {
    var checkbox = document.getElementById("eye-dome");
    if (checkbox.checked == true) {
        hwv.view.setEyeDomeLightingEnabled(true)
    } else {
        hwv.view.setEyeDomeLightingEnabled(false)
    }

}

function enableSplats() {
    var checkbox = document.getElementById("splats");
    var splatSizeSlider = document.getElementById("splatSizeSlider");

    if (checkbox.checked == true) {
        var newSplatSize = splatSizeSlider.value / 10000;
        hwv.view.setPointSize(newSplatSize, 5)
        splatSizeSlider.disabled = false;
    } else {
        hwv.view.setPointSize(1, 0)
        splatSizeSlider.disabled = true;
    }
}

function disablePointCloudWindow(disable) {
    var splats = document.getElementById("splats");
    var eyedome = document.getElementById("eye-dome");
    var splatSizeSlider = document.getElementById("splatSizeSlider");
    if (disable) {
        splats.disabled = true;
        eyedome.disabled = true;
        splatSizeSlider.disabled = true;
    }
    else {
        splats.disabled = false;
        eyedome.disabled = false;
        if (splats.checked) {
            splatSizeSlider.disabled = false;
        }

    }
}

function updateSplatSize() {
    var splatSizeSliderValue = document.getElementById("splatSizeSlider").value;
    var newSplatSize = splatSizeSliderValue / 10000;
    document.getElementById("splatValue").innerHTML = newSplatSize;
    hwv.view.setPointSize(newSplatSize, 5)
}