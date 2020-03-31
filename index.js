import { VctrApi } from "https://www.vectary.com/viewer-api/v1/api.js";

let vctrApi;
let hideBtn = document.getElementById("hide");
let rocketBtn = document.getElementById("rocket");
let baseBtn = document.getElementById("base");

let annotationSwitch = true;
let highlightState = false;

const annotations = [
    {
        label: "1",
        name: "Rocket",
        text: "The spaceship flying around the space base",
        objectName: "Rocket"
    },
    {
        label: "2",
        name: "Asteroid",
        text: "253 Mathilde",
        objectName: "Asteroid_Large"
    },
    {
        label: "3",
        name: "Space Base",
        text: "Advance asteroid mining space base",
        objectName: "Tower"
    },
    {
        label: "4",
        name: "Transmitter",
        text: "Energy transmitter",
        objectName: "Ring_2"
    },
    {
        label: "5",
        name: "Antenna",
        text: "Radio wave antenna",
        objectName: "Antenna"
    }
];

let annotationsIds = [];

function addAnotations() {
    annotations.forEach(async annotation => {
        const currentAnnotation = await vctrApi.addAnnotation(annotation);
        annotationsIds.push(currentAnnotation.id);
    })
}

function addListeners() {
    rocketBtn.addEventListener("click", async _event => {
        if (!highlightState && annotationSwitch) {
            await vctrApi.highlightMeshesByName(["Rocket"], "#fcba03", 0.8, false);
            await vctrApi.expandAnnotationsById(annotationsIds[0], true, true);
            highlightState = true;
        } else {
            await vctrApi.unhighlightMeshesByName(["Rocket"]);
            await vctrApi.expandAnnotationsById(annotationsIds[0], false, false);
            highlightState = false;
        }
    });

    hideBtn.addEventListener("click", async _event => {
        annotationSwitch = !annotationSwitch;
        await vctrApi.enableAnnotations(annotationSwitch);
    });

    baseBtn.addEventListener("click", async _event => {
        await vctrApi.expandAnnotationsById([annotationsIds[3], annotationsIds[4]], true, true);
    });
}
async function run() {
    console.log("Example script running..");

    function errHandler(err) {
        console.log("API error", err);
    }

    async function onReady() {
        console.log("API ready..");
    }

    vctrApi = new VctrApi("test", errHandler);
    try {
        await vctrApi.init();
    } catch (e) {
        errHandler(e);
    }

    await vctrApi.enableAnnotations(annotationSwitch);
    addAnotations();
    addListeners();
    onReady();
}

run();
