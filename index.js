var fs = require('fs');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;

var installed = 0;

exports.install = function() {
    _install(require.main.filename);

    function _install(fil) {
        var file = fs.readFileSync(fil, "utf8");
        if (file.indexOf('node_modules') > -1) {
            return false;
        }
        var aFile = file.split("\n");

        aFile.forEach(function(line) {
            if (line.indexOf('require') > -1) {
                var pack = line.split('require')[1].split('(')[1].split(')')[0].split('\'').join('');
                var dot = pack.charAt(0);
                if (dot !== '.') { //local package, ignoring
                    try {
                        require.resolve(pack);
                    } catch (e) {
                        run('npm install ' + pack);
                        installed++;
                        console.log('start: ', '"' + process.argv.join('" "') + '"');
                    }
                }else{
                  _install(pack + '.js');
                }
            }
        });
        if (installed > 0) {
            process.argv.shift();
            runForever('node ' + process.argv.join('" "'));
            process.exit();
        }
    }
}

function run(cmd) {
    switch (process.platform) {
        case 'win32':
            return execSync('start "New Window" cmd /c ' + cmd);
        case 'linux':
            return exec('xterm -e ' + cmd);
        case 'darwin':
            break;
    }
    console.log('PLATFORM NOT FOUND: ', process.platform);
}


function runForever(cmd) {
    switch (process.platform) {
        case 'win32':
            return exec('start "New Window" cmd /k ' + cmd);
        case 'linux':
            return exec('xterm -e ' + cmd);
        case 'darwin':
            break;
    }
    console.log('PLATFORM NOT FOUND: ', process.platform);
}
