const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // React 应用的地址
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let text = "患病概率: 90天内患 Severe Left Ventricular Hypertrophy（SLVH）的概率: 42% 180天内患Dilated Left Ventricle（DLV）的概率: 50% 医疗预防建议如下。体重管理: 控制体重，避免肥胖，通过健康饮食和运动保持理想体重。戒烟限酒: 避免吸烟和过量饮酒，这些习惯会增加心脏病风险。定期体检: 每年进行全面体检，特别是心脏健康检查。药物治疗: 在医生指导下使用降压药物，控制血压在正常范围内。急诊准备: 如出现胸痛、气短等症状，立即就医。";
  console.log(text)
  const chunkSize = 10; // 每次发送数据块的大小
  let index = 0;

  const intervalId = setInterval(() => {
    if (index < text.length) {
      const chunk = text.slice(index, index + chunkSize);
      index += chunkSize;
      res.write(`data: ${chunk}\n\n`);
    } else {
      console.log("All data sent, repeating...");
      clearInterval(intervalId); // 清除定时器
    }
  }, 500);

  req.on('close', () => {
    console.log('Connection closed');
    clearInterval(intervalId);
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));