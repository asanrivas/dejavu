// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const { ipcRenderer } = require('electron')

window.ipcRenderer = ipcRenderer;
var pdfjsLib = require("pdfjs-dist");
// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js";

ipcRenderer.on("render-pdf", () => {
    return pdfjsLib
        .getDocument('https://vetterqa.s3-us-west-2.amazonaws.com/patient/00/00/00/00/00/03/35/81/records/0000000000033581_cage_card.pdf?_=5f9a219d2c9ae')
        .promise.then(
            function (pdf) {
                console.log("PDF loaded");

                // Fetch the first page
                var pageNumber = 1;
                pdf.getPage(pageNumber).then(function (page) {
                    console.log("Page loaded");

                    var scale = 5;
                    var viewport = page.getViewport({ scale: scale });

                    // Prepare canvas using PDF page dimensions
                    var canvas = document.getElementById("the-canvas");
                    var context = canvas.getContext("2d");
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Render PDF page into canvas context
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    var renderTask = page.render(renderContext);
                    renderTask.promise.then(function () {
                        console.log("Page rendered");
                        ipcRenderer.send("render-finish", true);
                    });
                });
            },
            function (reason) {
                // PDF loading error
                console.error(reason);
            }
        )
        .then(() => {
            // return ipcRenderer.send("render-finish", true);
        });
});

// Loaded via <script> tag, create shortcut to access PDF.js exports.

// Asynchronous download of PDF
