const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.csv': 'text/csv; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Target Mozart CSV folder locations
const MOZART_DIR_CANDIDATES = [
    'G:/My Drive/Mozart Analysis 2026/OBK CASE Jan - Sep 26 CSV',
    'G:\\My Drive\\Mozart Analysis 2026\\OBK CASE Jan - Sep 26 CSV',
    path.resolve(__dirname, '../Mozart Analysis 2026/OBK CASE Jan - Sep 26 CSV'),
    path.resolve(__dirname, 'data')
];

let lastSyncTime = null;
let syncStatus = {
    active: false,
    lastSync: null,
    sourceDir: null,
    filesCount: 0,
    files: [],
    error: null
};

// Locate existing Mozart directory
function getMozartDir() {
    for (const dir of MOZART_DIR_CANDIDATES) {
        try {
            if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
                return dir;
            }
        } catch (e) {}
    }
    return null;
}

// Sync files from Mozart folder into dcc-dashboard/data and check for updates
function syncMozartFiles() {
    const mozartDir = getMozartDir();
    if (!mozartDir) {
        syncStatus.error = 'Mozart Analysis directory not found on disk';
        console.warn('[Sync] ' + syncStatus.error);
        return syncStatus;
    }

    try {
        const localDataDir = path.resolve(__dirname, 'data');
        if (!fs.existsSync(localDataDir)) {
            fs.mkdirSync(localDataDir, { recursive: true });
        }

        const files = fs.readdirSync(mozartDir).filter(f => f.toLowerCase().endsWith('.csv'));
        let copied = 0;

        files.forEach(file => {
            const srcPath = path.join(mozartDir, file);
            const destPath = path.join(localDataDir, file);
            
            // If dest doesn't exist or src is newer, copy it
            let shouldCopy = !fs.existsSync(destPath);
            if (!shouldCopy) {
                const srcStat = fs.statSync(srcPath);
                const destStat = fs.statSync(destPath);
                if (srcStat.mtime > destStat.mtime) {
                    shouldCopy = true;
                }
            }

            if (shouldCopy && srcPath !== destPath) {
                fs.copyFileSync(srcPath, destPath);
                copied++;
            }
        });

        lastSyncTime = new Date().toISOString();
        syncStatus = {
            active: true,
            lastSync: lastSyncTime,
            sourceDir: mozartDir,
            filesCount: files.length,
            files: files,
            copied: copied,
            error: null
        };
        console.log(`[Sync] Successfully synced ${files.length} CSV files from "${mozartDir}" (Copied: ${copied}) at ${lastSyncTime}`);
        return syncStatus;
    } catch (err) {
        syncStatus.error = err.message;
        console.error('[Sync] Error syncing Mozart CSV files:', err);
        return syncStatus;
    }
}

// Initial sync on startup
syncMozartFiles();

// Auto-sync every 24 hours (24 * 60 * 60 * 1000 ms)
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
setInterval(() => {
    console.log('[Sync 24h Cron] Running scheduled 24-hour sync for Mozart Analysis CSVs...');
    syncMozartFiles();
}, TWENTY_FOUR_HOURS_MS);

const server = http.createServer((req, res) => {
    let safeUrl = req.url.split('?')[0];

    // CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API: Trigger or get Mozart Sync Status
    if (safeUrl === '/api/sync-mozart' || safeUrl === '/api/sync') {
        const result = syncMozartFiles();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8', 'Cache-Control': 'no-cache' });
        res.end(JSON.stringify(result));
        return;
    }

    // API: Status
    if (safeUrl === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8', 'Cache-Control': 'no-cache' });
        res.end(JSON.stringify({
            status: 'online',
            uptime: process.uptime(),
            sync: syncStatus
        }));
        return;
    }

    // API: List Mozart files
    if (safeUrl === '/api/mozart-files') {
        const mozartDir = getMozartDir();
        let files = [];
        if (mozartDir) {
            try {
                files = fs.readdirSync(mozartDir).filter(f => f.toLowerCase().endsWith('.csv'));
            } catch (e) {}
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8', 'Cache-Control': 'no-cache' });
        res.end(JSON.stringify({ dir: mozartDir, files }));
        return;
    }

    if (safeUrl === '/' || safeUrl === '') {
        safeUrl = '/index.html';
    }

    const filePath = path.join(__dirname, safeUrl);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
                res.end(`500 Internal Server Error: ${err.code}`);
            }
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`DCC Server successfully listening on http://localhost:${PORT}`);
    console.log(`Auto 24-hour sync active for G:\\My Drive\\Mozart Analysis 2026\\OBK CASE Jan - Sep 26 CSV`);
});
