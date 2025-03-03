import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { characterName, alliance, friends } = body;

        // 驗證請求內容是否包含必要欄位
        if (!characterName || !alliance) {
            return new Response(JSON.stringify({ message: '缺少必要參數' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 設置 Google Sheets API
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // 修正換行符
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 寫入主要資料到 Sheet1
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:B',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[characterName, alliance]]
            }
        });

        // 寫入朋友資料到 Sheet2
        if (friends && friends.length > 0) {
            const friendsRow = [characterName, ...friends];
            await sheets.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Sheet2!A:Z',  // 使用較大的範圍以容納多個朋友
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [friendsRow]
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
