import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { characterName, alliance, friends, lineId, lineName } = body;

        // 驗證請求內容
        if (!characterName || !alliance || !lineId || !lineName) {
            return new Response(JSON.stringify({ message: '缺少必要參數' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 寫入主要資料到 Sheet1（現在包含 Line 資訊）
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:D', // 擴展範圍以包含 Line 資訊
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[characterName, alliance, lineId, lineName]]
            }
        });

        // 寫入朋友資料到 Sheet2
        if (friends && friends.length > 0) {
            const friendsRow = [characterName, ...friends];
            await sheets.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Sheet2!A:Z',
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
