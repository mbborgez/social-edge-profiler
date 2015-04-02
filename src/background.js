chrome.app.runtime.onLaunched.addListener(function() {

  function Profiler() {
    var updateTimeoutMillis = 1000;
    var timeoutId;
    var previousCpuInfo;
    
    var update = function() {
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

      chrome.system.memory.getInfo(function(memoryInfo) {
        var usedMemory = 100 - Math.round(memoryInfo.availableCapacity / memoryInfo.capacity * 100);
        console.log('usedMemory: ' + usedMemory + ' %');
      });

    };

    chrome.runtime.onSuspend.addListener(function() {
      clearInterval(timeoutId);
    });

    chrome.runtime.onSuspendCanceled.addListener(function() {
      timeoutId = setInterval(update, updateTimeoutMillis);
    });

    timeoutId = setInterval(update, updateTimeoutMillis);
  }

  new Profiler();

  //chrome.app.window.create("localhost:8000/worker");
});
