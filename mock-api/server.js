/**
 * Mock API Server - Phase 1 開発用
 * IRes / FC バックエンド の代替モック
 *
 * 起動: node mock-api/server.js
 * PORT: 3001
 */

const http = require('http')

// ---- モックデータ（FCAPI連携仕様に基づく） ----
const FC_RECORDS = [
  {
    id: '12345678901',
    machine_no: 'M-001',
    address: '東京都新宿区西新宿1-1-1',
    note: '',
    status: 'in_progress',
    assignee: '田中 太郎',
    vendor: '株式会社サンプル',
    amount: 15000,
    updated_at: new Date().toISOString(),
  },
  {
    id: '12345678902',
    machine_no: 'M-002',
    address: '東京都渋谷区道玄坂2-2-2',
    note: '認証完了、引き上げ',
    status: 'received',
    assignee: '鈴木 花子',
    vendor: '株式会社テスト',
    amount: 0,
    updated_at: new Date().toISOString(),
  },
  {
    id: '12345678903',
    machine_no: 'M-003',
    address: '神奈川県横浜市西区3-3-3',
    note: '',
    status: 'secondary',
    assignee: '佐藤 次郎',
    vendor: '有限会社モック',
    amount: 32000,
    updated_at: new Date().toISOString(),
  },
]

const STATUS_LABELS = {
  received: '受付中',
  in_progress: '対応中',
  secondary: '二次対応',
}

// ---- n8n Webhook モック ----
const FAQ_RESPONSES = {
  '手順': '手順についてのご質問ですね。\n\n1. システムにログイン\n2. 対象機番を入力\n3. 作業内容を選択\n4. 完了報告を送信\n\n詳細な手順書が必要な場合は「詳細手順」とご入力ください。',
  '設置': '設置手順についてご案内します。\n\n**事前準備**\n- 設置場所の確認\n- 機材の動作確認\n\n**設置手順**\n1. 設置場所を清掃\n2. 固定ビスを取り付け\n3. 配線接続\n4. 動作確認\n\nご不明点は担当者にエスカレーションします。',
  'エラー': '障害・エラーが発生した場合は以下の手順で対応してください。\n\n1. エラーコードを記録\n2. 機器の再起動を試みる\n3. 改善しない場合は緊急連絡先へ連絡\n\n**緊急連絡先**: 03-XXXX-XXXX（24時間対応）',
}

function handleWebhook(body, res) {
  const { message, user_role } = body

  // 協力会社はステータス・ログ取得不可
  if (user_role === 'partner') {
    for (const [keyword, response] of Object.entries(FAQ_RESPONSES)) {
      if (message.includes(keyword)) {
        return respond(res, { reply: response, intent: 'faq' })
      }
    }
    return respond(res, {
      reply: 'ご質問の内容について確認します。担当者にエスカレーションしますので、少々お待ちください。',
      intent: 'escalation',
    })
  }

  // 社内: 機番指定のステータス確認
  const machineMatch = message.match(/M-\d{3}|機番[:\s]*(M-\d{3})/i)
  if (machineMatch) {
    const machineNo = machineMatch[0].replace(/機番[:\s]*/i, '').trim()
    const record = FC_RECORDS.find(r => r.machine_no === machineNo)
    if (record) {
      const statusLabel = STATUS_LABELS[record.status]
      return respond(res, {
        reply: `**機番: ${record.machine_no}** のステータス情報\n\n` +
          `ステータス: ${statusLabel}\n` +
          `担当者: ${record.assignee}\n` +
          `業者: ${record.vendor}\n` +
          `住所: ${record.address}\n` +
          (record.note ? `備考: ${record.note}\n` : '') +
          `\n最終更新: ${new Date(record.updated_at).toLocaleString('ja-JP')}`,
        intent: 'status',
      })
    }
    return respond(res, { reply: `機番 ${machineNo} の情報が見つかりませんでした。`, intent: 'unknown' })
  }

  // FAQ
  for (const [keyword, response] of Object.entries(FAQ_RESPONSES)) {
    if (message.includes(keyword)) {
      return respond(res, { reply: response, intent: 'faq' })
    }
  }

  // デフォルト
  respond(res, {
    reply: `「${message}」についてのご質問ですね。\n\nこちらはモックAPIの応答です。\nn8nワークフローと接続後、Claude APIによる自然言語応答に切り替わります。\n\n**利用可能なコマンド（モック）**\n- 機番を入力: 例「M-001のステータスを確認して」\n- 手順確認: 「設置手順を教えて」\n- 障害対応: 「エラーが発生した」`,
    intent: 'unknown',
  })
}

function respond(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify(data))
}

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    return res.end()
  }

  // n8n Webhook モック
  if (req.method === 'POST' && req.url === '/webhook/chat') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        handleWebhook(JSON.parse(body), res)
      } catch {
        res.writeHead(400)
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
    return
  }

  // FC ステータス一覧
  if (req.method === 'GET' && req.url === '/api/fc/records') {
    return respond(res, FC_RECORDS)
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'Not found' }))
})

const PORT = 3001
server.listen(PORT, () => {
  console.log(`Mock API running: http://localhost:${PORT}`)
  console.log(`  POST /webhook/chat  - n8n Webhook モック`)
  console.log(`  GET  /api/fc/records - FC レコード一覧`)
})
