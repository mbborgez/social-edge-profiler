var timeoutId;
var previousCpuInfo;

function updateCpuUsage() {
  chrome.system.cpu.getInfo(function(cpuInfo) {

    for (var i = 0; i < cpuInfo.numOfProcessors; i++) {
        var usage = cpuInfo.processors[i].usage;
        var usedPercentage = 0;
        if (previousCpuInfo) {
          var oldUsage = previousCpuInfo.processors[i].usage;
          usedPercentage = Math.floor((usage.kernel + usage.user - oldUsage.kernel - oldUsage.user) / (usage.total - oldUsage.total) * 100);
        } else {
          usedPercentage = Math.floor((usage.kernel + usage.user) / usage.total * 100);
        }
      console.log('cpu ' + i + ' usage: ' + usedPercentage + ' %');
    }

    previousCpuInfo = cpuInfo;
  });
}

function updateMemoryUsage() {
  chrome.system.memory.getInfo(function(memoryInfo) {
    var usedMemory = 100 - Math.round(memoryInfo.availableCapacity / memoryInfo.capacity * 100);
    console.log('usedMemory: ' + usedMemory + ' %');
  });
};


function updateAll() {
  updateCpuUsage();
  updateMemoryUsage();

  timeoutId = setTimeout(updateAll, 500);
}

chrome.runtime.onSuspend.addListener(function() {
  clearTimeout(timeoutId);
});

chrome.runtime.onSuspendCanceled.addListener(function() {
  updateAll();
});

document.addEventListener('DOMContentLoaded', function() {
  updateAll();
});
