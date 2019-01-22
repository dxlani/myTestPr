export function azureBlob () {
    var DefaultBlockSize:number = 1024 * 32 // Default to 32KB
    var upload = function (config) {
        var state = initializeState(config);

        var reader = new FileReader();
        reader.onloadend = function (evt:any) {
            var FileReader:{DONE:any};
            if (evt.target.readyState == reader.DONE && !state.cancelled) { // DONE == 2
                var uri = state.fileUrl + '&comp=block&blockid=' + state.blockIds[state.blockIds.length - 1];
                var requestData = new Uint8Array(evt.target.result);
                // var requestData = '';
                console.log(uri);
                $.ajax({ 
                    headers: {
                        'x-ms-blob-type': 'BlockBlob',
                        //'Content-Type': state.file.type,
                    },
                    processData:false,
                    url:uri, 
                    data: requestData,
                    type:'PUT',
                    success: function(data, status, headers){
                        console.log(data);
                        console.log(status);
                        state.bytesUploaded += requestData.length;
                        var percentComplete = ((parseFloat(state.bytesUploaded.toString()) / parseFloat(state.file.size)) * 100).toFixed(2);
                        if (state.progress) state.progress(percentComplete, data, status, headers, config);

                        uploadFileInBlocks(reader, state);
                    },
                    error:function(data,status,headers){
                        console.log(data);
                        console.log(status);

                        if (state.error) state.error(data, status, headers, config);
                    }
                });
            }
        };

        uploadFileInBlocks(reader, state);

        return {
            cancel: function() {
                state.cancelled = true;
            }
        };
    };
    var initializeState = function (config) {
        var blockSize = DefaultBlockSize;
        if (config.blockSize) blockSize = config.blockSize;

        var maxBlockSize = blockSize; // Default Block Size
        var numberOfBlocks = 1;

        var file = config.file;

        var fileSize:number = file.size;
        if (fileSize < blockSize) {
            maxBlockSize = fileSize;
            console.log("max block size = " + maxBlockSize);
        }

        if (fileSize % maxBlockSize == 0) {
            numberOfBlocks = fileSize / maxBlockSize;
        } else {
            //修改过
            numberOfBlocks = parseInt((fileSize / maxBlockSize).toString(), 10) + 1;
        }

        console.log("total blocks = " + numberOfBlocks);

        return {
            maxBlockSize: maxBlockSize, //Each file will be split in 256 KB.
            numberOfBlocks: numberOfBlocks,
            totalBytesRemaining: fileSize,
            currentFilePointer: 0,
            blockIds: new Array(),
            blockIdPrefix: 'block-',
            bytesUploaded: 0,
            submitUri: null,
            file: file,
            baseUrl: config.baseUrl,
            sasToken: config.sasToken,
            fileUrl: config.baseUrl,
            progress: config.progress,
            complete: config.complete,
            error: config.error,
            cancelled: false
        };
    };

    var uploadFileInBlocks = function (reader, state) {
        if (!state.cancelled) {
            if (state.totalBytesRemaining > 0) {
                console.log("current file pointer = " + state.currentFilePointer + " bytes read = " + state.maxBlockSize);

                var fileContent = state.file.slice(state.currentFilePointer, state.currentFilePointer + state.maxBlockSize);
                var blockId = state.blockIdPrefix + pad(state.blockIds.length, 6);
                console.log("block id = " + blockId);

                state.blockIds.push(btoa(blockId));
                reader.readAsArrayBuffer(fileContent);

                state.currentFilePointer += state.maxBlockSize;
                state.totalBytesRemaining -= state.maxBlockSize;
                if (state.totalBytesRemaining < state.maxBlockSize) {
                    state.maxBlockSize = state.totalBytesRemaining;
                }
            } else {
                commitBlockList(state);
            }
        }
    };

    var commitBlockList = function (state) {
        var uri = state.fileUrl + '&comp=blocklist';
        console.log(uri);

        var requestBody = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
        for (var i = 0; i < state.blockIds.length; i++) {
            requestBody += '<Latest>' + state.blockIds[i] + '</Latest>';
        }
        requestBody += '</BlockList>';
        console.log(requestBody);
        $.ajax({
            headers: {
                'x-ms-blob-content-type': state.file.type,
            },
            processData:true,
            url: uri,
            type: 'PUT',
            // dataType: 'json',
            data: requestBody,
            success: function(data,status,headers) {//
                console.log(data);
                console.log(status);
                var config:any;
                if (state.complete) state.complete(data, status, headers,config);//
            },
            error: function(data, status, headers){//
                console.log(data);
                console.log(status);
                var config:any;
                if (state.error) state.error(data, status, headers,config);//
            }
        })
    };

    var pad = function (number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    };
    return {
        upload: upload,
    };
}