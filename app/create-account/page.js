'use client'
import { useState, useEffect } from 'react';

export default function CreateAccount() {
    const [formData, setFormData] = useState({
        characterName: '',
        alliance: '',
        friends: [''],
        lineId: '',
        lineName: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [liff, setLiff] = useState(null);
    const [error, setError] = useState('');

    const [isInitialized, setIsInitialized] = useState(false);

    // 更新 `useEffect` 內的邏輯
    useEffect(() => {
        const initializeLiff = async () => {
            try {
                console.log('開始初始化 LIFF');
                const liffModule = await import('@line/liff');
                const liffObject = liffModule.default;
                
                // 進行初始化
                await liffObject.init({
                    liffId: process.env.NEXT_PUBLIC_LIFF_ID,
                    withLoginOnExternalBrowser: true
                });
                console.log('LIFF 初始化成功');
                
                // 設置 liff 物件
                setLiff(liffObject);
    
                if (!liffObject.isLoggedIn()) {
                    console.log('使用者未登入，準備導向登入頁面');
                    liffObject.login({
                        redirectUri: window.location.href
                    });
                    return;
                }
    
                console.log('使用者已登入，準備獲取資料');
                const profile = await liffObject.getProfile();
                console.log('成功獲取用戶資料');
                
                setFormData(prev => ({
                    ...prev,
                    lineId: profile.userId,
                    lineName: profile.displayName
                }));
            } catch (error) {
                console.error('LIFF 初始化失敗:', error);
                setError(`初始化失敗: ${error.message}`);
            } finally {
                setIsLoading(false);
                setIsInitialized(true);  // 初始化完成
            }
        };
    
        if (typeof window !== 'undefined') {
            initializeLiff();
        }
    }, []);
    
    if (!isInitialized) {
        return (
            <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="mb-4">載入中...</div>
                    <div className="text-sm text-gray-500">請稍候，正在確認 LINE 登入狀態</div>
                    {error && (
                        <div className="text-red-500 mt-2">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        );
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/submit-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    friends: formData.friends.filter(friend => friend !== '')
                })
            });

            if (response.ok) {
                alert('帳號新增成功！');
                setFormData(prev => ({ 
                    ...prev,
                    characterName: '',
                    alliance: '',
                    friends: ['']
                }));
            } else {
                alert('發生錯誤，請稍後再試。');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('發生錯誤，請稍後再試。');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddFriend = () => {
        setFormData({
            ...formData,
            friends: [...formData.friends, '']
        });
    };

    const handleFriendChange = (index, value) => {
        const newFriends = [...formData.friends];
        newFriends[index] = value;
        setFormData({
            ...formData,
            friends: newFriends
        });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="mb-4">載入中...</div>
                    <div className="text-sm text-gray-500">請稍候，正在確認 LINE 登入狀態</div>
                    {error && (
                        <div className="text-red-500 mt-2">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">新增遊戲帳號</h1>
            <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                    <label htmlFor="characterName" className="block text-sm font-medium text-gray-700 mb-2">
                        角色名稱
                    </label>
                    <input
                        type="text"
                        id="characterName"
                        value={formData.characterName}
                        onChange={(e) => setFormData({...formData, characterName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="alliance" className="block text-sm font-medium text-gray-700 mb-2">
                        原聯盟
                    </label>
                    <select
                        id="alliance"
                        value={formData.alliance}
                        onChange={(e) => setFormData({...formData, alliance: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">請選擇聯盟</option>
                        <option value="聯盟1">聯盟1</option>
                        <option value="聯盟2">聯盟2</option>
                        <option value="聯盟3">聯盟3</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        認識的朋友
                    </label>
                    {formData.friends.map((friend, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="text"
                                value={friend}
                                onChange={(e) => handleFriendChange(index, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder={`朋友 ${index + 1}`}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddFriend}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                        + 新增另一位朋友
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white
                        ${isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                >
                    {isSubmitting ? '處理中...' : '確定新增'}
                </button>
            </form>
        </div>
    );
} 