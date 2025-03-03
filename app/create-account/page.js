'use client'
import { useState } from 'react';

export default function CreateAccount() {
    const [formData, setFormData] = useState({
        characterName: '',
        alliance: '',
        friends: [''] // 初始化一個空的朋友陣列
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/submit-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    friends: formData.friends.filter(friend => friend !== '') // 過濾掉空值
                })
            });

            if (response.ok) {
                alert('帳號新增成功！');
                setFormData({ characterName: '', alliance: '', friends: [''] });
            } else {
                alert('發生錯誤，請稍後再試。');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('發生錯誤，請稍後再試。');
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
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    確定新增
                </button>
            </form>
        </div>
    );
} 