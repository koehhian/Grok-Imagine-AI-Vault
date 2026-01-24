import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;
const DATA_FILE = path.join(__dirname, 'data', 'links.json');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Serve thumbnails directory
app.use('/thumbnails', express.static(path.join(__dirname, 'data', 'thumbnails')));

if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

if (!fs.existsSync(path.join(__dirname, 'data', 'thumbnails'))) {
    fs.mkdirSync(path.join(__dirname, 'data', 'thumbnails'), { recursive: true });
}

const PHOTOS_DIR = path.join(__dirname, 'data', 'thumbnails', 'VaultPhotos');
if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Robust Grok Thumbnail Extractor
const getGrokThumbnail = (url) => {
    if (!url || typeof url !== 'string') return null;
    // Enhanced regex to match post, video, or just the UUID in Grok/x.ai context
    const match = url.match(/(?:post|video|images|share)\/([a-f0-9-]{36})/i) ||
        url.match(/\/([a-f0-9-]{36})/i);
    if (match && match[1]) {
        return `https://imagine-public.x.ai/imagine-public/images/${match[1]}.jpg`;
    }
    return null;
};

// Data Migration: Album (String) -> Tags (Array)
const migrateData = () => {
    let raw = fs.readFileSync(DATA_FILE, 'utf8');
    let data = JSON.parse(raw);
    let changed = false;

    data = data.map(link => {
        // If has album but no tags array, migrate
        if (link.album && !Array.isArray(link.tags)) {
            link.tags = [link.album];
            delete link.album;
            changed = true;
        }
        // Ensure tags exists as an array
        if (!link.tags) {
            link.tags = [];
            changed = true;
        }
        return link;
    });

    if (changed) {
        console.log("[Migration] Converted 'album' strings to 'tags' arrays.");
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
};
migrateData();

app.get('/api/links', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
});

app.get('/api/network-info', (req, res) => {
    const interfaces = os.networkInterfaces();
    let lanIp = 'localhost';

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (loopback) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                lanIp = iface.address;
                break;
            }
        }
        if (lanIp !== 'localhost') break;
    }

    res.json({ lanIp });
});

app.post('/api/links', (req, res) => {
    const { url, title, tags } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    // Deduplication check
    if (data.some(link => link.url === url)) {
        return res.status(409).json({ error: 'URL already exists' });
    }

    const thumbnail = getGrokThumbnail(url);
    const newLink = {
        id: Date.now().toString(),
        url,
        title: title || 'Untitled AI Image',
        thumbnail,
        tags: Array.isArray(tags) ? tags : [],
        addedAt: new Date().toISOString()
    };
    data.push(newLink);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newLink);
});

app.post('/api/links/bulk', (req, res) => {
    const { links, tags } = req.body;
    if (!Array.isArray(links)) return res.status(400).json({ error: 'Array of links required' });

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const existingUrls = new Set(data.map(l => l.url));

    const finalTags = Array.isArray(tags) ? tags : [];

    const newLinks = links
        .filter(link => {
            const isDup = existingUrls.has(link.url);
            if (isDup) console.log(`[Bulk Add] Skipping duplicate: ${link.url}`);
            return !isDup;
        })
        .map((link, index) => {
            const thumbnail = getGrokThumbnail(link.url);
            const id = `${Date.now()}.${index}.${Math.floor(Math.random() * 10000)}`;
            return {
                id,
                url: link.url,
                title: link.title || 'Untitled AI Image',
                thumbnail,
                tags: finalTags.length > 0 ? finalTags : ['Uncategorized'],
                addedAt: new Date().toISOString()
            };
        });

    const skippedCount = links.length - newLinks.length;
    if (newLinks.length > 0) {
        console.log(`[Bulk Add] Successfully added ${newLinks.length} new items. Skipped ${skippedCount} duplicates.`);
    }
    const updatedData = [...data, ...newLinks];
    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2));
    res.json({ added: newLinks, skippedCount });
});

// PATCH to update link properties (thumbnail, album, title, etc)
app.patch('/api/links/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    let updated = false;
    data = data.map(link => {
        if (link.id === id) {
            updated = true;
            return { ...link, ...updates };
        }
        return link;
    });

    if (!updated) return res.status(404).json({ error: 'Link not found' });

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

// Bulk Delete
app.post('/api/links/bulk-delete', (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'Array of ids required' });

    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data = data.filter(link => !ids.includes(link.id));

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

// Bulk Update (e.g., Change tags)
app.post('/api/links/bulk-patch', (req, res) => {
    const { ids, updates } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'Array of ids required' });

    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data = data.map(link => {
        if (ids.includes(link.id)) {
            return { ...link, ...updates };
        }
        return link;
    });

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

// Export Data
app.get('/api/links/export', (req, res) => {
    res.download(DATA_FILE, 'grok-vault-backup.json');
});

// Import Data
app.post('/api/links/import', (req, res) => {
    const { data } = req.body;
    if (!Array.isArray(data)) return res.status(400).json({ error: 'Valid links array required' });

    // Simple validation
    const isValid = data.every(item => item.url && item.id);
    if (!isValid) return res.status(400).json({ error: 'Invalid data format' });

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, count: data.length });
});

// Global Tag Rename
app.post('/api/tags/rename', (req, res) => {
    const { oldTag, newTag } = req.body;
    if (!oldTag || !newTag) return res.status(400).json({ error: 'Old and new tag names required' });

    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    let changed = false;
    data = data.map(link => {
        if (link.tags && link.tags.includes(oldTag)) {
            link.tags = link.tags.map(t => t === oldTag ? newTag : t);
            // Remove duplicates if newTag already exists in the array
            link.tags = Array.from(new Set(link.tags));
            changed = true;
        }
        return link;
    });

    if (changed) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
    res.json({ success: true, changed });
});

// Global Tag Delete
app.post('/api/tags/delete', (req, res) => {
    const { tag } = req.body;
    if (!tag) return res.status(400).json({ error: 'Tag name required' });

    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    let changed = false;
    data = data.map(link => {
        if (link.tags && link.tags.includes(tag)) {
            link.tags = link.tags.filter(t => t !== tag);
            changed = true;
        }
        return link;
    });

    if (changed) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
    res.json({ success: true, changed });
});

// Local Thumbnail Backup logic
const downloadImage = async (url, photoId) => {
    const dest = path.join(PHOTOS_DIR, `${photoId}.jpg`);
    if (fs.existsSync(dest)) return `/thumbnails/VaultPhotos/${photoId}.jpg`;

    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer',
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Referer': 'https://grok.com/'
            }
        });

        fs.writeFileSync(dest, Buffer.from(response.data));
        console.log(`[Backup] Saved: VaultPhotos/${photoId}.jpg`);
        return `/thumbnails/VaultPhotos/${photoId}.jpg`;
    } catch (err) {
        console.error(`[Backup] Error downloading ${url}:`, err.message);
        return null;
    }
};

app.get('/api/download-proxy', async (req, res) => {
    const { url, filename } = req.query;
    if (!url) return res.status(400).send('URL required');

    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Referer': 'https://grok.com/'
            }
        });

        res.setHeader('Content-Disposition', `attachment; filename="${filename || 'image.jpg'}"`);
        res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
        response.data.pipe(res);
    } catch (err) {
        console.error('[Proxy Download] Error:', err.message);
        res.status(500).send('Failed to download image');
    }
});

app.post('/api/backup-thumbnail', async (req, res) => {
    const { id, url } = req.body;
    if (!id || !url) return res.status(400).json({ error: 'ID and URL required' });

    const localUrl = await downloadImage(url, id);
    if (localUrl) {
        // Safe update pattern: Read fresh data right before atomic-like operation
        try {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            const data = JSON.parse(raw);
            const updatedData = data.map(link => link.id === id ? { ...link, thumbnail: localUrl } : link);
            fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2));
            res.json({ success: true, localUrl });
        } catch (err) {
            console.error('[Backup] JSON Update Error:', err.message);
            res.status(500).json({ error: 'Failed to update database' });
        }
    } else {
        res.status(500).json({ error: 'Failed to download image' });
    }
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
