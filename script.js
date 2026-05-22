// ==========================================
// 小松堂おみくじガチャ - 制御スクリプト
// ==========================================

// おみくじデータプール
const fortunes = [
    {
        rank: "大吉",
        message: "今日のあなたは恐るべきポテンシャルを秘めている。眠れる力を解き放つ好機なり！迷わず突き進め！",
        isBad: false
    },
    {
        rank: "中吉",
        message: "穏やかな風が背中を押してくれる予感。午前中にいつもと違う小さな選択をすると、幸運の扉が開くでしょう。",
        isBad: false
    },
    {
        rank: "吉",
        message: "直球勝負が吉と出る一日。小細工は無用、あなたのまっすぐな言葉が相手の心を大きく動かすでしょう。",
        isBad: false
    },
    {
        rank: "大凶",
        message: "何をやっても裏目に出そうな、不穏な影がチラつく予感…！だが恐れることなかれ、大逆転の秘策が残されている。",
        isBad: true // 裏ミッションを発動するフラグ
    }
];

// ラッキーカラーのデータ
const luckyColors = [
    "レトロレモン色", "ハイカラあずき色", "下町ラムネブルー", "夕焼けさんご色", "お抹茶グリーン"
];

// ラッキーアイテム（スマホ壁紙限定のフレーズ含む）のデータ
const luckyItems = [
    "「青空と白い雲」が描かれたスマホ壁紙",
    "「レトロな看板」が写っているスマホ壁紙",
    "「お気に入りの駄菓子」を撮ったスマホ壁紙",
    "「どこか懐かしい路地裏」のスマホ壁紙",
    "ポケットにしのばせた「10円玉」"
];

// ポップな裏ミッションのデータ（大凶用）
const secretMissions = [
    "学校や職場で、新しく友達（または話し相手）を一人作ってみるべし！思いがけない展開が待っているぞ。",
    "校長先生（または職場の一番エラい人）に、自分から元気よく挨拶しに行くべし！大凶の呪いは一瞬で吹き飛ぶだろう。"
];

// カプセルのカラーバリエーション（排出用）
const capsuleColors = ["#ff6b6b", "#4dadf7", "#ffd43b", "#51cf66", "#cc5de8", "#ff922b"];

// DOM要素の取得
const machine = document.getElementById('machine');
const enterBtn = document.getElementById('enterBtn');
const dispensedCapsule = document.getElementById('dispensedCapsule');
const resultOverlay = document.getElementById('resultOverlay');
const closeBtn = document.getElementById('closeBtn');

// 各出力先要素
const fortuneRank = document.getElementById('fortuneRank');
const fortuneMessage = document.getElementById('fortuneMessage');
const luckyColor = document.getElementById('luckyColor');
const luckyItem = document.getElementById('luckyItem');
const secretMissionBox = document.getElementById('secretMissionBox');
const secretMissionText = document.getElementById('secretMissionText');

let isSpinning = false;

// ガチャを回すメイン処理
function spinGacha() {
    if (isSpinning) return;
    isSpinning = true;

    // ボタンの押し込み演出
    enterBtn.classList.add('triggered');
    // 筐体を揺らすアニメーション開始
    machine.classList.add('shake');
    
    // 排出カプセルを一旦初期化
    dispensedCapsule.style.transform = 'translateY(0) scale(1)';
    dispensedCapsule.style.bottom = '-50px';

    // 1.5秒間ガシャガシャさせる
    setTimeout(() => {
        machine.classList.remove('shake');
        enterBtn.classList.remove('triggered');
        
        // ランダムな色でカプセルを取り出し口に落とす
        const randomColor = capsuleColors[Math.floor(Math.random() * capsuleColors.length)];
        dispensedCapsule.style.backgroundColor = randomColor;
        
        // カプセルがコロンと落ちてくるアニメーション
        dispensedCapsule.style.transform = 'translateY(-65px) rotate(360deg)';
        
        // カプセルをクリックできるようにする
        isSpinning = false;
    }, 1500);
}

// カプセルを開けて結果を表示する処理
function openCapsule() {
    // ランダムに結果を選定
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const color = luckyColors[Math.floor(Math.random() * luckyColors.length)];
    const item = luckyItems[Math.floor(Math.random() * luckyItems.length)];

    // テキストの設定
    fortuneRank.textContent = fortune.rank;
    fortuneMessage.textContent = fortune.message;
    luckyColor.textContent = color;
    luckyItem.textContent = item;

    // 大凶（裏ミッション）の判定と処理
    if (fortune.isBad) {
        const mission = secretMissions[Math.floor(Math.random() * secretMissions.length)];
        secretMissionText.textContent = mission;
        secretMissionBox.style.display = 'block';
        fortuneRank.style.color = '#3d342e'; // 大凶は少しダークな色に
    } else {
        secretMissionBox.style.display = 'none';
        fortuneRank.style.color = '#c84b31'; // 通常は朱赤
    }

    // モーダルを開く
    resultOverlay.classList.add('active');
}

// --- イベントリスナーの登録 ---

// 1. 画面上のEnterボタンクリック
enterBtn.addEventListener('click', spinGacha);

// 2. キーボードの「Enter」キー押下連動
window.addEventListener('keydown', (event) => {
    // モーダルが開いていない、かつテキスト入力中でない場合にEnterキーでガチャ起動
    if (event.key === 'Enter' && !resultOverlay.classList.contains('active')) {
        spinGacha();
    }
});

// 3. 排出されたカプセルをクリックして開封
dispensedCapsule.addEventListener('click', openCapsule);

// 4. 店を出る（モーダルを閉じる）
closeBtn.addEventListener('click', () => {
    resultOverlay.classList.remove('active');
    // 次のためにカプセルを戻す
    dispensedCapsule.style.transform = 'translateY(0)';
    dispensedCapsule.style.bottom = '-50px';
});