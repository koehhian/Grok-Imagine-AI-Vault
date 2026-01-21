import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;
const DATA_FILE = path.join(__dirname, 'data', 'links.json');

app.use(cors());
app.use(bodyParser.json());

if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Robust Grok Thumbnail Extractor
const getGrokThumbnail = (url) => {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/post\/([a-z0-9-]+)/i);
    if (match && match[1]) {
        return `https://imagine-public.x.ai/imagine-public/images/${match[1]}.jpg`;
    }
    return null;
};

app.get('/api/links', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
});

app.post('/api/links', (req, res) => {
    const { url, title } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    // Deduplication check
    if (data.some(link => link.url === url)) {
        console.log(`[Add Link] Duplicate URL skipped: ${url}`);
        return res.status(409).json({ error: 'URL already exists' });
    }

    const thumbnail = getGrokThumbnail(url);
    if (thumbnail) console.log(`[Add Link] Auto-generated thumbnail for Grok link: ${thumbnail}`);

    const newLink = {
        id: Date.now().toString(),
        url,
        title: title || 'Untitled AI Image',
        thumbnail,
        addedAt: new Date().toISOString()
    };
    data.push(newLink);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newLink);
});

app.post('/api/links/bulk', (req, res) => {
    const { links, album } = req.body;
    if (!Array.isArray(links)) return res.status(400).json({ error: 'Array of links required' });

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const existingUrls = new Set(data.map(l => l.url));

    const newLinks = links
        .filter(link => {
            const isDup = existingUrls.has(link.url);
            if (isDup) console.log(`[Bulk Add] Skipping duplicate: ${link.url}`);
            return !isDup;
        })
        .map((link, index) => {
            const thumbnail = getGrokThumbnail(link.url);
            const id = `${Date.now()}.${index}.${Math.floor(Math.random() * 10000)}`;
            if (thumbnail) {
                console.log(`[Bulk Add] Auto-generated thumbnail for index ${index}: ${thumbnail}`);
            } else {
                console.log(`[Bulk Add] No thumbnail pattern found for: ${link.url}`);
            }
            return {
                id,
                url: link.url,
                title: link.title || 'Untitled AI Image',
                thumbnail,
                album: album || '未分類',
                addedAt: new Date().toISOString()
            };
        });

    if (newLinks.length > 0) {
        console.log(`[Bulk Add] Successfully added ${newLinks.length} new items.`);
    }
    const updatedData = [...data, ...newLinks];
    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2));
    res.json(newLinks);
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

// Bulk Update (e.g., Change album)
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



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
