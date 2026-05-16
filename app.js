let workspaceApi;
let mmiObjectMap = {};

// Standardiserte farger for MMI-verdier
const defaultMmiColors = {
    "100": "#cccccc", // Grå
    "200": "#add8e6", // Lyseblå
    "300": "#0000ff", // Blå
    "400": "#ffff00", // Gul
    "500": "#008000"  // Grønn
};

async function init() {
    try {
        // Riktig tilkobling til Workspace API
        workspaceApi = await TrimbleConnectWorkspace.connect(window.parent);
        document.getElementById("status-msg").innerText = "Tilkoblet. Laster data...";
        
        await scanModelForMmi();
        buildUi();
        applyColorsToViewer();
        
        document.getElementById("status-msg").innerText = "Ferdig!";
        
    } catch (error) {
        console.error("Kunne ikke koble til API:", error);
        document.getElementById("status-msg").innerText = "Feil: Kunne ikke koble til 3D-vieweren.";
        document.getElementById("status-msg").style.color = "red";
    }
}

async function scanModelForMmi() {
    // Dette er en midlertidig simulering mens vi venter på å bygge uthentingen
    // av faktiske Egenskapssett (Property Sets) for dine modeller.
    const simulatedObjects = [
        { id: "obj1", mmi: "200" },
        { id: "obj2", mmi: "300" },
        { id: "obj3", mmi: "200" },
        { id: "obj4", mmi: "400" }
    ];

    mmiObjectMap = {};

    simulatedObjects.forEach(obj => {
        if (!mmiObjectMap[obj.mmi]) {
            mmiObjectMap[obj.mmi] = {
                color: defaultMmiColors[obj.mmi] || "#ff00ff", 
                objectIds: []
            };
        }
        mmiObjectMap[obj.mmi].objectIds.push(obj.id);
    });
}

function buildUi() {
    const container = document.getElementById("mmi-list");
    container.innerHTML = ""; 

    for (const [mmiValue, data] of Object.entries(mmiObjectMap)) {
        const div = document.createElement("div");
        div.className = "mmi-item";
        
        const label = document.createElement("span");
        label.innerText = `MMI ${mmiValue} (${data.objectIds.length} objekter)`;
        
        const select = document.createElement("select");
        const colorOptions = [
            { name: "Grå", value: "#cccccc" },
            { name: "Lyseblå", value: "#add8e6" },
            { name: "Blå", value: "#0000ff" },
            { name: "Gul", value: "#ffff00" },
            { name: "Grønn", value: "#008000" },
            { name: "Rød", value: "#ff0000" }
        ];

        colorOptions.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.value;
            option.innerText = opt.name;
            if (opt.value === data.color) option.selected = true;
            select.appendChild(option);
        });

        select.addEventListener("change", (e) => {
            mmiObjectMap[mmiValue].color = e.target.value;
            applyColorsToViewer();
        });

        div.appendChild(label);
        div.appendChild(select);
        container.appendChild(div);
    }
}

function applyColorsToViewer() {
    let colorInstructions = [];
    
    for (const [mmiValue, data] of Object.entries(mmiObjectMap)) {
        data.objectIds.forEach(id => {
            colorInstructions.push({
                objectId: id,
                color: data.color
            });
        });
    }

    // placeholder for selve setColors API-kallet
    console.log("Sender fargeoppdatering til viewer:", colorInstructions);
}

// Kobler til knappen for å nullstille farger
document.getElementById("btn-reset").addEventListener("click", () => {
    // placeholder for resetColors API-kall
    console.log("Nullstiller farger i vieweren.");
});

// Start applikasjonen når alt er lastet inn
window.onload = init;
