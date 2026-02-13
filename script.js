// function submitData() {
//     const data = {
//         diskSize: document.getElementById("diskSize").value,
//         head: document.getElementById("headPosition").value,
//         requests: document.getElementById("requests").value,
//         direction: document.getElementById("direction").value
//     };

//     localStorage.setItem("diskData", JSON.stringify(data));
//     window.location.href = "result.html";
// }

// function goBack() {
//     window.location.href = "index.html";
// }

// if (window.location.pathname.includes("result.html")) {
//     const data = JSON.parse(localStorage.getItem("diskData"));
//     const diskSize = parseInt(data.diskSize);
//     const head = parseInt(data.head);
//     const direction = data.direction;
//     const requests = data.requests.split(",").map(x => parseInt(x.trim()));

//     const results = [
//         fcfs(head, requests),
//         sstf(head, requests),
//         scan(head, requests, diskSize, direction),
//         cscan(head, requests, diskSize, direction)
//     ];

//     displayResults(results);
// }

// function fcfs(head, requests) {
//     let seek = 0, current = head;
//     for (let r of requests) {
//         seek += Math.abs(current - r);
//         current = r;
//     }
//     return buildResult("FCFS", seek, requests.length);
// }

// function sstf(head, requests) {
//     let seek = 0, current = head;
//     let remaining = [...requests];
//     while (remaining.length) {
//         let distances = remaining.map(r => Math.abs(current - r));
//         let minIndex = distances.indexOf(Math.min(...distances));
//         let next = remaining[minIndex];
//         seek += Math.abs(current - next);
//         current = next;
//         remaining.splice(minIndex, 1);
//     }
//     return buildResult("SSTF", seek, requests.length);
// }

// function scan(head, requests, diskSize, direction) {
//     let seek = 0, current = head;
//     let left = requests.filter(r => r < head).sort((a,b)=>a-b);
//     let right = requests.filter(r => r >= head).sort((a,b)=>a-b);

//     if (direction === "right") {
//         for (let r of right) {
//             seek += Math.abs(current - r);
//             current = r;
//         }
//         seek += Math.abs(current - (diskSize - 1));
//         current = diskSize - 1;
//         for (let r of left.reverse()) {
//             seek += Math.abs(current - r);
//             current = r;
//         }
//     } else {
//         for (let r of left.reverse()) {
//             seek += Math.abs(current - r);
//             current = r;
//         }
//         seek += Math.abs(current - 0);
//         current = 0;
//         for (let r of right) {
//             seek += Math.abs(current - r);
//             current = r;
//         }
//     }

//     return buildResult("SCAN", seek, requests.length);
// }

// function cscan(head, requests, diskSize, direction) {
//     let seek = 0, current = head;
//     let left = requests.filter(r => r < head).sort((a,b)=>a-b);
//     let right = requests.filter(r => r >= head).sort((a,b)=>a-b);

//     if (direction === "right") {
//         for (let r of right) {
//             seek += Math.abs(current - r);
//             current = r;
//         }
//         seek += Math.abs(current - (diskSize - 1));
//         current = diskSize - 1;
//         seek += Math.abs(current - 0);
//         current = 0;
//         for (let r of left) {
//             seek += Math.abs(current - r);
//             current = r;
//         }
//     }

//     return buildResult("C-SCAN", seek, requests.length);
// }

// function buildResult(name, totalSeek, totalRequests) {
//     return {
//         name,
//         totalSeek,
//         avgSeek: (totalSeek / totalRequests).toFixed(2),
//         throughput: (totalRequests / totalSeek).toFixed(5)
//     };
// }

// function displayResults(results) {
//     const container = document.getElementById("results");

//     results.forEach(r => {
//         container.innerHTML += `
//             <div class="result-box">
//                 <h3>${r.name}</h3>
//                 <p>Total Seek Time: ${r.totalSeek}</p>
//                 <p>Average Seek Time: ${r.avgSeek}</p>
//                 <p>Throughput: ${r.throughput}</p>
//             </div>
//         `;
//     });
// }



function submitData() {
    const data = {
        diskSize: parseInt(document.getElementById("diskSize").value),
        head: parseInt(document.getElementById("headPosition").value),
        requests: document.getElementById("requests").value,
        direction: document.getElementById("direction").value
    };

    localStorage.setItem("diskData", JSON.stringify(data));
    window.location.href = "result.html";
}

function goBack() {
    window.location.href = "index.html";
}

if (window.location.pathname.includes("result.html")) {
    const data = JSON.parse(localStorage.getItem("diskData"));

    const diskSize = parseInt(data.diskSize);
    const head = parseInt(data.head);
    const direction = data.direction;
    const requests = data.requests.split(",").map(x => parseInt(x.trim()));

    const results = [
        fcfs(head, requests),
        sstf(head, requests),
        scan(head, requests, diskSize, direction),
        cscan(head, requests, diskSize, direction)
    ];

    displayResults(results);
}

/* ===========================
   ALGORITHMS
=========================== */

function fcfs(head, requests) {
    let totalSeek = 0;
    let current = head;

    for (let r of requests) {
        totalSeek += Math.abs(current - r);
        current = r;
    }

    return buildResult("FCFS", totalSeek, requests.length);
}

function sstf(head, requests) {
    let totalSeek = 0;
    let current = head;
    let remaining = [...requests];

    while (remaining.length > 0) {
        let distances = remaining.map(r => Math.abs(current - r));
        let minIndex = distances.indexOf(Math.min(...distances));
        let next = remaining[minIndex];

        totalSeek += Math.abs(current - next);
        current = next;
        remaining.splice(minIndex, 1);
    }

    return buildResult("SSTF", totalSeek, requests.length);
}

function scan(head, requests, diskSize, direction) {
    let totalSeek = 0;
    let current = head;

    let left = requests.filter(r => r < head).sort((a,b)=>a-b);
    let right = requests.filter(r => r >= head).sort((a,b)=>a-b);

    if (direction === "right") {

        for (let r of right) {
            totalSeek += Math.abs(current - r);
            current = r;
        }

        // move to end
        totalSeek += Math.abs(current - (diskSize - 1));
        current = diskSize - 1;

        // reverse direction
        for (let r of left.reverse()) {
            totalSeek += Math.abs(current - r);
            current = r;
        }

    } else {

        for (let r of left.reverse()) {
            totalSeek += Math.abs(current - r);
            current = r;
        }

        // move to start
        totalSeek += Math.abs(current - 0);
        current = 0;

        for (let r of right) {
            totalSeek += Math.abs(current - r);
            current = r;
        }
    }

    return buildResult("SCAN", totalSeek, requests.length);
}

function cscan(head, requests, diskSize, direction) {
    let totalSeek = 0;
    let current = head;

    let left = requests.filter(r => r < head).sort((a,b)=>a-b);
    let right = requests.filter(r => r >= head).sort((a,b)=>a-b);

    if (direction === "right") {

        for (let r of right) {
            totalSeek += Math.abs(current - r);
            current = r;
        }

        // go to end
        totalSeek += Math.abs(current - (diskSize - 1));
        current = diskSize - 1;

        // jump to start (IMPORTANT FIX)
        totalSeek += Math.abs(current - 0);
        current = 0;

        for (let r of left) {
            totalSeek += Math.abs(current - r);
            current = r;
        }

    } else {

        for (let r of left.reverse()) {
            totalSeek += Math.abs(current - r);
            current = r;
        }

        // go to start
        totalSeek += Math.abs(current - 0);
        current = 0;

        // jump to end
        totalSeek += Math.abs(current - (diskSize - 1));
        current = diskSize - 1;

        for (let r of right.reverse()) {
            totalSeek += Math.abs(current - r);
            current = r;
        }
    }

    return buildResult("C-SCAN", totalSeek, requests.length);
}

/* ===========================
   METRICS
=========================== */

function buildResult(name, totalSeek, totalRequests) {
    return {
        name,
        totalSeek: totalSeek,
        avgSeek: (totalSeek / totalRequests).toFixed(2),
        throughput: (totalRequests / totalSeek).toFixed(5)
    };
}

/* ===========================
   DISPLAY
=========================== */

function displayResults(results) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    results.forEach(r => {
        container.innerHTML += `
            <div class="result-box">
                <h3>${r.name}</h3>
                <p>Total Seek Time: ${r.totalSeek}</p>
                <p>Average Seek Time: ${r.avgSeek}</p>
                <p>Throughput: ${r.throughput}</p>
            </div>
        `;
    });
}
