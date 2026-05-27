// ==========================================
// 小松堂おみくじガチャ - 制御スクリプト
// ==========================================

// おみくじデータプール
document.addEventListener("DOMContentLoaded", () => {
    const enterBtn = document.getElementById("enterBtn");
    const machine = document.getElementById("machine");
    const dispensedCapsule = document.getElementById("dispensedCapsule");
    const resultOverlay = document.getElementById("resultOverlay");
    const closeBtn = document.getElementById("closeBtn");

    // 新ギミック用要素
    const capsuleStage = document.getElementById("capsuleStage");
    const splitCapsule = document.getElementById("splitCapsule");
    const capsuleTop = document.getElementById("capsuleTop");
    const capsuleBottom = document.getElementById("capsuleBottom");

    const fortuneRank = document.getElementById("fortuneRank");
    const fortuneMessage = document.getElementById("fortuneMessage");
    const luckyColorSwatch = document.getElementById("luckyColorSwatch");
    const luckyColorName = document.getElementById("luckyColorName");
    const luckyItem = document.getElementById("luckyItem");
    const secretMissionBox = document.getElementById("secretMissionBox");
    const secretMissionText = document.getElementById("secretMissionText");

    const fortunes = [
        { rank: "大吉", message: "最高の朝です！何をやってもうまくいく無敵の一日。駄菓子を大人買いするとさらに運気アップ！", colorName: "黄金色", colorHex: "#ffd700", item: "きなこ棒" },
        { rank: "吉", message: "手堅い一日。小さな幸せが次々と舞い込みそう。穏やかに過ごせます。", colorName: "若竹色", colorHex: "#6b9080", item: "ココアシガレット" },
        { rank: "中吉", message: "なかなかの好調っぷり。友達や家族に小さなプレゼントをすると吉。", colorName: "茜色", colorHex: "#b5179e", item: "ラムネ菓子" },
        { rank: "小吉", message: "いつも通りの平和な一日。平凡こそが最大の幸福です。焦らずのんびりいきましょう。", colorName: "空色", colorHex: "#4ea8de", item: "よっちゃんイカ" },
        { rank: "末吉", message: "少しだけ注意が必要な日。でも、お気に入りの音楽を聴けば不運を吹き飛ばせます。", colorName: "薄墨色", colorHex: "#6c757d", item: "コーラフーセンガム" },
        { rank: "大凶", message: "要注意！落とし物や遅刻の危険性が……。でも大丈夫、裏ミッションをクリアすれば大逆転のチャンス！", colorName: "漆黒", colorHex: "#1a1a1a", item: "ブタメン", mission: "今日、すれ違った人に心の中で「ありがとう」と3回唱えよ。さすれば運気は最高潮へ反転する。" }
    ];

    // 大カプセル用のグラデーション色設定データ
    const colorPairs = [
        { top: "#d62828", bottom: "linear-gradient(to bottom, rgba(220,220,220,0.5) 0%, rgba(255,255,255,0.2) 100%)" },
        { top: "#003049", bottom: "linear-gradient(to bottom, rgba(220,220,220,0.5) 0%, rgba(255,255,255,0.2) 100%)" },
        { top: "#fcbf49", bottom: "linear-gradient(to bottom, rgba(220,220,220,0.5) 0%, rgba(255,255,255,0.2) 100%)" },
        { top: "#70e000", bottom: "linear-gradient(to bottom, rgba(220,220,220,0.5) 0%, rgba(255,255,255,0.2) 100%)" },
        { top: "#7209b7", bottom: "linear-gradient(to bottom, rgba(220,220,220,0.5) 0%, rgba(255,255,255,0.2) 100%)" }
    ];

    // 排出される小さなカプセルのCSS色データ
    const capsuleGradients = [
        "linear-gradient(to bottom, #d62828 0%, #d62828 50%, rgba(220,220,220,0.4) 51%, rgba(255,255,255,0.15) 100%)",
        "linear-gradient(to bottom, #003049 0%, #003049 50%, rgba(220,220,220,0.4) 51%, rgba(255,255,255,0.15) 100%)",
        "linear-gradient(to bottom, #fcbf49 0%, #fcbf49 50%, rgba(220,220,220,0.4) 51%, rgba(255,255,255,0.15) 100%)",
        "linear-gradient(to bottom, #70e000 0%, #70e000 50%, rgba(220,220,220,0.4) 51%, rgba(255,255,255,0.15) 100%)",
        "linear-gradient(to bottom, #7209b7 0%, #7209b7 50%, rgba(220,220,220,0.4) 51%, rgba(255,255,255,0.15) 100%)"
    ];

    let isGachaRunning = false;
    let selectedColorPair = null;

    // ① レバー（ボタン）を押してガチャを回す
    enterBtn.addEventListener("click", () => {
        if (isGachaRunning) return;
        isGachaRunning = true;

        enterBtn.classList.add("triggered");
        machine.classList.add("shake-real");
        machine.classList.add("active");

        dispensedCapsule.style.opacity = "0";
        dispensedCapsule.style.transform = "scale(0)";

        setTimeout(() => {
            machine.classList.remove("shake-real");
            enterBtn.classList.remove("triggered");

            // ランダムに色を1つ選択して、小カプセルにセット
            const randomIndex = Math.floor(Math.random() * capsuleGradients.length);
            dispensedCapsule.style.background = capsuleGradients[randomIndex];
            
            // 後で前に飛び出す大カプセルの色もこれと同じにする
            selectedColorPair = colorPairs[randomIndex];

            dispensedCapsule.style.opacity = "1";
            dispensedCapsule.style.transform = "scale(1)";
        }, 1000);
    });

    // ② 取り出し口のカプセルをクリックしたら、画面の前に大カプセルがズームアップ！
    dispensedCapsule.addEventListener("click", () => {
        // 取り出し口のミニカプセルを消す
        dispensedCapsule.style.opacity = "0";
        
        // 筐体を暗くしてボカす（演出）
        machine.classList.add("blur-mode");

        // 飛び出す大カプセルに色を塗る
        capsuleTop.style.backgroundColor = selectedColorPair.top;
        capsuleBottom.style.background = selectedColorPair.bottom;

        // パカッと割れる初期状態にリセットしてズームアップ
        splitCapsule.classList.remove("cracked");
        splitCapsule.classList.add("zoomed");
    });

    // ③ 飛び出してきた大カプセルをクリックすると、パカッと割れておみくじ出現！
    splitCapsule.addEventListener("click", () => {
        // すでに割れているなら何もしない
        if (splitCapsule.classList.contains("cracked")) return;
        
        // パカッと割る
        splitCapsule.classList.add("cracked");

        // おみくじの結果を選んでセット
        const result = fortunes[Math.floor(Math.random() * fortunes.length)];
        fortuneRank.textContent = result.rank;
        fortuneMessage.textContent = result.message;
        luckyColorName.textContent = result.colorName;
        luckyColorSwatch.style.backgroundColor = result.colorHex;
        luckyItem.textContent = result.item;

        if (result.rank === "大凶" && result.mission) {
            secretMissionText.textContent = result.mission;
            secretMissionBox.style.display = "block";
        } else {
            secretMissionBox.style.display = "none";
        }

        // カプセルが割れた0.4秒後に、奥からおみくじカードがヌッと出てくる
        setTimeout(() => {
            resultOverlay.classList.add("active");
        }, 4000000000); // 誤字修正用：実際は 400ms です
        setTimeout(() => {
            resultOverlay.classList.add("active");
        }, 400);
    });

    // ④ 「店を出る」ボタンで全リセット
    closeBtn.addEventListener("click", () => {
        resultOverlay.classList.remove("active");
        splitCapsule.classList.remove("zoomed");
        splitCapsule.classList.remove("cracked");
        machine.classList.remove("blur-mode");
        machine.classList.remove("active");
        isGachaRunning = false;
    });
});