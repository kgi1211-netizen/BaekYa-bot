const express = require('express');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('백야 링크 강조 알리미 가동 중!'));
app.listen(PORT, '0.0.0.0', () => console.log(`🌐 웹 서버 활성화 (Port: ${PORT})`));

const TOKEN = process.env['DISCORD_TOKEN'];
const CHANNEL_ID = process.env['CHANNEL_ID'];
const TARGET_URL = 'https://www.aion2tool.com/region/%ED%8E%98%EB%A5%B4%EB%85%B8%EC%8A%A4/%EB%B0%B1%EC%95%BC';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function sendAlarm() {
    const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        const embed = new EmbedBuilder()
            .setTitle('🛡️ [백야] 레기온 실시간 아툴 데이터')
            .setURL(TARGET_URL)
            .setColor('#FFFFFF') 
            .setDescription(`## 🔗 [백야 아툴 페이지 클릭](${TARGET_URL})\n━━━━━━━━━━━━━━━━━━━━\n\`\`\`ansi\n[1;34m[ 가동 상태 ][0m [1;32m정상 작동 중[0m\n[1;34m[ 확인 주기 ][0m [1;37m1시간 간격 정기 보고[0m\n\`\`\``)
            .addFields(
                { name: '🏰 **SERVER**', value: '`페르노스`', inline: true },
                { name: '⚔️ **LEGION**', value: '`백야`', inline: true },
                { name: '📅 **CHECK TIME**', value: `**${now}**`, inline: false }
            )
            .setFooter({ text: 'WHITE NIGHT MONITORING SYSTEM' })
            .setTimestamp();

        await channel.send({ embeds: [embed] });
        console.log(`✅ [${now}] 1시간 주기 알림 전송 완료`);
    } catch (e) {
        console.error('❌ 전송 오류:', e.message);
    }
}

client.once('ready', () => {
    console.log(`🚀 ${client.user.tag} 가동 시작!`);
    sendAlarm();
    cron.schedule('0 * * * *', () => sendAlarm(), { scheduled: true, timezone: "Asia/Seoul" });
});

client.login(TOKEN);
