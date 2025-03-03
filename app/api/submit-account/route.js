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
                private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCk0W9kTYOwsBLR\n3i2gzK6q0CLiMZmDXaXB0OLD/rMOhQgJEsH7lgHkQTpbxRJ9ausffsTnrXDggjAw\nG3SEm5CpU2VWoAqM9vDA6RRJlmbwHzrKNf9iEit+iAxk8KfwUMhqoJuFXGvj01K0\nqyHi7om1/ayezB1/x0j6Q6oBGs5q6s9ubbFVceH3FvV2AONhjHUGq52TQOtcOaS0\ndHgkWd5S33l8dtBs2cPBM8Evo0z4I7n04tKM34aTiDcb0WDoD5w49sLushPPMxBt\n83+0h2g03UFTcp176RqMcn17lnKFRXDkGYMh/HczVcFlxQ2FgNQWdmCoZQtNtG5Q\nZi203pF9AgMBAAECggEAFvwcGDVVJalQXpMo8tFIlIqlKr03BuJi8NYEIcgdyWsU\n9Ur34XGIfv/3tv+TNglYk9JWfGasJKsTNEpH5AxbzrlSGxQDlKgFaCm5ChAe9+Kr\nDLMeE9ur1B/99n+3M+TYJkKSnbUHWMTKNmbdOWwBqW8giR63CHBOxZP1G+VUnwU5\nYiX35z1aThcPBoTEs9RN6s4ve7cTfNTw2ol1UA8nCZsXShv23T9xdMBrlTxYF9kU\nOc1jWx1QMXW8R+bLS/bRAJXXQZbH8oJNrc2H4OfkgueMGUk1NUERb9wX9Rq/DJaT\n+Mxx3ics0ttYrUafl4EQW+BgA6kjogOUOzzvoLq/QwKBgQDjxfmkIooThM4EVnz2\n5/7jrvWfCyn6AW1X77xRv9n90c+C+mgYhJUnhHZIsNnkb5rtA+CT2Tqis7xRzMB4\n0h3vv1yuZveoolCjq8Nx2tneqK2tcru81UKE0oKO/8xE5MMtdxqg95PDiJqWtVUZ\nhO8bjoamOTJgTGTBLA+AQjXU1wKBgQC5Pjp9LZq4i0KJzhTJZzhW7JGWOV1z+B6s\nRSbZz90pmo/nH/HBqbZh4uojQW6o6NtfcEUy9yFRNGdN1uLEoaf6x8+cvwT7I9uu\n37RlylWr3aqHWQ1NrpymXc+AM5ZpMgv106RD+Y7PevDY9z0pAhPRhJGTIoshWCMe\nfZ3eksMtywKBgB2YBGZ6Alyk3aucnSHrZKeqfMlMRwjvlIhfYqVwet9Kml6XMF03\nJLX8tO2e5MCUa5mt7kjnaYHoPmiWZM+N5UvYHi+eu0DSzg1l7L/nQnV2jxJBHPlc\n8AaX31S7EYxF+MH4fqI5aJ54KjW4m7T0G6kF7KK+PbhbVJ/wnJb6g0oDAoGAZzD/\nLBRniD4rhtDCS5+whtuqDmFOaffiPl0XU2az8SUk3L+y0QtVihn6DEG6/2UYL4Y/\nRjDc4nuqwHXgRWE4Tj9YrBzNDYngKv57Y+je6KrHADbfblLC+PpxSR1zwI4ck4ie\njS9MGtCFspen/lwl5iVPYwNvNdf/WFDpzL888xkCgYEAyWbFjRtiWTqMR7tqKMVL\nj4t0aNqW5/5rhIWfmLfUxAEWQ+6yoNb2BBU99Ru/ho9SVC0nGKUDqcWAsRgf4cQH\npxbubkaUHIFWuCf/o+FYQ84LU/IXWScUS8ZTk6SJk3dbiUzlc0FYqYim4dAZH0kB\nQFLewQ5ej2T3ZMGGV7kNFHg=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'), // 修正換行符
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
