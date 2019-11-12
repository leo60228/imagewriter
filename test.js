function testWriteFromFile() {
  var fileEntry;
  var storageDevice;
  var currentStage = "none";
  var currentProgress = -1;
  var started = true;

  function chooseEntryCallback(entry) {
    fileEntry = entry;

    chrome.imageWriterPrivate.listRemovableStorageDevices(
        listDevicesCallback);
  }

  function listDevicesCallback(deviceList) {
    storageDevice = deviceList[0];

    startWrite();
  }

  function startWrite() {
    chrome.imageWriterPrivate.writeFromFile(
        storageDevice.storageUnitId,
        fileEntry,
        startWriteCallback);
  }

  function startWriteCallback() {
    document.getElementById('status').textContent = '0%';
    started = true;
  }

  function writeProgressCallback(progressInfo) {
    currentProgress = progressInfo.percentComplete;
    currentStage = progressInfo.stage;
    document.getElementById('status').textContent = currentProgress + '%';
  }

  function writeCompleteCallback() {
    document.getElementById('status').textContent = 'Done!';
    console.log("write completed successfully");
  }

  function writeErrorCallback(message) {
    document.getElementById('status').textContent = 'Error: ' + message;
    console.error(message);
  }

  chrome.imageWriterPrivate.onWriteProgress.
      addListener(writeProgressCallback);
  chrome.imageWriterPrivate.onWriteComplete.
      addListener(writeCompleteCallback);
  chrome.imageWriterPrivate.onWriteError.
      addListener(writeErrorCallback);

  chrome.fileSystem.chooseEntry(chooseEntryCallback);
}

testWriteFromFile();
