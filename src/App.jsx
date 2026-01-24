import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Plus, ExternalLink, RefreshCw, Trash2, Image as ImageIcon, Languages, Globe, Tag, Check, CheckSquare, X, ChevronDown, MoreHorizontal, Edit2, Download, Upload, ArrowUpDown, Settings, Maximize2, Maximize, ChevronLeft, ChevronRight, Play, Film, Shield, Database, Stars, Aperture, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const API_URL = `http://${window.location.hostname}:3002/api`;

// Auto-detect if running on GitHub Pages or Vercel or explicitly set
const IS_DEMO = typeof window !== 'undefined' && (
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('vercel.app')
);

// Mock Data for Demo
const DEMO_INITIAL_DATA = [
    {
        id: 'demo_1',
        url: 'https://grok.com/imagine/post/698a6a44-ac3b-449a-b2b4-0ee33ccdb803',
        title: 'Cyberpunk Portrait',
        thumbnail: 'https://imagine-public.x.ai/imagine-public/images/698a6a44-ac3b-449a-b2b4-0ee33ccdb803.jpg',
        tags: ['Demo', 'Portrait'],
        addedAt: new Date().toISOString(),
        derivatives: [
            { id: 'd1', type: 'video', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/698a6a44-ac3b-449a-b2b4-0ee33ccdb803.jpg', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { id: 'd2', type: 'photo', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/a4dba2ee-6654-4f7a-985c-3d964473394d.jpg', url: 'https://grok.com/p1' },
            { id: 'd3', type: 'video', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/740a1af2-da7e-4a28-8327-1d05e5c17c91.jpg', url: 'https://www.w3schools.com/html/movie.mp4' },
            { id: 'd4', type: 'photo', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/56d72a94-0687-41eb-ab68-5c26665ebc78.jpg', url: 'https://grok.com/p2' },
            { id: 'd5', type: 'video', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/6f620019-1bd9-45bb-b5f4-2c2f65209be6.jpg', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
    },
    { id: 'demo_2', url: 'https://grok.com/imagine/post/a4dba2ee-6654-4f7a-985c-3d964473394d', title: 'Futuristic Landscape', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/a4dba2ee-6654-4f7a-985c-3d964473394d.jpg', tags: ['Demo'], addedAt: new Date(Date.now() - 1000).toISOString() },
    { id: 'demo_3', url: 'https://grok.com/imagine/post/740a1af2-da7e-4a28-8327-1d05e5c17c91', title: 'Anime Aesthetic', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/740a1af2-da7e-4a28-8327-1d05e5c17c91.jpg', tags: ['Demo'], addedAt: new Date(Date.now() - 2000).toISOString() },
    { id: 'demo_4', url: 'https://grok.com/imagine/post/56d72a94-0687-41eb-ab68-5c26665ebc78', title: 'Dreamy Scene', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/56d72a94-0687-41eb-ab68-5c26665ebc78.jpg', tags: ['Demo'], addedAt: new Date(Date.now() - 3000).toISOString() },
    { id: 'demo_5', url: 'https://grok.com/imagine/post/6f620019-1bd9-45bb-b5f4-2c2f65209be6', title: 'Mystical Art', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/6f620019-1bd9-45bb-b5f4-2c2f65209be6.jpg', tags: ['Demo'], addedAt: new Date(Date.now() - 4000).toISOString() },
    { id: 'demo_6', url: 'https://grok.com/imagine/post/d077c377-ad12-449d-bd43-abacf2674b80', title: 'Sci-Fi Architecture', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/d077c377-ad12-449d-bd43-abacf2674b80.jpg', tags: ['Demo'], addedAt: new Date(Date.now() - 5000).toISOString() },
    { id: 'demo_7', url: 'https://grok.com/imagine/post/e87e6394-78e7-43be-98c7-07091adbcfa4', title: 'Grok Bear', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/e87e6394-78e7-43be-98c7-07091adbcfa4.jpg', tags: ['Demo', 'Bear'], addedAt: new Date(Date.now() - 6000).toISOString() },
    { id: 'demo_8', url: 'https://grok.com/imagine/post/ea2bc771-5d90-4a1f-81a4-4b29aa69bc84', title: 'Space Bear', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/ea2bc771-5d90-4a1f-81a4-4b29aa69bc84.jpg', tags: ['Demo', 'Bear'], addedAt: new Date(Date.now() - 7000).toISOString() },
    { id: 'demo_9', url: 'https://grok.com/imagine/post/07f3971d-3b35-4343-a69d-544ace685fda', title: 'Ocean Bear', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/07f3971d-3b35-4343-a69d-544ace685fda.jpg', tags: ['Demo', 'Bear'], addedAt: new Date(Date.now() - 8000).toISOString() },
    { id: 'demo_10', url: 'https://grok.com/imagine/post/3137e8f3-0ccb-4462-a0f4-9d804a388069', title: 'Tech Bear', thumbnail: 'https://imagine-public.x.ai/imagine-public/images/3137e8f3-0ccb-4462-a0f4-9d804a388069.jpg', tags: ['Demo', 'Bear'], addedAt: new Date(Date.now() - 9000).toISOString() },
];

/**
 * Data Storage Adapter
 * Abstracts the difference between local backend (axios) and GitHub Pages (localStorage)
 */

const TRANSLATIONS = {
    'en': {
        title: 'Grok Imagine AI Vault',
        subtitle: 'Elegantly save and manage your Grok creations',
        searchPlaceholder: 'Search links, titles, or tags...',
        bulkAddPlaceholder: 'Paste multiple links at once...',
        tagPlaceholder: 'Tags (comma separated)',
        bulkAdd: 'Bulk Add',
        privacyBlur: 'Privacy Blur',
        allProducts: 'All Items',
        uncategorized: 'Untagged',
        selectedCount: '{count} items selected',
        bulkEditTags: 'Bulk Edit Tags',
        bulkDelete: 'Bulk Delete',
        cancel: 'Cancel',
        getThumbnail: 'Get Thumbnail',
        grokHelperTitle: 'Grok Helper Active',
        grokHelperDesc: 'Due to Grok safety constraints, we opened the page in a new window.',
        grokHelperSteps: [
            'Complete verification in the popup window',
            'Drag & drop images back to the cards below',
            'Or copy "Image Address" and paste it here'
        ],
        manualPaste: 'Paste Image URL',
        relaunch: 'Relaunch Window',
        helperTip: '💡 Tip: Side-by-side windows work best',
        noLinks: 'No links found, try adding some!',
        newTagsPrompt: 'Enter new tags (split by comma):',
        bulkTagsPrompt: 'Enter new tags for {count} items:',
        deleteConfirm: 'Are you sure you want to delete {count} selected items?',
        getThumbPrompt: 'Please paste image address:',
        importSuccess: 'Imported {count} items successfully!',
        importError: 'Failed to import data.',
        sortBy: 'Sort By',
        newest: 'Newest',
        oldest: 'Oldest',
        titleAz: 'Title (A-Z)',
        tagManager: 'Tag Manager',
        renameTag: 'Rename Tag',
        deleteTag: 'Delete Tag',
        globalRenamePrompt: 'Rename tag "{tag}" to:',
        globalDeleteConfirm: 'Are you sure you want to delete tag "{tag}" from all items?',
        exportSuccess: 'Data exported to your system\'s default download folder.',
        selectAll: 'Select All',
        deselectAll: 'Deselect All',
        settings: 'Settings',
        localBackup: 'Local Image Backup',
        defaultBlur: 'Default Privacy Blur',
        backupAll: 'Download All Images to Computer',
        backupAllDesc: 'Download all CDN images to your system folder',
        localBackupDesc: 'Automatically download thumbnails to local storage',
        defaultBlurDesc: 'Always start with privacy blur enabled',
        pipPreview: 'Mini Preview',
        openExternal: 'Open in Grok',
        fullscreen: 'Fullscreen View',
        addedItems: 'Added {count} new items.',
        skippedDuplicates: '{count} duplicates skipped.',
        backingUp: 'Downloading {current}/{total}...',
        lanAccess: 'LAN Access',
        lanAccessDesc: 'Allow other devices on your Wi-Fi to access this vault',
        lanAddress: 'Local Address',
        systemDownloads: 'Saves to system Downloads folder',
        importData: 'Import Vault (JSON)',
        exportData: 'Export Vault (JSON)',
        dataManagement: 'Data Management',
        privacy: 'Privacy',
        backup: 'Backup',
        network: 'Network'
    },
    'zh-cn': {
        title: 'Grok Imagine AI Vault',
        subtitle: '优雅地保存与管理你的 Grok 創作',
        searchPlaceholder: '搜索链接、标题或标签...',
        bulkAddPlaceholder: '一次粘贴多行链接...',
        tagPlaceholder: '标签 (以逗号分隔)',
        bulkAdd: '批量加入',
        privacyBlur: '隐私模糊',
        allProducts: '全部项目',
        uncategorized: '未分类',
        selectedCount: '已选取 {count} 個項目',
        bulkEditTags: '批量编辑标签',
        bulkDelete: '批量刪除',
        cancel: '取消',
        getThumbnail: '获取缩略图',
        grokHelperTitle: 'Vault 助手已开启',
        grokHelperDesc: '由于 Grok 的安全限制，我們已为您在新窗口中打开页面。',
        grokHelperSteps: [
            '在弹出的窗口中完成验证',
            '将图片**直接拖拽**回下方的卡片',
            '或是复制“图片地址”后在此处更新'
        ],
        manualPaste: '手动粘贴图片地址',
        relaunch: '重新弹出窗口',
        helperTip: '💡 提示：将两边窗口并排會更好操作',
        noLinks: '找不到任何链接，尝试增加一些吧！',
        newTagsPrompt: '输入新的标签（用逗号分隔）：',
        bulkTagsPrompt: '为选中的 {count} 个项目输入新的标签：',
        deleteConfirm: '确定要删除选中的 {count} 個項目吗？',
        getThumbPrompt: '请粘贴图片地址：',
        importSuccess: '成功导入 {count} 个项目！',
        importError: '导入数据失败。',
        sortBy: '排序',
        newest: '最新加入',
        oldest: '最早加入',
        titleAz: '标题 (A-Z)',
        tagManager: '标签管理',
        renameTag: '重命名标签',
        deleteTag: '删除标签',
        globalRenamePrompt: '将标签 "{tag}" 重命名为：',
        globalDeleteConfirm: '确定要从所有项目中删除标签 "{tag}" 吗？',
        exportSuccess: '数据已导出至系统默认下载文件夹。',
        selectAll: '全选',
        deselectAll: '取消全選',
        settings: '设置',
        localBackup: '图片本地备份',
        defaultBlur: '默认隐私模糊',
        backupAll: '下载所有图片到电脑',
        backupAllDesc: '将所有 CDN 图片下载到您的系统下载文件夹',
        localBackupDesc: '加入链接的同时将图片下载到本地空间。',
        defaultBlurDesc: '启动时默认开启隐私模糊',
        pipPreview: '迷你预览',
        openExternal: '在 Grok 中开启',
        fullscreen: '全屏查看',
        addedItems: '已添加 {count} 個新项目。',
        skippedDuplicates: '已略过 {count} 个重复链接。',
        backingUp: '正在下载 {current}/{total}...',
        lanAccess: '区域网络访问',
        lanAccessDesc: '允许同一 Wi-Fi 下的其他设备访问此保管库',
        lanAddress: '局域网地址',
        systemDownloads: '保存至系统下载文件夹',
        importData: '导入保管库 (JSON)',
        exportData: '导出保管库 (JSON)',
        dataManagement: '数据管理',
        privacy: '隐私',
        backup: '备份',
        network: '网络'
    },
    'zh-tw': {
        title: 'Grok Imagine AI Vault',
        subtitle: '優雅地保存與管理你的 Grok 創作',
        searchPlaceholder: '搜尋連結、標題或標籤...',
        bulkAddPlaceholder: '一次貼上多行連結...',
        tagPlaceholder: '標籤 (以逗號分隔)',
        bulkAdd: '批量加入',
        privacyBlur: '隱私模糊',
        allProducts: '全部項目',
        uncategorized: '未分類',
        selectedCount: '已選取 {count} 個項目',
        bulkEditTags: '批量編輯標籤',
        bulkDelete: '批量刪除',
        cancel: '取消',
        getThumbnail: '獲取縮圖',
        grokHelperTitle: 'Vault 助手已開啟',
        grokHelperDesc: '由於 Grok 的安全限制，我們已為你在新視窗中打開頁面。',
        grokHelperSteps: [
            '在彈出的視窗中完成驗證',
            '將圖片**直接拖拽**回下方的卡片',
            '或是複製「圖片位址」後在此處更新'
        ],
        manualPaste: '手動貼上圖片網址',
        relaunch: '重新彈出視窗',
        helperTip: '💡 提示：將兩邊視窗並排會更好操作',
        noLinks: '找不到任何連結，嘗試增加一些吧！',
        newTagsPrompt: '輸入新的標籤 (以逗號分隔)：',
        bulkTagsPrompt: '為選中的 {count} 個項目輸入新的標籤：',
        deleteConfirm: '確定要刪除選中的 {count} 個項目嗎？',
        getThumbPrompt: '請貼上圖片位址：',
        importSuccess: '成功匯入 {count} 個項目！',
        importError: '匯入數據失敗。',
        sortBy: '排序方式',
        newest: '最新加入',
        oldest: '最早加入',
        titleAz: '標題 (A-Z)',
        tagManager: '標籤管理',
        renameTag: '重新命名標籤',
        deleteTag: '刪除標籤',
        globalRenamePrompt: '將標籤「{tag}」重新命名為：',
        globalDeleteConfirm: '確定要從所有項目中刪除標籤「{tag}」嗎？',
        exportSuccess: '資料已匯出至系統預設下載資料夾。',
        selectAll: '全選',
        deselectAll: '取消全選',
        settings: '設置',
        localBackup: '圖片本地備份',
        defaultBlur: '預設隱私模糊',
        backupAll: '下載所有圖片到電腦',
        backupAllDesc: '將所有 CDN 圖片下載到您的系統下載資料夾',
        localBackupDesc: '加入連結的同時將圖片下載到本地空間。',
        defaultBlurDesc: '啟動時預設開啟隱私模糊',
        pipPreview: '子母畫面預覽',
        openExternal: '在 Grok 中開啟',
        fullscreen: '全螢幕查看',
        addedItems: '已加入 {count} 個新項目。',
        skippedDuplicates: '已略過 {count} 個重複連結。',
        backingUp: '正在下載 {current}/{total}...',
        lanAccess: '區域網路存取',
        lanAccessDesc: '允許同一 Wi-Fi 下的其他裝置存取此保管庫',
        lanAddress: '區域網址',
        systemDownloads: '儲存至系統下載資料夾',
        importData: '匯入保管庫 (JSON)',
        exportData: '匯出保管庫 (JSON)',
        dataManagement: '數據管理',
        privacy: '隱私',
        backup: '備份',
        network: '網路'
    },
    'ja': {
        title: 'Grok Imagine AI Vault',
        subtitle: 'Grokの作品をエレガントに保存・管理',
        searchPlaceholder: 'リンク、タイトル、タグを検索...',
        bulkAddPlaceholder: '複数のリンクを一度に貼り付け...',
        tagPlaceholder: 'タグ（カンマ区切り）',
        bulkAdd: '一括追加',
        privacyBlur: 'プライバシーぼかし',
        allProducts: 'すべての項目',
        uncategorized: '未分類',
        selectedCount: '{count} 個の項目を選択中',
        bulkEditTags: 'タグを一括編集',
        bulkDelete: '一括削除',
        cancel: 'キャンセル',
        getThumbnail: 'サムネイル取得',
        grokHelperTitle: 'Grokヘルパー起動中',
        grokHelperDesc: 'Grokの制限により、新しいウィンドウでページを開きました。',
        grokHelperSteps: [
            'ポップアップウィンドウで認証を完了',
            '画像を下のカードにドラッグ＆ドロップ',
            'または「画像アドレスをコピー」してここに貼り付け'
        ],
        manualPaste: '画像URLを貼り付け',
        relaunch: 'ウィンドウを再表示',
        helperTip: '💡 ヒント：ウィンドウを並べて操作するのが最適です',
        noLinks: 'リンクが見つかりません。追加してみましょう！',
        newTagsPrompt: '新しいタグを入力（カンマ区切り）：',
        bulkTagsPrompt: '{count} 個の項目に新しいタグを入力：',
        deleteConfirm: '選択した {count} 個の項目を削除してもよろしいですか？',
        getThumbPrompt: '画像アドレスを貼り付けてください：',
        importSuccess: '{count} 個の項目を読み込みました！',
        importError: '読み込みに失敗しました。',
        sortBy: '並び替え',
        newest: '新しい順',
        oldest: '古い順',
        titleAz: 'タイトル (A-Z)',
        tagManager: 'タグ管理',
        renameTag: 'タグ名を変更',
        deleteTag: 'タグを削除',
        globalRenamePrompt: 'タグ「{tag}」を以下に変更：',
        globalDeleteConfirm: 'すべての項目からタグ「{tag}」を削除してもよろしいですか？',
        exportSuccess: 'データはシステムのデフォルトのダウンロードフォルダにエクスポートされました。',
        selectAll: 'すべて選択',
        deselectAll: '選択解除',
        settings: '設定',
        localBackup: '画像のローカルバックアップ',
        defaultBlur: 'デフォルトのプライバシーぼかし',
        backupAll: 'すべての画像をコンピュータにダウンロード',
        backupAllDesc: 'すべてのCDN画像をシステムのダウンロードフォルダに保存します',
        localBackupDesc: 'サムネイルをローカルストレージに自動保存',
        defaultBlurDesc: '起動時にプライバシーぼかしを有効にする',
        pipPreview: 'ミニプレビュー',
        openExternal: 'Grok で開く',
        fullscreen: 'フルスクリーン表示',
        addedItems: '{count} 個の新しい項目を追加しました。',
        skippedDuplicates: '{count} 個の重複リンクをスキップしました。',
        backingUp: 'ダウンロード中 {current}/{total}...',
        lanAccess: 'LAN アクセス',
        lanAccessDesc: '同じ Wi-Fi 內の其他デバイスからのアクセスを許可',
        lanAddress: 'ローカルアドレス',
        systemDownloads: 'システムのダウンロードフォルダに保存されます',
        importData: '保管庫をインポート (JSON)',
        exportData: '保管庫をエクスポート (JSON)',
        dataManagement: 'データ管理',
        privacy: 'プライバシー',
        backup: 'バックアップ',
        network: 'ネットワーク'
    }
};

const getDynamicApiUrl = (enabled) => {
    if (enabled && typeof window !== 'undefined') {
        return `http://${window.location.hostname}:3002/api`;
    }
    return 'http://localhost:3002/api';
};

function DerivativeFanOut({ derivatives, isActive }) {
    if (!derivatives || derivatives.length === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50">
            <AnimatePresence>
                {isActive && derivatives.map((item, idx) => {
                    // Calculate positions in a radial fan-out
                    const angle = (idx - (derivatives.length - 1) / 2) * 35; // Degrees
                    const distance = 160; // Distance from center

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                x: Math.sin(angle * Math.PI / 180) * distance,
                                y: -Math.cos(angle * Math.PI / 180) * distance - 20
                            }}
                            exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: idx * 0.05 }}
                            className="absolute left-1/2 top-1/2 -ml-10 -mt-10 w-20 h-20 pointer-events-auto"
                        >
                            <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-zinc-900 group/item relative">
                                {item.type === 'video' ? (
                                    <VideoThumbnail url={item.thumbnail} videoUrl={item.url} />
                                ) : (
                                    <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    {item.type === 'video' ? <Play className="w-6 h-6 text-white fill-white" /> : <ExternalLink className="w-6 h-6 text-white" />}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

function VideoThumbnail({ url, videoUrl }) {
    const [hover, setHover] = useState(false);
    const videoRef = React.useRef(null);

    return (
        <div
            className="w-full h-full relative"
            onMouseEnter={() => { setHover(true); videoRef.current?.play(); }}
            onMouseLeave={() => { setHover(false); if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }}
        >
            <img src={url} className={cn("w-full h-full object-cover transition-opacity duration-300", hover ? "opacity-0" : "opacity-100")} alt="" />
            <video
                ref={videoRef}
                src={videoUrl}
                loop
                muted
                playsInline
                preload="none"
                className={cn("absolute inset-0 w-full h-full object-cover transition-opacity duration-300", hover ? "opacity-100" : "opacity-0")}
            />
            <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/10 pointer-events-none group-hover:scale-110 transition-transform">
                <Stars className="w-2.5 h-2.5 text-blue-400" />
            </div>
        </div>
    );
}

export default function App() {
    const [language, setLanguage] = useState('zh-tw');
    const [langOpen, setLangOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const t = (key, params = {}) => {
        const langData = TRANSLATIONS[language] || TRANSLATIONS['en'];
        let text = langData[key] || key;
        Object.keys(params).forEach(p => {
            text = text.replace(`{${p}}`, params[p]);
        });
        return text;
    };

    const showNotification = (message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [{ id, message, type }, ...prev]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const [links, setLinks] = useState([]);
    const [search, setSearch] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [newTags, setNewTags] = useState('');
    const [selectedTags, setSelectedTags] = useState(new Set());
    const [moreTagsOpen, setMoreTagsOpen] = useState(false);
    const [activeGrokUrl, setActiveGrokUrl] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [tempTitle, setTempTitle] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [sortOpen, setSortOpen] = useState(false);
    const [tagManagerOpen, setTagManagerOpen] = useState(false);
    const [fullscreenId, setFullscreenId] = useState(null);
    const [lastSelectedId, setLastSelectedId] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const [lanAccessEnabled, setLanAccessEnabled] = useState(() => {
        return localStorage.getItem('grok_vault_lan_access_enabled') === 'true';
    });
    const [lanIp, setLanIp] = useState('localhost');

    const [defaultBlurEnabled, setDefaultBlurEnabled] = useState(() => {
        return localStorage.getItem('grok_vault_default_blur_enabled') !== 'false';
    });

    const [isBlurred, setIsBlurred] = useState(() => {
        return localStorage.getItem('grok_vault_default_blur_enabled') !== 'false';
    });

    const [backupEnabled, setBackupEnabled] = useState(() => {
        return localStorage.getItem('grok_vault_backup_enabled') === 'true';
    });

    const API_URL = useMemo(() => getDynamicApiUrl(lanAccessEnabled), [lanAccessEnabled]);

    const api = useMemo(() => ({
        getLinks: () => {
            if (IS_DEMO) {
                const stored = localStorage.getItem('grok_vault_links_v1_4');
                if (!stored) {
                    localStorage.setItem('grok_vault_links_v1_4', JSON.stringify(DEMO_INITIAL_DATA));
                    return { data: DEMO_INITIAL_DATA };
                }
                return { data: JSON.parse(stored) };
            }
            return axios.get(`${API_URL}/links`);
        },
        addLink: (url, tags) => {
            if (IS_DEMO) {
                const newItem = {
                    id: Date.now().toString(),
                    url,
                    title: 'Untitled AI Image',
                    tags: tags || [],
                    thumbnail: null,
                    addedAt: new Date().toISOString()
                };
                const stored = JSON.parse(localStorage.getItem('grok_vault_links_v1_4') || '[]');
                const newData = [newItem, ...stored];
                localStorage.setItem('grok_vault_links_v1_4', JSON.stringify(newData));
                return { data: newItem };
            }
            return axios.post(`${API_URL}/links`, { url, tags });
        },
        addBulk: (links, tags) => {
            if (IS_DEMO) {
                const newItems = links.map((l, i) => ({
                    id: (Date.now() + i).toString(),
                    url: l.url,
                    title: 'Untitled AI Image',
                    tags: tags || [],
                    thumbnail: l.thumbnail || null,
                    addedAt: new Date().toISOString()
                }));
                const stored = JSON.parse(localStorage.getItem('grok_vault_links_v1_4') || '[]');
                const newData = [...newItems, ...stored];
                localStorage.setItem('grok_vault_links_v1_4', JSON.stringify(newData));
                return { data: newItems };
            }
            return axios.post(`${API_URL}/links/bulk`, { links, tags });
        },
        updateLink: (id, updates) => {
            if (IS_DEMO) {
                const stored = JSON.parse(localStorage.getItem('grok_vault_links_v1_4') || '[]');
                const newData = stored.map(link => link.id === id ? { ...link, ...updates } : link);
                localStorage.setItem('grok_vault_links_v1_4', JSON.stringify(newData));
                return { data: { success: true } };
            }
            return axios.patch(`${API_URL}/links/${id}`, updates);
        },
        bulkPatch: (ids, updates) => {
            if (IS_DEMO) {
                const stored = JSON.parse(localStorage.getItem('grok_vault_links_v1_4') || '[]');
                const newData = stored.map(link => ids.includes(link.id) ? { ...link, ...updates } : link);
                localStorage.setItem('grok_vault_links_v1_4', JSON.stringify(newData));
                return { data: { success: true } };
            }
            return axios.post(`${API_URL}/links/bulk-patch`, { ids, updates });
        },
        bulkDelete: (ids) => {
            if (IS_DEMO) {
                const stored = JSON.parse(localStorage.getItem('grok_vault_links_v1_4') || '[]');
                const newData = stored.filter(link => !ids.includes(link.id));
                localStorage.setItem('grok_vault_links_v1_4', JSON.stringify(newData));
                return { data: { success: true } };
            }
            return axios.post(`${API_URL}/links/bulk-delete`, { ids });
        },
        globalRenameTag: (oldTag, newTag) => {
            if (IS_DEMO) {
                const stored = JSON.parse(localStorage.getItem('grok_vault_links_v1_4') || '[]');
                let changed = false;
                const newData = stored.map(link => {
                    if (link.tags && link.tags.includes(oldTag)) {
                        link.tags = link.tags.map(t => t === oldTag ? newTag : t);
                        link.tags = Array.from(new Set(link.tags));
                        changed = true;
                    }
                    return link;
                });
                if (changed) localStorage.setItem('grok_vault_links_v1_4', JSON.stringify(newData));
                return { data: { success: true } };
            }
            return axios.post(`${API_URL}/tags/rename`, { oldTag, newTag });
        },
        globalDeleteTag: (tag) => {
            if (IS_DEMO) {
                const stored = JSON.parse(localStorage.getItem('grok_vault_links_v1_4') || '[]');
                let changed = false;
                const newData = stored.map(link => {
                    if (link.tags && link.tags.includes(tag)) {
                        link.tags = link.tags.filter(t => t !== tag);
                        changed = true;
                    }
                    return link;
                });
                if (changed) localStorage.setItem('grok_vault_links_v1_4', JSON.stringify(newData));
                return { data: { success: true } };
            }
            return axios.post(`${API_URL}/tags/delete`, { tag });
        },
        importData: (dataToImport) => {
            if (IS_DEMO) {
                localStorage.setItem('grok_vault_links_v1_4', JSON.stringify(dataToImport));
                return { data: { success: true, count: dataToImport.length } };
            }
            return axios.post(`${API_URL}/links/import`, { data: dataToImport });
        },
        getExportUrl: () => {
            if (IS_DEMO) {
                const stored = localStorage.getItem('grok_vault_links_v1_4') || '[]';
                const blob = new Blob([stored], { type: 'application/json' });
                return URL.createObjectURL(blob);
            }
            return `${API_URL}/links/export`;
        },
        backupThumbnail: (id, url) => {
            if (IS_DEMO) return { data: { success: false, error: 'Backup not supported in demo' } };
            return axios.post(`${API_URL}/backup-thumbnail`, { id, url });
        }
    }), [API_URL]);

    useEffect(() => {
        localStorage.setItem('grok_vault_lan_access_enabled', lanAccessEnabled);
    }, [lanAccessEnabled]);

    useEffect(() => {
        localStorage.setItem('grok_vault_default_blur_enabled', defaultBlurEnabled);
        setIsBlurred(defaultBlurEnabled);
    }, [defaultBlurEnabled]);

    useEffect(() => {
        localStorage.setItem('grok_vault_last_blur_state', isBlurred);
    }, [isBlurred]);

    useEffect(() => {
        localStorage.setItem('grok_vault_backup_enabled', backupEnabled);
    }, [backupEnabled]);




    // Selection State
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [selectionRect, setSelectionRect] = useState(null); // { x1, y1, x2, y2 }
    const [isSelecting, setIsSelecting] = useState(false);
    const gridRef = React.useRef(null);

    useEffect(() => {
        const fetchNetworkInfo = async () => {
            if (lanAccessEnabled && !IS_DEMO) {
                try {
                    const res = await axios.get(`${API_URL}/network-info`);
                    if (res.data && res.data.lanIp) {
                        setLanIp(res.data.lanIp);
                    }
                } catch (err) {
                    console.error('Failed to fetch LAN IP:', err);
                }
            }
        };
        fetchNetworkInfo();
    }, [lanAccessEnabled, API_URL]);

    useEffect(() => {
        fetchLinks();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Cmd+A or Ctrl+A for Select All
            if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                    e.preventDefault();
                    setSelectedIds(new Set(links.map(link => link.id)));
                }
            }
            // Del or Backspace for Delete Selected
            if (selectedIds.size > 0 && (e.key === 'Delete' || e.key === 'Backspace')) {
                if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                    e.preventDefault();
                    bulkDelete();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [links, selectedIds]);

    const handleSelectAll = () => {
        if (selectedIds.size === links.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(links.map(l => l.id)));
        }
    };

    const fetchLinks = async () => {
        try {
            const { data } = await api.getLinks();
            console.log(`Fetched ${data?.length || 0} links`);
            setLinks(Array.isArray(data) ? [...data].reverse() : []);
        } catch (err) {
            console.error('Failed to fetch links', err);
            showNotification(err.message, 'error');
        }
    };

    const deriveGrokThumbnail = (url) => {
        if (!url) return null;
        // Robust UUID extraction for Grok images/videos/posts
        const uuidMatch = url.match(/([a-f0-9-]{36})/i);
        if (uuidMatch) {
            return `https://imagine-public.x.ai/imagine-public/images/${uuidMatch[1]}.jpg`;
        }
        return null;
    };

    const addLink = async (e) => {
        e.preventDefault();
        // Robust URL extraction: handles newlines, commas, spaces, etc.
        const urls = newUrl.match(/https?:\/\/[^\s,]+/g) || [];
        if (urls.length === 0) {
            alert("找不到有效的 http 連結！");
            return;
        }

        setLoading(true);
        try {
            const tagArray = newTags.split(',').map(t => t.trim()).filter(t => t);
            if (urls.length === 1) {
                const url = urls[0];
                const thumbnail = deriveGrokThumbnail(url);
                try {
                    const response = await api.addLink(url, tagArray);
                    if (thumbnail) {
                        let finalThumbnail = thumbnail;
                        if (backupEnabled && !IS_DEMO) {
                            try {
                                const backupRes = await api.backupThumbnail(response.data.id, thumbnail);
                                if (backupRes.data.success) finalThumbnail = backupRes.data.localUrl;
                            } catch (err) {
                                console.error('Backup failed:', err);
                            }
                        }
                        await api.updateLink(response.data.id, { thumbnail: finalThumbnail });
                        response.data.thumbnail = finalThumbnail;
                    }
                    setLinks([response.data, ...links]);
                    showNotification(t('addedItems', { count: 1 }), 'success');
                } catch (err) {
                    if (err.response && err.response.status === 409) {
                        showNotification(t('skippedDuplicates', { count: 1 }), 'warning');
                    } else {
                        throw err;
                    }
                }
            } else {
                const bulkItems = urls.map(url => ({
                    url,
                    thumbnail: deriveGrokThumbnail(url)
                }));
                const response = await api.addBulk(bulkItems, tagArray);
                const { added, skippedCount } = response.data;

                if (added.length > 0) {
                    showNotification(t('addedItems', { count: added.length }), 'success');
                    setLinks([...added.reverse(), ...links]);
                }
                if (skippedCount > 0) {
                    showNotification(t('skippedDuplicates', { count: skippedCount }), 'warning');
                }

                // If backup enabled, trigger backup for each item in background
                if (backupEnabled && !IS_DEMO && added.length > 0) {
                    added.forEach(item => {
                        if (item.thumbnail) api.backupThumbnail(item.id, item.thumbnail);
                    });
                }
            }
            setNewUrl('');
            setNewTags('');
        } catch (error) {
            console.error('Error adding link:', error);
        }
        setLoading(false);
    };

    const updateLink = async (id, updates) => {
        try {
            await api.updateLink(id, updates);
            fetchLinks();
        } catch (err) {
            console.error('Failed to update link', err);
        }
    };

    const editTags = (id, currentTags = []) => {
        const input = prompt(t('newTagsPrompt'), currentTags.join(', '));
        if (input !== null) {
            const newTags = input.split(',').map(tag => tag.trim()).filter(tag => tag);
            updateLink(id, { tags: newTags });
        }
    };

    const bulkUpdateTags = async () => {
        if (selectedIds.size === 0) return;
        const input = prompt(t('bulkTagsPrompt', { count: selectedIds.size }), "");
        if (input !== null) {
            const newTags = input.split(',').map(tag => tag.trim()).filter(tag => tag);
            try {
                await api.bulkPatch(Array.from(selectedIds), { tags: newTags });
                setLinks(links.map(link =>
                    selectedIds.has(link.id) ? { ...link, tags: newTags } : link
                ));
                setSelectedIds(new Set());
            } catch (error) {
                console.error('Error bulk updating tags:', error);
            }
        }
    };

    const exportData = () => {
        if (IS_DEMO) {
            const url = api.getExportUrl();
            const a = document.createElement('a');
            a.href = url;
            a.download = 'grok-vault-demo-backup.json';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            window.location.href = api.getExportUrl();
        }
        // Show success message slightly after to allow download to start
        setTimeout(() => {
            alert(t('exportSuccess'));
        }, 500);
    };

    const importData = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                const response = await api.importData(data);
                if (response.data.success) {
                    alert(t('importSuccess', { count: response.data.count }));
                    fetchLinks();
                }
            } catch (err) {
                console.error('Import failed', err);
                alert(t('importError'));
            }
        };
        reader.readAsText(file);
    };

    const bulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (confirm(t('deleteConfirm', { count: selectedIds.size }))) {
            try {
                await api.bulkDelete(Array.from(selectedIds));
                setSelectedIds(new Set());
                fetchLinks();
            } catch (err) {
                console.error('Failed to bulk delete', err);
            }
        }
    };

    const globalRenameTag = async (oldTag) => {
        const newTag = prompt(t('globalRenamePrompt', { tag: oldTag }), oldTag);
        if (newTag && newTag !== oldTag) {
            try {
                await api.globalRenameTag(oldTag, newTag);
                fetchLinks();
            } catch (err) {
                console.error('Global rename failed', err);
            }
        }
    };

    const globalDeleteTag = async (tag) => {
        if (confirm(t('globalDeleteConfirm', { tag }))) {
            try {
                await api.globalDeleteTag(tag);
                fetchLinks();
            } catch (err) {
                console.error('Global delete failed', err);
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

    const launchPip = (url, id) => {
        const width = 450;
        const height = 650;
        const left = window.screen.width - width - 20;
        const top = window.screen.height - height - 100;
        window.open(url, `pip_${id}`, `width=${width},height=${height},left=${left},top=${top}`);
    };

    const handleHeaderDrop = async (e) => {
        e.preventDefault();
        setDragOverId(null);

        // Comprehensive URL search pattern
        const urlRegex = /(https?:\/\/[^\s,<>]+)/gi;
        let droppedText = null;

        const dataFlavors = ['URL', 'text/uri-list', 'text/plain', 'text/html'];

        for (const flavor of dataFlavors) {
            const data = e.dataTransfer.getData(flavor);
            if (!data) continue;

            // Log for debugging (only in development or if user has issues)
            console.log(`Drop Flavor: ${flavor}`, data.substring(0, 100));

            // Extract first match that looks like a web URL (ignore data: URLs)
            const matches = data.match(urlRegex);
            if (matches) {
                // Find the first one that actually starts with http (to exclude random stuff)
                const validUrl = matches.find(m => m.toLowerCase().startsWith('http'));
                if (validUrl) {
                    droppedText = validUrl;
                    break;
                }
            }
        }

        // Fallback for raw UUID strings (if no URL found)
        if (!droppedText) {
            const plain = e.dataTransfer.getData('text/plain').trim();
            if (/^[a-f0-9-]{36}$/i.test(plain)) {
                droppedText = `https://grok.com/imagine/post/${plain}`;
            }
        }

        if (droppedText) {
            let finalUrl = droppedText;
            let thumbnail = deriveGrokThumbnail(droppedText);

            // Special handling for imagine-public CDN links: 
            // extract UUID for the post but keep original link as thumbnail
            const publicImageMatch = droppedText.match(/imagine-public\/images\/([a-f0-9-]{36})/i);
            if (publicImageMatch) {
                finalUrl = `https://grok.com/imagine/post/${publicImageMatch[1]}`;
                thumbnail = droppedText;
            }

            setNewUrl(finalUrl);
            const tagArray = newTags.split(',').map(t => t.trim()).filter(t => t);
            const response = await api.addLink(finalUrl, tagArray);
            if (thumbnail) {
                await api.updateLink(response.data.id, { thumbnail });
                response.data.thumbnail = thumbnail;
            }
            setLinks([response.data, ...links]);
            setNewUrl('');
        } else {
            console.warn('Header drop: No valid URL or UUID found in flavours:', e.dataTransfer.types);
        }
    };


    const allTags = useMemo(() => {
        const counts = {};

        // Items matching all currently selected tags
        const baseLinks = links.filter(link =>
            Array.from(selectedTags).every(st => link.tags && link.tags.includes(st))
        );

        // Count tags only within the baseLinks set (Faceted Search)
        baseLinks.forEach(link => {
            if (link.tags && Array.isArray(link.tags)) {
                link.tags.forEach(tag => {
                    counts[tag] = (counts[tag] || 0) + 1;
                });
            }
        });

        // Ensure all unique tags from the global links array are present in counts (even if 0)
        // to keep the filter bar stable.
        const allUniqueTags = new Set();
        links.forEach(link => {
            if (link.tags && Array.isArray(link.tags)) {
                link.tags.forEach(tag => allUniqueTags.add(tag));
            }
        });

        const sortedTags = Array.from(allUniqueTags).sort();
        return [
            { name: 'ALL', count: links.length },
            ...sortedTags.map(tag => ({ name: tag, count: counts[tag] || 0 }))
        ];
    }, [links, selectedTags]);

    const filteredLinks = useMemo(() => {
        let result = links.filter(link => {
            const matchesSearch = link.url.toLowerCase().includes(search.toLowerCase()) ||
                link.title.toLowerCase().includes(search.toLowerCase()) ||
                (link.tags && link.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())));

            // Matches all selected tags
            const matchesTags = selectedTags.size === 0 ||
                Array.from(selectedTags).every(st => link.tags && link.tags.includes(st));

            return matchesSearch && matchesTags;
        });

        // Apply Sorting
        return [...result].sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.addedAt) - new Date(a.addedAt);
            if (sortBy === 'oldest') return new Date(a.addedAt) - new Date(b.addedAt);
            if (sortBy === 'titleAz') return a.title.localeCompare(b.title);
            return 0;
        });
    }, [links, search, selectedTags, sortBy]);

    // START: Masonry Layout Logic Refinement (Left-to-Right)
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const columnCount = useMemo(() => {
        if (windowWidth < 640) return 1;
        if (windowWidth < 1024) return 2;
        if (windowWidth < 1280) return 3;
        return 4;
    }, [windowWidth]);

    const masonryColumns = useMemo(() => {
        const cols = Array.from({ length: columnCount }, () => []);
        filteredLinks.forEach((link, i) => {
            cols[i % columnCount].push(link);
        });
        return cols;
    }, [filteredLinks, columnCount]);
    // END: Masonry Layout Logic

    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const handleTitleRename = async (id) => {
        if (tempTitle.trim() && tempTitle !== links.find(l => l.id === id)?.title) {
            await updateLink(id, { title: tempTitle });
        }
        setEditingId(null);
        setTempTitle('');
    };

    return (
        <div className="min-h-screen bg-black text-white px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="sticky top-0 z-[60] bg-black/95 backdrop-blur-md pt-8 pb-4 mb-4 border-b border-zinc-800/50">


                    {/* Header: Title + Primary Actions */}
                    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <img src="logo-sm.png" alt="Logo" className="w-10 h-10 object-contain" />
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                                    {t('title')}
                                    {IS_DEMO && (
                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs border border-blue-500/50 font-mono tracking-widest uppercase">
                                            Demo
                                        </span>
                                    )}
                                </h1>
                                <p className="text-zinc-500 mt-1 font-medium">{t('subtitle')}</p>
                            </div>
                        </motion.div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            {/* Utility Buttons Group */}
                            <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800/50">
                                {/* Language */}
                                <div className="relative">
                                    <button
                                        onClick={() => setLangOpen(!langOpen)}
                                        className="p-2.5 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 group"
                                    >
                                        <Globe className="w-5 h-5 group-hover:text-white transition-colors" />
                                    </button>
                                    <AnimatePresence>
                                        {langOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-[100] overflow-hidden"
                                            >
                                                {['en', 'zh-cn', 'zh-tw', 'ja'].map(lang => (
                                                    <button
                                                        key={lang}
                                                        onClick={() => { setLanguage(lang); setLangOpen(false); }}
                                                        className={cn("w-full px-4 py-3 text-left hover:bg-zinc-800 flex items-center justify-between", language === lang && "bg-zinc-800/50 text-white")}
                                                    >
                                                        <span>{lang === 'en' ? '🇺🇸 English' : lang === 'zh-cn' ? '🇨🇳 简体中文' : lang === 'zh-tw' ? '🇹🇼 繁體中文' : '🇯🇵 日本語'}</span>
                                                        {language === lang && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>


                                <div className="w-px h-4 bg-zinc-800 mx-1" />

                                {/* Sorting */}
                                <div className="relative">
                                    <button
                                        onClick={() => setSortOpen(!sortOpen)}
                                        className="p-2.5 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 group"
                                    >
                                        <ArrowUpDown className="w-5 h-5 group-hover:text-white transition-colors" />
                                    </button>
                                    <AnimatePresence>
                                        {sortOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-[100] overflow-hidden"
                                            >
                                                {['newest', 'oldest', 'titleAz'].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => { setSortBy(opt); setSortOpen(false); }}
                                                        className={cn("w-full px-4 py-3 text-left hover:bg-zinc-800 flex items-center justify-between", sortBy === opt && "bg-zinc-800/50 text-white")}
                                                    >
                                                        <span>{t(opt)}</span>
                                                        {sortBy === opt && <Check className="w-4 h-4 text-blue-400" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="w-px h-4 bg-zinc-800 mx-1" />

                                {/* Settings Toggle */}
                                <button
                                    onClick={() => setSettingsOpen(true)}
                                    title={t('settings')}
                                    className="p-2.5 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 group"
                                >
                                    <Settings className="w-5 h-5 group-hover:text-blue-400 transition-colors group-hover:rotate-45 transition-transform" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative group flex-1 lg:w-48 xl:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    className="pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-700 w-full transition-all placeholder:text-zinc-700"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Blur Toggle */}
                            <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2.5 rounded-2xl border border-zinc-800/50">
                                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('privacyBlur')}</span>
                                <button
                                    onClick={() => setIsBlurred(!isBlurred)}
                                    className={cn(
                                        "relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none",
                                        isBlurred ? "bg-emerald-500" : "bg-zinc-700"
                                    )}
                                >
                                    <motion.div
                                        animate={{ x: isBlurred ? 20 : 2 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                                    />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Secondary Row: Bulk Add */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOverId('header'); }}
                        onDragLeave={() => setDragOverId(null)}
                        onDrop={handleHeaderDrop}
                        className={cn(
                            "flex flex-col lg:flex-row gap-4 mb-8 p-4 rounded-3xl border transition-all duration-300",
                            dragOverId === 'header'
                                ? "bg-blue-500/10 border-blue-500/50 scale-[1.01] shadow-2xl shadow-blue-500/10"
                                : "bg-zinc-900/30 border-zinc-800/30"
                        )}
                    >
                        <div className="flex flex-1 gap-2">
                            <textarea
                                placeholder={t('bulkAddPlaceholder')}
                                className="px-5 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-600 flex-1 min-h-[50px] max-h-32 resize-y placeholder:text-zinc-700 text-sm leading-relaxed"
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
                                placeholder={t('tagPlaceholder')}
                                className="px-5 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-600 w-48 placeholder:text-zinc-700 text-sm"
                                value={newTags}
                                onChange={(e) => setNewTags(e.target.value)}
                            />
                        </div>
                        <button
                            disabled={loading}
                            className="px-8 py-3.5 bg-white hover:bg-zinc-200 text-black font-extrabold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                            onClick={addLink}
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 stroke-[3]" />}
                            <span className="text-sm">{t('bulkAdd')}</span>
                        </button>
                    </div>
                    {/* Tag Filter Bar */}
                    <div className="flex flex-wrap items-center gap-2 pb-2 relative">
                        {allTags.slice(0, 6).map(tag => (
                            <button
                                key={tag.name}
                                onClick={() => {
                                    if (tag.name === 'ALL') {
                                        setSelectedTags(new Set());
                                    } else {
                                        setSelectedTags(prev => {
                                            const next = new Set(prev);
                                            if (next.has(tag.name)) next.delete(tag.name);
                                            else next.add(tag.name);
                                            return next;
                                        });
                                    }
                                }}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2",
                                    (tag.name === 'ALL' ? selectedTags.size === 0 : selectedTags.has(tag.name))
                                        ? "bg-white text-black shadow-lg"
                                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"
                                )}
                            >
                                {tag.name === 'ALL' ? t('allProducts') : tag.name}
                                <span className={cn(
                                    "text-[10px] opacity-70",
                                    (tag.name === 'ALL' ? selectedTags.size === 0 : selectedTags.has(tag.name)) ? "text-black/60" : "text-zinc-600"
                                )}>{tag.count}</span>
                            </button>
                        ))}

                        {allTags.length > 6 && (
                            <div className="relative">
                                <button
                                    onClick={() => setMoreTagsOpen(!moreTagsOpen)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                                        allTags.slice(6).some(t => selectedTags.has(t.name))
                                            ? "bg-white text-black"
                                            : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"
                                    )}
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                    {t('moreTags')}
                                    <ChevronDown className={cn("w-3 h-3 transition-transform", moreTagsOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {moreTagsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 top-full mt-2 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-[70] grid grid-cols-2 sm:grid-cols-3 gap-2 min-w-[300px]"
                                        >
                                            {allTags.slice(6).map(tag => (
                                                <button
                                                    key={tag.name}
                                                    onClick={() => {
                                                        setSelectedTags(prev => {
                                                            const next = new Set(prev);
                                                            if (next.has(tag.name)) next.delete(tag.name);
                                                            else next.add(tag.name);
                                                            return next;
                                                        });
                                                    }}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-medium text-left truncate transition-colors flex items-center justify-between",
                                                        selectedTags.has(tag.name) ? "bg-white text-black" : "hover:bg-zinc-800 text-zinc-400"
                                                    )}
                                                >
                                                    <span className="truncate">{tag.name}</span>
                                                    <span className="ml-2 text-[10px] opacity-60">{tag.count}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <button
                            onClick={() => setTagManagerOpen(true)}
                            className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-300"
                            title={t('tagManager')}
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
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

                    <div className="flex gap-6 items-start">
                        {masonryColumns && masonryColumns.map((col, colIndex) => (
                            <div key={colIndex} className="flex-1 space-y-6 flex flex-col">
                                <AnimatePresence mode="popLayout">
                                    {col.map((link) => (
                                        <motion.div
                                            key={link.id}
                                            data-id={link.id}
                                            onClick={(e) => {
                                                if (e.shiftKey) {
                                                    toggleSelect(link.id);
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                } else {
                                                    // Toggle fan-out on click
                                                    setLastSelectedId(prev => prev === link.id ? null : link.id);
                                                }
                                            }}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            onDragOver={(e) => { e.preventDefault(); setDragOverId(link.id); }}
                                            onDragLeave={() => setDragOverId(null)}
                                            onDrop={(e) => { setDragOverId(null); handleExternalDrop(e, link.id); }}
                                            className={cn(
                                                "group relative bg-zinc-900 rounded-3xl border transition-all duration-300 w-full cursor-pointer",
                                                lastSelectedId === link.id ? "overflow-visible z-[100]" : "overflow-hidden",
                                                selectedIds.has(link.id)
                                                    ? "border-white ring-1 ring-white/50 scale-[1.02]"
                                                    : dragOverId === link.id
                                                        ? "border-emerald-500 ring-2 ring-emerald-500/20 scale-[1.05] z-40"
                                                        : lastSelectedId === link.id
                                                            ? "border-blue-500 ring-2 ring-blue-500/20"
                                                            : "border-zinc-800 hover:border-zinc-700 shadow-xl"
                                            )}
                                        >
                                            {/* Derivative Fan-out UI */}
                                            <DerivativeFanOut
                                                derivatives={link.derivatives}
                                                isActive={lastSelectedId === link.id}
                                            />
                                            {/* Selection Checkbox (Visible on hover or if selected) */}
                                            <div
                                                onClick={(e) => {
                                                    if (!e.shiftKey) e.stopPropagation();
                                                    toggleSelect(link.id);
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
                                                            onClick={(e) => { if (!e.shiftKey) e.stopPropagation(); updateThumbnail(link.id, link.url); }}
                                                            className="text-xs px-3 py-1.5 bg-slate-800 rounded-full hover:bg-slate-700 hover:text-slate-300 transition-colors"
                                                        >
                                                            {t('getThumbnail')}
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={t('openExternal')}
                                                        onClick={(e) => { if (!e.shiftKey) e.stopPropagation(); }}
                                                        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-400 transition-colors"
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </a>
                                                    <button
                                                        onClick={(e) => { if (!e.shiftKey) e.stopPropagation(); setFullscreenId(link.id); }}
                                                        title={t('fullscreen')}
                                                        className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                                                    >
                                                        <Maximize className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { if (!e.shiftKey) e.stopPropagation(); launchPip(link.url, link.id); }}
                                                        title={t('pipPreview')}
                                                        className="p-3 bg-amber-500 text-white rounded-full hover:bg-amber-400 transition-colors"
                                                    >
                                                        <Aperture className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4" onClick={(e) => { if (!e.shiftKey) e.stopPropagation(); }}>
                                                <div className="flex justify-between items-start gap-2">
                                                    {editingId === link.id ? (
                                                        <div className="flex items-center gap-1 w-full">
                                                            <input
                                                                autoFocus
                                                                value={tempTitle}
                                                                onChange={(e) => setTempTitle(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleTitleRename(link.id);
                                                                    if (e.key === 'Escape') setEditingId(null);
                                                                }}
                                                                className="bg-zinc-800 border border-blue-500 rounded px-2 py-0.5 text-sm flex-1 focus:outline-none"
                                                            />
                                                            <button onClick={() => handleTitleRename(link.id)} className="p-1 hover:text-emerald-400">
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => setEditingId(null)} className="p-1 hover:text-red-400">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col gap-1 flex-1 truncate">
                                                            <div className="flex items-center justify-between group/title">
                                                                <h3 className="font-semibold text-zinc-100 truncate flex-1">{link.title}</h3>
                                                                <button
                                                                    onClick={() => { setEditingId(link.id); setTempTitle(link.title); }}
                                                                    className="opacity-0 group-hover/title:opacity-100 p-1 text-zinc-500 hover:text-white transition-all"
                                                                >
                                                                    <Edit2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {link.tags && link.tags.length > 0 ? (
                                                                    link.tags.map(tag => (
                                                                        <button
                                                                            key={tag}
                                                                            onClick={() => {
                                                                                setSelectedTags(prev => {
                                                                                    const next = new Set(prev);
                                                                                    if (next.has(tag)) next.delete(tag);
                                                                                    else next.add(tag);
                                                                                    return next;
                                                                                });
                                                                            }}
                                                                            className={cn(
                                                                                "text-[9px] px-1.5 py-0.5 rounded border transition-colors",
                                                                                selectedTags.has(tag)
                                                                                    ? "bg-white text-black border-white"
                                                                                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500"
                                                                            )}
                                                                        >
                                                                            {tag}
                                                                        </button>
                                                                    ))
                                                                ) : (
                                                                    <button
                                                                        onClick={() => editTags(link.id, link.tags)}
                                                                        className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 italic"
                                                                    >
                                                                        {t('uncategorized')}
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => editTags(link.id, link.tags)}
                                                                    className="text-[9px] bg-zinc-900 px-1 py-0.5 rounded text-zinc-600 border border-dashed border-zinc-800 hover:border-zinc-500"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50">
                                                    <span className="text-[10px] text-zinc-600">{t('addedAt')}: {new Date(link.addedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ))}
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
                                {t('selectedCount', { count: selectedIds.size })}
                            </span>
                            <button
                                onClick={handleSelectAll}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
                            >
                                <CheckSquare className="w-4 h-4 text-blue-400 opacity-80" />
                                {selectedIds.size === links.length ? t('deselectAll') : t('selectAll')}
                            </button>
                            <button
                                onClick={bulkUpdateTags}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
                            >
                                <Tag className="w-4 h-4 text-emerald-400 opacity-80" />
                                {t('bulkEditTags')}
                            </button>
                            <button
                                onClick={bulkDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-sm font-medium transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                {t('bulkDelete')}
                            </button>
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="px-4 py-2 text-slate-500 hover:text-slate-300 text-sm"
                            >
                                {t('cancel')}
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
                            className="fixed top-24 right-8 w-80 z-[200] bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-3xl glass p-6 flex flex-col gap-4"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-blue-400">{t('grokHelperTitle')}</h3>
                                <button
                                    onClick={() => setActiveGrokUrl(null)}
                                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed">
                                {t('grokHelperDesc')}
                            </p>

                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                                <ol className="text-xs text-slate-300 space-y-3 list-decimal list-inside">
                                    {t('grokHelperSteps').map((step, idx) => (
                                        <li key={idx} dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                                    ))}
                                </ol>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        const imgUrl = prompt(t('getThumbPrompt'));
                                        if (imgUrl) {
                                            const id = links.find(l => l.url === activeGrokUrl)?.id;
                                            if (id) updateLink(id, { thumbnail: imgUrl });
                                        }
                                    }}
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    {t('manualPaste')}
                                </button>
                                <button
                                    onClick={() => updateThumbnail('relaunch', activeGrokUrl)}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/40"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    {t('relaunch')}
                                </button>
                            </div>

                            <p className="text-[10px] text-center text-slate-600 mt-2">
                                {t('helperTip')}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {
                    filteredLinks.length === 0 && (
                        <div className="text-center py-24">
                            <div className="inline-block p-6 bg-slate-800/30 rounded-3xl mb-4">
                                <Search className="w-12 h-12 text-slate-700" />
                            </div>
                            <p className="text-slate-500 text-lg">{t('noLinks')}</p>
                        </div>
                    )
                }

                {/* Tag Manager Modal */}
                <AnimatePresence>
                    {tagManagerOpen && (
                        <TagManagerModal
                            onClose={() => setTagManagerOpen(false)}
                            allTags={allTags}
                            globalRenameTag={globalRenameTag}
                            globalDeleteTag={globalDeleteTag}
                            t={t}
                        />
                    )}
                </AnimatePresence>

                {/* Settings Modal */}
                <AnimatePresence>
                    {settingsOpen && (
                        <SettingsModal
                            onClose={() => setSettingsOpen(false)}
                            links={links}
                            setLinks={setLinks}
                            lanAccessEnabled={lanAccessEnabled}
                            setLanAccessEnabled={setLanAccessEnabled}
                            lanIp={lanIp}
                            defaultBlurEnabled={defaultBlurEnabled}
                            setDefaultBlurEnabled={setDefaultBlurEnabled}
                            backupEnabled={backupEnabled}
                            setBackupEnabled={setBackupEnabled}
                            t={t}
                            IS_DEMO={IS_DEMO}
                            api={api}
                            showNotification={showNotification}
                            importData={importData}
                            exportData={exportData}
                        />
                    )}
                </AnimatePresence>

                <NotificationToast notifications={notifications} />

                <AnimatePresence>
                    {fullscreenId && (
                        <LightboxOverlay
                            id={fullscreenId}
                            links={filteredLinks}
                            onClose={() => setFullscreenId(null)}
                            onNavigate={(newId) => setFullscreenId(newId)}
                        />
                    )}
                </AnimatePresence>

            </div>

            {/* Footer */}
            <footer className="mt-20 pb-8 border-t border-zinc-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-xs max-w-7xl mx-auto">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <p>© {new Date().getFullYear()} Grok Imagine AI Vault</p>
                    <a
                        href="https://www.gnu.org/licenses/gpl-3.0.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-zinc-400 transition-colors"
                    >
                        Released under GNU GPL v3 License
                    </a>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                        <p className="text-[10px] text-zinc-500 italic">気に入ったらコーヒーを一杯いかが？</p>
                        <a
                            href="https://buymeacoffee.com/koehhian"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all flex items-center gap-2 group"
                        >
                            <span className="group-hover:scale-110 transition-transform">☕️</span>
                            <span>Buy Me a Coffee</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// --- Sub-components ---

function SettingsModal({ onClose, links, setLinks, backupEnabled, setBackupEnabled, defaultBlurEnabled, setDefaultBlurEnabled, lanAccessEnabled, setLanAccessEnabled, lanIp, t, IS_DEMO, api, showNotification, importData, exportData }) {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [backupProgress, setBackupProgress] = useState({ current: 0, total: 0 });
    const [activeTab, setActiveTab] = useState('privacy'); // privacy, backup, network

    const handleBackupAll = async () => {
        if (isBackingUp) return;
        const cdnLinks = links.filter(l => l.thumbnail && l.thumbnail.startsWith('http'));
        if (cdnLinks.length === 0) {
            showNotification(t('noLinks'), 'info');
            return;
        }
        setIsBackingUp(true);
        setBackupProgress({ current: 0, total: cdnLinks.length });
        for (let i = 0; i < cdnLinks.length; i++) {
            const link = cdnLinks[i];
            setBackupProgress({ current: i + 1, total: cdnLinks.length });
            try {
                const uuid = link.url.match(/([a-f0-9-]{36})/i)?.[1] || link.id;
                const fileName = `Grok_${uuid}.jpg`;
                const downloadUrl = `${API_URL}/download-proxy?url=${encodeURIComponent(link.thumbnail)}&filename=${encodeURIComponent(fileName)}`;
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                await new Promise(r => setTimeout(r, 400));
            } catch (err) {
                console.error(`Failed to trigger download for ${link.id}:`, err);
            }
        }
        setIsBackingUp(false);
        showNotification(t('exportSuccess'), 'success');
    };

    const tabs = [
        { id: 'privacy', label: t('privacy'), icon: Shield },
        { id: 'backup', label: t('backup'), icon: Database },
        { id: 'network', label: t('network'), icon: Globe }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-[#16181c] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex h-[500px]"
            >
                {/* Sidebar */}
                <div className="w-48 border-r border-white/5 bg-black/20 p-4 flex flex-col gap-2">
                    <div className="px-3 py-4 mb-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Settings className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="font-bold text-white tracking-tight">{t('settings')}</span>
                    </div>

                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group text-sm font-medium",
                                activeTab === tab.id
                                    ? "bg-blue-500/10 text-blue-400"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4 transition-colors", activeTab === tab.id ? "text-blue-400" : "text-zinc-600 group-hover:text-zinc-400")} />
                            {tab.label}
                        </button>
                    ))}

                    <div className="mt-auto p-2">
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 rounded-xl border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 transition-colors text-xs font-medium"
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/10">
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'privacy' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div>
                                                <h4 className="text-white font-medium">{t('defaultBlur')}</h4>
                                                <p className="text-xs text-zinc-500 mt-1">{t('defaultBlurDesc')}</p>
                                            </div>
                                            <IOSSwitch checked={defaultBlurEnabled} onChange={setDefaultBlurEnabled} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'backup' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div>
                                                <h4 className="text-white font-medium">{t('localBackup')}</h4>
                                                <p className="text-xs text-zinc-500 mt-1">{t('localBackupDesc')}</p>
                                            </div>
                                            <IOSSwitch checked={backupEnabled} onChange={setBackupEnabled} />
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1 mb-3">{t('dataManagement')}</h4>

                                            {/* Grid for Actions */}
                                            <div className="grid grid-cols-1 gap-3">
                                                <button
                                                    onClick={handleBackupAll}
                                                    disabled={isBackingUp || IS_DEMO}
                                                    className={cn(
                                                        "w-full p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between group transition-all text-sm",
                                                        (isBackingUp || IS_DEMO) ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500/30 hover:bg-blue-500/5"
                                                    )}
                                                >
                                                    <div className="text-left flex items-center gap-3">
                                                        <div className="p-2 bg-blue-500/10 rounded-xl">
                                                            <Download className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <div className="text-white font-medium">
                                                                {isBackingUp ? t('backingUp', { current: backupProgress.current, total: backupProgress.total }) : t('backupAll')}
                                                            </div>
                                                            <p className="text-[10px] text-zinc-500 mt-0.5">
                                                                {t('backupAllDesc')}
                                                                <span className="block opacity-60 mt-0.5">{t('systemDownloads')}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {isBackingUp && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                                                </button>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={exportData}
                                                        className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                                                    >
                                                        <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                                            <Upload className="w-6 h-6 text-emerald-400" />
                                                        </div>
                                                        <span className="text-xs font-semibold text-zinc-300">{t('exportData')}</span>
                                                    </button>

                                                    <div className="relative group">
                                                        <input
                                                            type="file"
                                                            accept=".json"
                                                            onChange={importData}
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                        />
                                                        <div className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-white/5 rounded-2xl group-hover:border-purple-500/30 group-hover:bg-purple-500/5 transition-all">
                                                            <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                                                <Download className="w-6 h-6 text-purple-400" />
                                                            </div>
                                                            <span className="text-xs font-semibold text-zinc-300">{t('importData')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'network' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div>
                                                <h4 className="text-white font-medium">{t('lanAccess')}</h4>
                                                <p className="text-xs text-zinc-500 mt-1">{t('lanAccessDesc')}</p>
                                            </div>
                                            <IOSSwitch checked={lanAccessEnabled} onChange={setLanAccessEnabled} />
                                        </div>

                                        {lanAccessEnabled && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-col gap-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="w-4 h-4 text-blue-400" />
                                                        <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">{t('lanAddress')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl border border-white/5">
                                                    <code className="flex-1 text-[13px] text-zinc-300 font-mono select-all truncate">
                                                        {`http://${lanIp}:5179`}
                                                    </code>
                                                </div>
                                                <p className="text-[10px] text-blue-400/60 leading-relaxed px-1">
                                                    💡 在手機瀏覽器輸入此網址即可同步瀏覽，請確保裝置與本機處於同一 Wi-Fi。
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function IOSSwitch({ checked, onChange }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={cn(
                "relative w-12 h-7 rounded-full transition-colors duration-200 outline-none flex items-center",
                checked ? "bg-green-500" : "bg-white/10"
            )}
        >
            <motion.div
                animate={{ x: checked ? 22 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-md"
            />
        </button>
    );
}

function NotificationToast({ notifications }) {
    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map(n => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={cn(
                            "px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md min-w-[220px] flex items-center gap-3 pointer-events-auto",
                            n.type === 'success' ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                                n.type === 'warning' ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                                    "bg-blue-500/20 border-blue-500/30 text-blue-400"
                        )}
                    >
                        {n.type === 'success' && <Check className="w-4 h-4" />}
                        {n.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                        {n.type === 'info' && <RefreshCw className="w-4 h-4 animate-spin" />}
                        <span className="text-xs font-medium">{n.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

function AlertCircle(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    )
}

function LightboxOverlay({ id, links, onClose, onNavigate }) {
    const currentIndex = links.findIndex(l => l.id === id);
    const link = links[currentIndex];
    const [isPlaying, setIsPlaying] = useState(false);
    const [slideshowInterval, setSlideshowInterval] = useState(5);

    // Slideshow logic
    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setInterval(() => {
                navigate(1);
            }, slideshowInterval * 1000);
        }
        return () => clearInterval(timer);
    }, [isPlaying, slideshowInterval, currentIndex, links.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, links.length]);

    const navigate = (direction) => {
        const nextIndex = (currentIndex + direction + links.length) % links.length;
        onNavigate(links[nextIndex].id);
    };

    if (!link) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex items-center justify-center select-none"
            onClick={onClose}
        >
            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex flex-col">
                    <h3 className="text-white font-bold text-lg">{link.title}</h3>
                    <p className="text-white/40 text-xs">{new Date(link.addedAt).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white/10 rounded-full px-4 py-2 gap-3 border border-white/5">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                            className="p-1 hover:text-blue-400 transition-colors text-white"
                            title={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                        </button>
                        <div className="h-4 w-[1px] bg-white/20" />
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={slideshowInterval}
                                onChange={(e) => setSlideshowInterval(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                                className="w-10 bg-transparent text-white text-center text-sm font-bold focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">sec</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={e => e.stopPropagation()}>
                <motion.img
                    key={link.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    src={link.thumbnail || link.url}
                    alt={link.title}
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                />

                {/* Navigation Arrows */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 md:left-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all transform hover:scale-110"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                    onClick={() => navigate(1)}
                    className="absolute right-4 md:right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all transform hover:scale-110"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>

            {/* Bottom Bar / Prompt Area */}
            <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col items-center gap-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex gap-2">
                    {link.tags && link.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[10px] text-white/60">
                            #{tag}
                        </span>
                    ))}
                </div>
                {/* Future prompt display could go here */}
            </div>
        </motion.div>
    );
}

function TagManagerModal({ onClose, allTags, globalRenameTag, globalDeleteTag, t }) {
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-3xl p-6 overflow-hidden"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Tag className="w-5 h-5 text-blue-400" />
                        {t('tagManager')}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {allTags.filter(t => t.name !== 'ALL').map(tag => (
                        <div key={tag.name} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-2xl hover:bg-zinc-800 transition-colors group">
                            <span className="font-medium text-zinc-200">{tag.name}</span>
                            <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => globalRenameTag(tag.name)}
                                    className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                                    title={t('renameTag')}
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => globalDeleteTag(tag.name)}
                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                    title={t('deleteTag')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
