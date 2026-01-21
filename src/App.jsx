import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Plus, ExternalLink, RefreshCw, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const API_URL = 'http://localhost:3002/api';

export default function App() {
    const [links, setLinks] = useState([]);
    const [search, setSearch] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [isBlurred, setIsBlurred] = useState(true);
    const [newAlbum, setNewAlbum] = useState('');
    const [albumFilter, setAlbumFilter] = useState('ALL');
    const [activeGrokUrl, setActiveGrokUrl] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);


    // Selection State
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [selectionRect, setSelectionRect] = useState(null); // { x1, y1, x2, y2 }
    const [isSelecting, setIsSelecting] = useState(false);
    const gridRef = React.useRef(null);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/links`);
            setLinks(Array.isArray(data) ? [...data].reverse() : []);
        } catch (err) {
            console.error('Failed to fetch links', err);
        }
    };

    const addLink = async (e) => {
        if (e) e.preventDefault();
        if (!newUrl.trim()) return;

        const lines = newUrl.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'));
        if (lines.length === 0) {
            alert("找不到有效的 http 連結！");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/links/bulk`, {
                links: lines.map(url => ({ url })),
                album: newAlbum.trim() || '未分類'
            });
            setNewUrl('');
            setNewAlbum('');
            fetchLinks();
        } catch (err) {
            console.error('Failed to add links', err);
        } finally {
            setLoading(false);
        }
    };

    const updateLink = async (id, updates) => {
        try {
            await axios.patch(`${API_URL}/links/${id}`, updates);
            fetchLinks();
        } catch (err) {
            console.error('Failed to update link', err);
        }
    };

    const editAlbum = (id, currentAlbum) => {
        const name = prompt("輸入新的專輯名稱：", currentAlbum || '未分類');
        if (name !== null) {
            updateLink(id, { album: name.trim() || '未分類' });
        }
    };

    const bulkUpdateAlbum = async () => {
        if (selectedIds.size === 0) return;
        const name = prompt(`為選中的 ${selectedIds.size} 個項目輸入新的專輯名稱：`, "美女");
        if (name !== null) {
            try {
                await axios.post(`${API_URL}/links/bulk-patch`, {
                    ids: Array.from(selectedIds),
                    updates: { album: name.trim() || '未分類' }
                });
                setSelectedIds(new Set());
                fetchLinks();
            } catch (err) {
                console.error('Failed to bulk update album', err);
            }
        }
    };

    const bulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (confirm(`確定要刪除選中的 ${selectedIds.size} 個項目嗎？`)) {
            try {
                await axios.post(`${API_URL}/links/bulk-delete`, {
                    ids: Array.from(selectedIds)
                });
                setSelectedIds(new Set());
                fetchLinks();
            } catch (err) {
                console.error('Failed to bulk delete', err);
            }
        }
    };

    const onMouseDown = (e) => {
        // Only start selection if clicking empty space or the grid background
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('textarea')) return;

        const rect = gridRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsSelecting(true);
        setSelectionRect({ x1: x, y1: y, x2: x, y2: y });
        if (!e.shiftKey) setSelectedIds(new Set());
    };

    const onMouseMove = (e) => {
        if (!isSelecting) return;

        const rect = gridRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setSelectionRect(prev => ({ ...prev, x2: x, y2: y }));

        // Calculate overlapping elements
        const currentRect = {
            left: Math.min(selectionRect.x1, x),
            top: Math.min(selectionRect.y1, y),
            right: Math.max(selectionRect.x1, x),
            bottom: Math.max(selectionRect.y1, y)
        };

        const cards = gridRef.current.querySelectorAll('[data-id]');
        const newSelected = new Set(e.shiftKey ? selectedIds : []);

        cards.forEach(card => {
            const crect = {
                left: card.offsetLeft,
                top: card.offsetTop,
                right: card.offsetLeft + card.offsetWidth,
                bottom: card.offsetTop + card.offsetHeight
            };

            const overlap = !(crect.left > currentRect.right ||
                crect.right < currentRect.left ||
                crect.top > currentRect.bottom ||
                crect.bottom < currentRect.top);

            if (overlap) {
                newSelected.add(card.getAttribute('data-id'));
            }
        });

        setSelectedIds(newSelected);
    };

    const onMouseUp = () => {
        setIsSelecting(false);
        setSelectionRect(null);
    };

    const handleExternalDrop = async (e, id) => {
        e.preventDefault();
        let imgUrl = null;

        // 1. Try common direct URL flavors
        const dUrl = e.dataTransfer.getData('URL');
        const dUriList = e.dataTransfer.getData('text/uri-list');
        const dPlain = e.dataTransfer.getData('text/plain');

        // 2. Try HTML flavor (often contains <img> tag with src)
        const dHtml = e.dataTransfer.getData('text/html');

        if (dUrl && dUrl.startsWith('http')) imgUrl = dUrl;
        else if (dUriList && dUriList.startsWith('http')) imgUrl = dUriList.split('\n')[0];
        else if (dPlain && dPlain.startsWith('http')) imgUrl = dPlain;
        else if (dHtml) {
            // Extract src from <img src="...">
            const match = dHtml.match(/src\s*=\s*["']?([^"'\s>]+)["']?/i);
            if (match && match[1].startsWith('http')) imgUrl = match[1];
        }

        if (imgUrl) {
            updateLink(id, { thumbnail: imgUrl });
        } else {
            console.warn('Drop failed. Available flavors:', e.dataTransfer.types);
            alert("獲取圖片網址失敗！\n\n提示：請嘗試「右鍵點擊圖片 -> 複製圖片位址」，然後手動貼上。");
        }
    };

    const updateThumbnail = (id, currentUrl) => {
        setActiveGrokUrl(currentUrl);
        // Open a well-sized external window that acts as a sidebar
        const width = 500;
        const height = window.screen.height - 100;
        const left = window.screen.width - width - 50;
        window.open(currentUrl, `grok_${id}`, `width=${width},height=${height},left=${left},top=50`);
        console.log(`Launched external Grok window for card ${id}`);
    };


    const albums = useMemo(() => {
        const list = Array.from(new Set(links.map(l => l.album || '未分類')));
        return ['ALL', ...list];
    }, [links]);

    const filteredLinks = useMemo(() => {
        return links.filter(link => {
            const matchesSearch = link.url.toLowerCase().includes(search.toLowerCase()) ||
                link.title.toLowerCase().includes(search.toLowerCase()) ||
                (link.album && link.album.toLowerCase().includes(search.toLowerCase()));
            const matchesAlbum = albumFilter === 'ALL' || link.album === albumFilter;
            return matchesSearch && matchesAlbum;
        });
    }, [links, search, albumFilter]);

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-7xl mx-auto">


                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-bold tracking-tight text-white">
                            Grok Imagine AI Vault
                        </h1>
                        <p className="text-zinc-500 mt-2 font-medium">優雅地保存與管理你的 Grok 創作</p>
                    </motion.div>

                    {/* Search & Add Bar */}
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="搜尋連結或標題..."
                                className="pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-700 w-full md:w-64 transition-all placeholder:text-zinc-600"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <textarea
                                    placeholder="一次貼上多行連結..."
                                    className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-700 flex-1 min-h-[46px] resize-y placeholder:text-zinc-600"
                                    rows="1"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            addLink(e);
                                        }
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="專輯名稱"
                                    className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-700 w-40 placeholder:text-zinc-600"
                                    value={newAlbum}
                                    onChange={(e) => setNewAlbum(e.target.value)}
                                />
                            </div>
                            <button
                                disabled={loading}
                                className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                                onClick={addLink}
                            >
                                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                <span>批量加入</span>
                            </button>
                        </div>

                        {/* Blur Toggle (iOS Style) */}
                        <div className="flex items-center gap-3 bg-slate-800/30 px-4 py-2 rounded-2xl border border-slate-700/30 glass">
                            <span className="text-sm font-medium text-slate-400">隱私模糊</span>
                            <button
                                onClick={() => setIsBlurred(!isBlurred)}
                                className={cn(
                                    "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none",
                                    isBlurred ? "bg-emerald-500" : "bg-slate-600"
                                )}
                            >
                                <motion.div
                                    animate={{ x: isBlurred ? 22 : 2 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Album Filter Bar */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {albums.map(album => (
                        <button
                            key={album}
                            onClick={() => setAlbumFilter(album)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                albumFilter === album
                                    ? "bg-white text-black shadow-lg"
                                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"
                            )}
                        >
                            {album === 'ALL' ? '全部產品' : album}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid Container with Selection Logic */}
                <div
                    ref={gridRef}
                    className="relative select-none"
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                >
                    {/* Selection Overlay */}
                    {selectionRect && (
                        <div
                            className="absolute border border-blue-500 bg-blue-500/10 pointer-events-none z-50"
                            style={{
                                left: Math.min(selectionRect.x1, selectionRect.x2),
                                top: Math.min(selectionRect.y1, selectionRect.y2),
                                width: Math.abs(selectionRect.x2 - selectionRect.x1),
                                height: Math.abs(selectionRect.y2 - selectionRect.y1)
                            }}
                        />
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredLinks.map((link) => (
                                <motion.div
                                    key={link.id}
                                    data-id={link.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onDragOver={(e) => { e.preventDefault(); setDragOverId(link.id); }}
                                    onDragLeave={() => setDragOverId(null)}
                                    onDrop={(e) => { setDragOverId(null); handleExternalDrop(e, link.id); }}
                                    className={cn(
                                        "group relative bg-zinc-900 rounded-2xl overflow-hidden border transition-all duration-300",
                                        selectedIds.has(link.id)
                                            ? "border-white ring-1 ring-white/50 scale-[1.02]"
                                            : dragOverId === link.id
                                                ? "border-emerald-500 ring-2 ring-emerald-500/20 scale-[1.05] z-40"
                                                : "border-zinc-800 hover:border-zinc-700"
                                    )}
                                >
                                    {/* Selection Checkbox (Visible on hover or if selected) */}
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newSelected = new Set(selectedIds);
                                            if (newSelected.has(link.id)) newSelected.delete(link.id);
                                            else newSelected.add(link.id);
                                            setSelectedIds(newSelected);
                                        }}
                                        className={cn(
                                            "absolute top-3 left-3 z-30 w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all",
                                            selectedIds.has(link.id)
                                                ? "bg-blue-500 border-blue-500"
                                                : "bg-black/20 border-white/30 opacity-0 group-hover:opacity-100"
                                        )}
                                    >
                                        {selectedIds.has(link.id) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                    </div>

                                    {/* Thumbnail Area */}
                                    <div className="aspect-square bg-slate-900 flex items-center justify-center overflow-hidden relative">
                                        {link.thumbnail ? (
                                            <div className={cn("w-full h-full transition-all duration-700", isBlurred && "blur-xl scale-110")}>
                                                <img
                                                    src={link.thumbnail}
                                                    alt={link.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-slate-600">
                                                <ImageIcon className="w-12 h-12 opacity-20" />
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateThumbnail(link.id, link.url); }}
                                                    className="text-xs px-3 py-1.5 bg-slate-800 rounded-full hover:bg-slate-700 hover:text-slate-300 transition-colors"
                                                >
                                                    獲取縮圖
                                                </button>
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-400 transition-colors"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateThumbnail(link.id, link.url); }}
                                                className="p-3 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition-colors"
                                            >
                                                <RefreshCw className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-semibold text-zinc-100 truncate flex-1">{link.title}</h3>
                                            <button
                                                onClick={() => editAlbum(link.id, link.album)}
                                                className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-zinc-500 hover:text-white transition-colors"
                                            >
                                                {link.album || '未分類'}
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Grok Imagine</span>
                                            <span className="text-[10px] text-slate-600">{new Date(link.addedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Batch Action Toolbar */}
                <AnimatePresence>
                    {selectedIds.size > 0 && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-6 py-4 bg-slate-900/90 border border-slate-700 rounded-2xl glass shadow-2xl"
                        >
                            <span className="text-sm font-semibold text-blue-400 border-r border-slate-700 pr-4 mr-2">
                                已選取 {selectedIds.size} 個項目
                            </span>
                            <button
                                onClick={bulkUpdateAlbum}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
                            >
                                <span className="w-4 h-4 text-emerald-400 opacity-80">🏷️</span>
                                批量編輯專輯
                            </button>
                            <button
                                onClick={bulkDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-sm font-medium transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                批量刪除
                            </button>
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="px-4 py-2 text-slate-500 hover:text-slate-300 text-sm"
                            >
                                取消
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grok Activation Panel */}
                <AnimatePresence>
                    {activeGrokUrl && (
                        <motion.div
                            initial={{ x: 600, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 600, opacity: 0 }}
                            className="fixed top-24 right-8 w-80 z-[200] bg-slate-900/90 border border-slate-700 rounded-3xl overflow-hidden shadow-3xl glass p-6 flex flex-col gap-4"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-blue-400">Grok 助手已開啟</h3>
                                <button
                                    onClick={() => setActiveGrokUrl(null)}
                                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed">
                                由於 Grok 的安全限制，我們已為你在新視窗中打開頁面。
                            </p>

                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                                <ol className="text-xs text-slate-300 space-y-3 list-decimal list-inside">
                                    <li>在彈出的視窗中完成驗證</li>
                                    <li>將圖片**直接拖拽**回下方的卡片</li>
                                    <li>或是複製「圖片位址」後在此處更新</li>
                                </ol>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        const imgUrl = prompt("請貼上圖片位址：");
                                        if (imgUrl) {
                                            const id = links.find(l => l.url === activeGrokUrl)?.id;
                                            if (id) updateLink(id, { thumbnail: imgUrl });
                                        }
                                    }}
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    手動貼上圖片網址
                                </button>
                                <button
                                    onClick={() => updateThumbnail('relaunch', activeGrokUrl)}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/40"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    重新彈出視窗
                                </button>
                            </div>

                            <p className="text-[10px] text-center text-slate-600 mt-2">
                                💡 提示：將兩邊視窗並排會更好操作
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {filteredLinks.length === 0 && (
                    <div className="text-center py-24">
                        <div className="inline-block p-6 bg-slate-800/30 rounded-3xl mb-4">
                            <Search className="w-12 h-12 text-slate-700" />
                        </div>
                        <p className="text-slate-500 text-lg">找不到任何連結，嘗試增加一些吧！</p>
                    </div>
                )}
            </div>
        </div>
    );
}
